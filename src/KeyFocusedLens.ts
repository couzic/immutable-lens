import {FieldsUpdater, Lens, ValueUpdater} from './Lens'
import {DefaultValueLens} from './DefaultValueLens'
import {updateFields} from './updateFields'
import {IndexFocusedLens} from './IndexFocusedLens'

export class KeyFocusedLens<T, ParentTarget extends object, K extends keyof ParentTarget, Target extends ParentTarget[K]> implements Lens<T, Target> {
   constructor(private readonly parentLens: Lens<T, ParentTarget>,
               private readonly key: K) {
   }

   focusOn<K extends keyof Target>(key: K): Lens<T, Target[K]> {
      return new KeyFocusedLens(this, key)
   }

   focusIndex<Item>(index: number): Lens<T, Item | undefined> {
      return new IndexFocusedLens(this, index)
   }

   read(source: T): Target {
      return this.parentLens.read(source)[this.key]
   }

   setValue(source: T, newValue: Target): T {
      const parent = this.parentLens.read(source) as any
      if (parent[this.key] === newValue) return source
      const parentCopy = {...parent}
      parentCopy[this.key] = newValue
      return this.parentLens.setValue(source, parentCopy)
   }

   update(source: T, updater: ValueUpdater<Target>): T {
      const value = this.read(source)
      if (value === undefined) throw Error('No value defined at ' + this.getPath())
      const newValue = updater(value)
      return this.setValue(source, newValue)
   }

   updateFields(source: T, fields: FieldsUpdater<Target>): T {
      const updatedFields = updateFields(this.read(source), fields)
      return this.setValue(source, updatedFields)
   }

   getPath() {
      return this.parentLens.getPath() + '.' + this.key
   }

   defaultTo<SafeTarget>(value: SafeTarget): Lens<T, SafeTarget> {
      return new DefaultValueLens(this, value)
   }

   abortIfUndefined<SafeTarget>(): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }
}
