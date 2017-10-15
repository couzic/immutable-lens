import {FieldsUpdater, FieldUpdaters, FieldValues, Lens, NotAnArray, Updater} from './Lens'
import {pipeUpdaters} from './pipeUpdaters'
import {setFieldValues} from './setFieldValues'
import {updateFields} from './updateFields'

export class ImmutableLens<Source, ParentTarget, Target> implements Lens<Source, Target> {

   constructor(public readonly path: string,
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
         (source: Source) => this.read(source),
         (target: Target) => target[key],
         (newValue: Target[K]) => (target: Target) => setFieldValues(target, {[key]: newValue} as any),
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
         (source: Source) => this.read(source),
         (target: Item[]) => target[index],
         (newValue: Item) => (target: Item[]) => {
            if (target[index] === newValue) return target
            const targetCopy = [...target]
            targetCopy[index] = newValue
            return targetCopy
         },
         (target: Item[]) => this.setValue(target)
      )
   }

   defaultTo<SafeTarget>(this: Lens<Source, SafeTarget | undefined>, defaultValue: SafeTarget): Lens<Source, SafeTarget> {
      if (this.path.endsWith('throwIfUndefined')) {
         return new ImmutableLens(
            this.path.slice(0, -'?.throwIfUndefined'.length) + '?.defaultTo(' + JSON.stringify(defaultValue) + ')',
            (source: Source) => (this as ImmutableLens<Source, Target, SafeTarget>).readParentTargetFromSource(source) as any,
            (target: SafeTarget | undefined) => target || defaultValue,
            (newValue: SafeTarget) => () => newValue,
            (target: SafeTarget | undefined) => this.setValue(target)
         )
      }
      return new ImmutableLens(
         this.path + '?.defaultTo(' + JSON.stringify(defaultValue) + ')',
         (source: Source) => this.read(source),
         (target: SafeTarget | undefined) => target || defaultValue,
         (newValue: SafeTarget) => () => newValue,
         (target: SafeTarget | undefined) => this.setValue(target)
      )
   }

   throwIfUndefined<SafeTarget>(this: Lens<Source, SafeTarget | undefined>): Lens<Source, SafeTarget> {
      if (this.path.endsWith('throwIfUndefined')) return this as any
      return new ImmutableLens(
         this.path + '?.throwIfUndefined',
         (source: Source) => this.read(source),
         (target: SafeTarget | undefined) => {
            if (!target) throw Error('Unable to read data: ' + target)
            return target
         },
         (newValue: SafeTarget) => () => newValue,
         (target: SafeTarget | undefined) => this.setValue(target)
      )
   }

   /////////////
   // UPDATE //
   ///////////

   setValue(value: Target): Updater<Source> {
      return (source: Source) => {
         const parentTarget = this.readParentTargetFromSource(source)
         const updatedParentTarget = this.updateOnParentTarget(value)(parentTarget)
         return this.updateParentTargetOnSource(updatedParentTarget)(source)
      }
   }

   update(updater: Updater<Target>): Updater<Source> {
      return (source: Source) => {
         const value = this.read(source)
         const newValue = updater(value)
         if (newValue === value) return source
         return this.setValue(newValue)(source)
      }
   }

   setFieldValues(newValues: FieldValues<Target>): Updater<Source> {
      return (source: Source) => {
         const currentTarget = this.read(source)
         const updatedTarget = setFieldValues(currentTarget, newValues)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
   }

   updateFields(updaters: FieldUpdaters<Target>): Updater<Source> {
      return (source: Source) => {
         const currentTarget = this.read(source)
         const updatedTarget = updateFields(currentTarget, updaters)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
   }

   updateFieldValues(fieldsUpdater: FieldsUpdater<Target>): Updater<Source> {
      return (source: Source) => {
         const currentTarget = this.read(source)
         const newValues = fieldsUpdater(currentTarget)
         const updatedTarget = setFieldValues(currentTarget, newValues)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
   }

   pipe(...updaters: Updater<Target>[]): Updater<Source> {
      return this.update(pipeUpdaters(...updaters))
   }

}
