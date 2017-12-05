import { cherryPick } from './cherryPick'
import { FieldLenses, FieldsUpdater, FieldUpdaters, FieldValues, Lens, NotAnArray, Updater } from './Lens'
import { pipeUpdaters } from './pipeUpdaters'
import { setFieldValues } from './setFieldValues'
import { updateFields } from './updateFields'

export enum LensType {
   ROOT,
   KEY_FOCUSED,
   INDEX_FOCUSED,
   DEFAULT_VALUE,
   THROW_IF_UNDEFINED,
   RECOMPOSED
}

export class ImmutableLens<Source, ParentTarget, Target> implements Lens<Source, Target> {

   constructor(public readonly path: string,
      private readonly type: LensType,
      private readonly readParentTargetFromSource: (source: Source) => ParentTarget,
      private readonly readFromParentTarget: (parentTarget: ParentTarget) => Target,
      private readonly updateOnParentTarget: (target: Target) => Updater<ParentTarget>,
      private readonly updateParentTargetOnSource: (parentTarget: ParentTarget) => Updater<Source>) {
   }

   read(source: Source): Target {
      const parentTarget = this.readParentTargetFromSource(source)
      return this.readFromParentTarget(parentTarget)
   }

   ////////////
   // FOCUS //
   //////////

   focusOn<K extends keyof Target>(this: Lens<Source, Target & NotAnArray>, key: K): Lens<Source, Target[K]> {
      return new ImmutableLens(
         this.path + '.' + key,
         LensType.KEY_FOCUSED,
         (source: Source) => this.read(source),
         (target: Target) => target[key],
         (newValue: Target[K]) => (target: Target) => setFieldValues(target, { [key]: newValue } as any),
         (target: Target) => this.setValue(target)
      )
   }

   focus<NewTarget>(
      get: (value: Target) => NewTarget,
      set: (newValue: NewTarget) => Updater<Target>
   ): Lens<Source, NewTarget> {
      return new ImmutableLens<Source, Target, NewTarget>(
         this.path + '.focus()',
         LensType.KEY_FOCUSED,
         (source: Source) => this.read(source),
         get,
         set,
         (target: Target) => this.setValue(target)
      )
   }

   focusPath(...keys: any[]) {
      let lens: any = this
      keys.forEach(key => lens = lens.focusOn(key))
      return lens
   }

   focusIndex<Item>(this: Lens<Source, Item[]>, index: number): Lens<Source, Item | undefined> {
      return new ImmutableLens(
         this.path + '[' + index + ']',
         LensType.INDEX_FOCUSED,
         (source: Source) => this.read(source),
         (target: Item[]) => target[index],
         (newValue: Item) => (target: Item[]) => {
            if (target[index] === newValue) return target
            const targetCopy = [...target]
            targetCopy[index] = newValue
            return targetCopy
         },
         (target: Item[]) => this.setValue(target)
      ) as Lens<Source, Item | undefined>
   }

   defaultTo<SafeTarget>(this: ImmutableLens<Source, ParentTarget, SafeTarget | undefined>, defaultValue: SafeTarget): Lens<Source, SafeTarget> {
      if (this.type === LensType.THROW_IF_UNDEFINED) {
         return new ImmutableLens(
            this.path.slice(0, -'?.throwIfUndefined'.length) + '?.defaultTo(' + JSON.stringify(defaultValue) + ')',
            LensType.DEFAULT_VALUE,
            (source: Source) => this.readParentTargetFromSource(source) as any,
            (target: SafeTarget | undefined) => target || defaultValue,
            (newValue: SafeTarget) => () => newValue,
            (target: SafeTarget | undefined) => this.setValue(target)
         )
      }
      return new ImmutableLens(
         this.path + '?.defaultTo(' + JSON.stringify(defaultValue) + ')',
         LensType.DEFAULT_VALUE,
         (source: Source) => this.read(source),
         (target: SafeTarget | undefined) => target || defaultValue,
         (newValue: SafeTarget) => () => newValue,
         (target: SafeTarget | undefined) => this.setValue(target)
      )
   }

