import {FieldsUpdater, Lens, UnfocusedLens, ValueUpdater} from './Lens'
import {KeyFocusedLens} from './KeyFocusedLens'
import {IndexFocusedLens} from './IndexFocusedLens'
import {updateFields} from './updateFields'

export class RootLens<T extends object> implements UnfocusedLens<T> {
   focusOn<K extends keyof T>(key: K): Lens<T, T[K]> {
      return new KeyFocusedLens(this, key)
   }

   // focusAt<NewTarget>(lens: Lens<T, NewTarget>): Lens<T, NewTarget> {
   //    throw new Error("Method not implemented.")
   // }

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined> {
      return new IndexFocusedLens(this, index)
   }

   read(source: T): T {
      return source
   }

   setValue(source: T, newValue: T): T {
      return newValue
   }

   update(source: T, updater: ValueUpdater<T>): T {
      return updater(source)
   }

   updateFields(source: T, fields: FieldsUpdater<T>): T {
      return updateFields(source, fields)
   }

   getPath() {
      return 'source'
   }

   defaultTo<SafeTarget>(value: SafeTarget): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }

   abortIfUndefined<SafeTarget>(): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }
}

