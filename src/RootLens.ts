import {FieldUpdaters, FieldValues, Lens, UnfocusedLens, ValueUpdater} from './Lens'
import {KeyFocusedLens} from './KeyFocusedLens'
import {IndexFocusedLens} from './IndexFocusedLens'
import {updateFields} from './updateFields'
import {setFieldValues} from './setFieldValues'

export class RootLens<T extends object> implements UnfocusedLens<T> {
   focusOn<K extends keyof T>(key: K): Lens<T, T[K]> {
      return new KeyFocusedLens(this, key)
   }

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

   setFieldValues(source: T, fields: FieldValues<T>): T {
      return setFieldValues(source, fields)
   }

   updateFields(source: T, fields: FieldUpdaters<T>): T {
      return updateFields(source, fields)
   }

   getPath() {
      return 'source'
   }

   defaultTo<SafeTarget>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      throw Error('createLens() does NOT support optional types')
   }

   abortIfUndefined<SafeTarget>(): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }
}

