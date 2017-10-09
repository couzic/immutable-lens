import {FieldsUpdater, FieldUpdaters, FieldValues, Lens, UnfocusedLens, Updater} from './Lens'
import {KeyFocusedLens} from './KeyFocusedLens'
import {IndexFocusedLens} from './IndexFocusedLens'
import {updateFields} from './updateFields'
import {setFieldValues} from './setFieldValues'
import {pipeUpdaters} from './pipeUpdaters'

export class RootLens<T extends {}> implements UnfocusedLens<T> {

   get path() {
      return 'source'
   }

   focusOn<K extends keyof T>(key: K): Lens<T, T[K]> {
      return new KeyFocusedLens(this, key)
   }

   focusPath(...keys: any[]) {
      let lens: any = this
      keys.forEach(key => lens = lens.focusOn(key))
      return lens
   }

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined> {
      return new IndexFocusedLens(this, index)
   }

   read(source: T): T {
      return source
   }

   setValue(newValue: T): Updater<T> {
      return () => newValue
   }

   update(updater: Updater<T>): Updater<T> {
      return updater
   }

   setFieldValues(newValues: FieldValues<T>): Updater<T> {
      return (source: T) => setFieldValues(source, newValues)
   }

   updateFields(updaters: FieldUpdaters<T>): Updater<T> {
      return (source: T) => updateFields(source, updaters)
   }

   updateFieldValues(fieldsUpdater: FieldsUpdater<T>): Updater<T> {
      return (source: T) => setFieldValues(source, fieldsUpdater(source))
   }

   pipe(...updaters: Updater<T>[]): Updater<T> {
      return pipeUpdaters(...updaters)
   }

   // TODO Support optional types
   defaultTo<SafeTarget>(value: SafeTarget): Lens<T, SafeTarget> {
      throw Error('createLens() does NOT support optional types')
   }

   // TODO Support optional types
   throwIfUndefined<SafeTarget>(): Lens<T, SafeTarget> {
      throw Error('createLens() does NOT support optional types')
   }

}

