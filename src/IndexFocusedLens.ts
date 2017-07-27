import {FieldsUpdater, Lens, ValueUpdater} from './Lens'
import {updateFields} from './updateFields'

export class IndexFocusedLens<T, Item> implements Lens<T, Item> {
   constructor(private readonly parentLens: Lens<T, Item[]>,
               private readonly index: number) {
   }

   focusOn<K extends keyof Item>(key: K): Lens<T, Item[K]> {
      throw Error('Can NOT focus on a property of a possibly undefined target')
   }

   focusIndex<Item>(index: number): Lens<T, Item | undefined> {
      throw new Error("Method not implemented.")
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

   updateFields(source: T, fields: FieldsUpdater<Item>): T {
      const updatedFields = updateFields(this.read(source), fields)
      return this.setValue(source, updatedFields)
   }

   getPath() {
      return this.parentLens.getPath() + `[${this.index}]`
   }

   defaultTo<SafeTarget>(value: SafeTarget): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }

   abortIfUndefined<SafeTarget>(): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }
}
