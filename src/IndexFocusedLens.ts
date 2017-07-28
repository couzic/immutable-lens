import {FieldUpdaters, FieldValues, Lens, ValueUpdater} from './Lens'
import {DefaultValueLens} from './DefaultValueLens'

export class IndexFocusedLens<T, Item> implements Lens<T, Item> {
   constructor(private readonly parentLens: Lens<T, Item[]>,
               private readonly index: number) {
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

   setValue(source: T, newValue: Item): T {
      const array = this.parentLens.read(source)
      if (array[this.index] === newValue) return source
      const copy = [...array]
      copy[this.index] = newValue
      return this.parentLens.setValue(source, copy)
   }

   update(source: T, updater: ValueUpdater<Item>): T {
      const value = this.read(source)
      if (value === undefined) throw Error('No value defined at ' + this.getPath())
      const newValue = updater(value)
      return this.setValue(source, newValue)
   }

   setFieldValues(source: T, fields: FieldValues<Item>): T {
      throw Error('setFieldValues() can NOT be called on a Lens focused on a possibly undefined value. Try calling defaultTo() first.')
   }

   updateFields(source: T, fields: FieldUpdaters<Item>): T {
      throw Error('updateFields() can NOT be called on a Lens focused on a possibly undefined value. Try calling defaultTo() first.')
   }

   getPath() {
      return this.parentLens.getPath() + `[${this.index}]`
   }

   defaultTo<SafeTarget>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      return new DefaultValueLens(this, value)
   }

   abortIfUndefined<SafeTarget>(): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }
}