   throwIfUndefined<SafeTarget>(this: ImmutableLens<Source, ParentTarget, SafeTarget | undefined>): Lens<Source, SafeTarget> {
      if (this.type === LensType.THROW_IF_UNDEFINED) return this as any
      return new ImmutableLens(
         this.path + '?.throwIfUndefined',
         LensType.THROW_IF_UNDEFINED,
         (source: Source) => this.read(source),
         (target: SafeTarget | undefined) => {
            if (!target) throw Error('Unable to read data: ' + target)
            return target
         },
         (newValue: SafeTarget) => () => newValue,
         (target: SafeTarget | undefined) => this.setValue(target)
      )
   }

   recompose<Composition>(fieldLenses: FieldLenses<Target, Composition>): Lens<Source, Composition> {
      if (typeof fieldLenses === 'function') throw Error('Lens.recompose() received a function as an argument. This is NOT supported.')
      return new ImmutableLens(
         'recomposed({' + Object.keys(fieldLenses).join(', ') + '})',
         LensType.RECOMPOSED,
         source => this.read(source),
         target => cherryPick(target as any, fieldLenses),
         composition => {
            const keys = Object.keys(composition)
            const updaters = keys.map(key => {
               const fieldValue = (composition as any)[key]
               const lens = (fieldLenses as any)[key]
               if (lens === undefined) {
                  throw Error(`Property "${key}" does not exist in recomposed Lens { ${Object.keys(fieldLenses).join(', ')} }`)
               }
               return lens.setValue(fieldValue)
            })
            return pipeUpdaters(...updaters)
         },
         target => this.setValue(target)
      )
   }

   /////////////
   // UPDATE //
   ///////////

   setValue(value: Target) {
      const updater = (source: Source) => {
         const parentTarget = this.readParentTargetFromSource(source)
         const updatedParentTarget = this.updateOnParentTarget(value)(parentTarget)
         return this.updateParentTargetOnSource(updatedParentTarget)(source)
      }
      setFunctionName(updater, 'setValue')
      return updater
   }

   update(updater: Updater<Target>): Updater<Source> {
      const createdUpdater = (source: Source) => {
         const value = this.read(source)
         const newValue = updater(value)
         if (newValue === value) return source
         return this.setValue(newValue)(source)
      }
      setFunctionName(createdUpdater, 'update')
      return createdUpdater
   }

   setFieldValues(newValues: FieldValues<Target>): Updater<Source> {
      const updater = (source: Source) => {
         const currentTarget = this.read(source)
         const updatedTarget = setFieldValues(currentTarget, newValues)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
      setFunctionName(updater, 'setFieldValues')
      return updater
   }

   updateFields(updaters: FieldUpdaters<Target>): Updater<Source> {
      const updater = (source: Source) => {
         const currentTarget = this.read(source)
         const updatedTarget = updateFields(currentTarget, updaters)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
      setFunctionName(updater, 'updateFields')
      return updater
   }

   updateFieldValues(fieldsUpdater: FieldsUpdater<Target>): Updater<Source> {
      const updater = (source: Source) => {
         const currentTarget = this.read(source)
         const newValues = fieldsUpdater(currentTarget)
         const updatedTarget = setFieldValues(currentTarget, newValues)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
      setFunctionName(updater, 'updateFieldValues')
      return updater
   }

   pipe(...updaters: Updater<Target>[]): Updater<Source> {
      const updater = this.update(pipeUpdaters(...updaters))
      setFunctionName(updater, 'pipe')
      return updater
   }

}

function setFunctionName(f: any, name: string) {
   Object.defineProperty(f, 'name', {
      value: name,
      writable: false,
      enumerable: false,
      configurable: true
   });
}

function asKeyList<Target>(object: FieldUpdaters<Target>): string {
   return Object.keys(object)
      .map(key => {
         const fieldUpdater = (object as any)[key]
         return fieldUpdater.name === key
            ? key
            : key + ': ' + fieldUpdater.name
      })
      .join(', ')
}
