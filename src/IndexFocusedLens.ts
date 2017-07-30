import {FieldUpdaters, FieldValues, Lens} from './Lens'
import {DefaultValueLens} from './DefaultValueLens'
import {AbstractLens} from './AbstractLens'

export class IndexFocusedLens<T, Item> extends AbstractLens<T, Item> {
   constructor(private readonly parentLens: Lens<T, Item[]>,
               private readonly index: number) {
      super()
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
}
