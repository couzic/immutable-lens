import {FieldLenses, FieldsUpdater, FieldUpdaters, FieldValues, Lens, NotAnArray, Updater} from './Lens'
import {extract} from './extract'
import {keysOf} from './keysOf'
import {pipeUpdaters} from './pipeUpdaters'
import {ImmutableLens} from './ImmutableLens'
import {setFieldValues} from './setFieldValues'

export class ComposedLens<Source extends object, Composition> implements Lens<Source, Composition> {

   constructor(private readonly fieldLenses: FieldLenses<Source, Composition>) {
      if (typeof fieldLenses === 'function') throw Error('createComposedLens().withFields() received a function as an argument. This is NOT supported.')
   }

   get path() {
      return `composed({${keysOf(this.fieldLenses).map(key => key + ':' + (this.fieldLenses[key] as any).path).join(', ')}})`
   }

   focusOn<K extends keyof Composition>(this: Lens<Source, Composition & NotAnArray>, key: K): Lens<Source, Composition[K]> {
      return new ImmutableLens(
         this.path + '.' + key,
         (source: Source) => this.read(source),
         (target: Composition) => target[key],
         (newValue: Composition[K]) => (target: Composition) => setFieldValues(target, {[key]: newValue} as any),
         (target: Composition) => this.setValue(target)
      )
   }

   focusPath(...keys: any[]) {
      let lens: any = this
      keys.forEach(key => lens = lens.focusOn(key))
      return lens
   }

   focusIndex<Item>(this: Lens<Source, Item[]>, index: number): Lens<Source, Item | undefined> {
      throw Error('createComposedLens().withFields() is necessarily an object-focused lens. It can NOT focusIndex().')
   }

   read(source: Source): Composition {
      return extract(source, this.fieldLenses)
   }

   setValue(newValue: Composition): Updater<Source> {
      return this.setFieldValues(newValue)
   }

   update(updater: Updater<Composition>): Updater<Source> {
      return (source: Source): Source => {
         const composition = this.read(source)
         const newValue = updater(composition)
         return this.setValue(newValue)(source)
      }
   }

   setFieldValues(newValues: FieldValues<Composition>): Updater<Source> {
      const keys = Object.keys(newValues)
      const updaters = keys.map(key => {
         const newValue = (newValues as any)[key]
         const lens = (this.fieldLenses as any)[key]
         return lens.setValue(newValue)
      })
      return pipeUpdaters(...updaters)
   }

   updateFields(updaters: FieldUpdaters<Composition>): Updater<Source> {
      const keys = Object.keys(updaters)
      const sourceUpdaters = keys.map(key => {
         const updater = (updaters as any)[key]
         const lens = (this.fieldLenses as any)[key]
         return lens.update(updater)
      })
      return pipeUpdaters(...sourceUpdaters)
   }

   updateFieldValues(fieldsUpdater: FieldsUpdater<Composition>): Updater<Source> {
      return (source: Source): Source => {
         const composition = this.read(source)
         const newValues = fieldsUpdater(composition)
         return this.setFieldValues(newValues)(source)
      }
   }

   pipe(...updaters: Updater<Composition>[]): Updater<Source> {
      const sourceUpdaters = updaters.map(updater => (source: Source): Source => {
         const composition = this.read(source)
         const newValue = updater(composition)
         return this.setValue(newValue)(source)
      })
      return pipeUpdaters(...sourceUpdaters)
   }

   defaultTo<SafeTarget>(this: Lens<Source, SafeTarget | undefined>, value: SafeTarget): Lens<Source, SafeTarget> {
      throw Error('Composed lens always has a defined value')
   }

   throwIfUndefined<SafeTarget>(this: Lens<Source, SafeTarget | undefined>): Lens<Source, SafeTarget> {
      throw Error('Composed lens always has a defined value')
   }

}
