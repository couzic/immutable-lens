import {FieldUpdaters, FieldValues, Lens, NotAnArray, ValueUpdater} from './Lens'
import {KeyFocusedLens} from './KeyFocusedLens'
import {IndexFocusedLens} from './IndexFocusedLens'
import {updateFields} from './updateFields'
import {setFieldValues} from './setFieldValues'

export class DefaultValueLens<T, Target> implements Lens<T, Target> {
   constructor(private readonly parentLens: Lens<T, Target | undefined>,
               private readonly defaultValue: Target) {
   }

   focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]> {
      return new KeyFocusedLens(this, key)
   }

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined> {
      return new IndexFocusedLens(this, index)
   }

   read(source: T): Target {
      const value = this.parentLens.read(source)
      if (value === undefined) return this.defaultValue
      else return value
   }

   setValue(source: T, newValue: Target): T {
      return this.parentLens.setValue(source, newValue)
   }

   update(source: T, updater: ValueUpdater<Target>): T {
      const value = this.read(source)
      if (value === undefined) throw Error('No value defined at ' + this.getPath())
      const newValue = updater(value)
      return this.setValue(source, newValue)
   }

   setFieldValues(source: T, fields: FieldValues<Target>): T {
      const currentTarget = this.read(source)
      const updatedTarget = setFieldValues(currentTarget, fields)
      // TODO Optimize by checking target references here (save a read() in setValue())
      return this.setValue(source, updatedTarget)
   }

   updateFields(source: T, fields: FieldUpdaters<Target>): T {
      const currentTarget = this.read(source)
      const updatedTarget = updateFields(currentTarget, fields)
      // TODO Optimize by checking target references here (save a read() in setValue())
      return this.setValue(source, updatedTarget)
   }

   getPath() {
      return this.parentLens.getPath() + '?.defaultTo(' + JSON.stringify(this.defaultValue) + ')'
   }

   defaultTo<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      return new DefaultValueLens(this, value)
   }

   abortIfUndefined<SafeTarget>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }

}
