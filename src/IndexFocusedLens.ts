import {FieldUpdaters, FieldValues, Lens, Updater} from './Lens'
import {DefaultValueLens} from './DefaultValueLens'
import {AbstractLens} from './AbstractLens'
import {ThrowIfUndefinedLens} from './ThrowIfUndefinedLens'

export class IndexFocusedLens<T, Item> extends AbstractLens<T, Item> {
   constructor(private readonly parentLens: Lens<T, Item[]>,
               private readonly index: number) {
      super()
   }

   get path() {
      return this.parentLens.path + `[${this.index}]`
   }

   focusOn<K extends keyof Item>(key: K): Lens<T, Item[K]> {
      throw Error('Can NOT focus on a property of a possibly undefined value')
   }

   focusIndex<Item>(index: number): Lens<T, Item | undefined> {
      throw Error('Can NOT focus on an index of a possibly undefined value')
   }

   read(source: T): Item {
      return this.parentLens.read(source)[this.index]
   }

   setValue(newValue: Item): Updater<T> {
      return (source: T) => {
         const array = this.parentLens.read(source)
         if (array[this.index] === newValue) return source
         const copy = [...array]
         copy[this.index] = newValue
         return this.parentLens.setValue(copy)(source)
      }
   }

   setFieldValues(newValues: FieldValues<Item>): Updater<T> {
      throw Error('setFieldValues() can NOT be called on a Lens focused on a possibly undefined value. Try calling defaultTo() first.')
   }

   updateFields(updaters: FieldUpdaters<Item>): Updater<T> {
      throw Error('updateFields() can NOT be called on a Lens focused on a possibly undefined value. Try calling defaultTo() first.')
   }

   defaultTo<SafeTarget>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      return new DefaultValueLens(this, value)
   }

   throwIfUndefined<SafeTarget>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget> {
      return new ThrowIfUndefinedLens(this)
   }
}
