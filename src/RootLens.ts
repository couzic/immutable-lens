import {FieldUpdaters, FieldValues, Lens, UnfocusedLens, FocusedUpdater} from './Lens'
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

   setValue(newValue: T): FocusedUpdater<T> {
      return () => newValue
   }

   update(updater: FocusedUpdater<T>): FocusedUpdater<T> {
      return updater
   }

   setFieldValues(fields: FieldValues<T>): FocusedUpdater<T> {
      return (source: T) => setFieldValues(source, fields)
   }

   updateFields(fields: FieldUpdaters<T>): FocusedUpdater<T> {
      return (source: T) => updateFields(source, fields)
   }

   getPath() {
      return 'source'
   }

   defaultTo<SafeTarget>(value: SafeTarget): Lens<T, SafeTarget> {
      throw Error('createLens() does NOT support optional types')
   }
}

