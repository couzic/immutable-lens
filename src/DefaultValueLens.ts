import {FieldsUpdater, Lens, NotAnArray, ValueUpdater} from './Lens'
import {KeyFocusedLens} from './KeyFocusedLens'

export class WithDefaultValueLens<T, Target> implements Lens<T, Target> {
   constructor(private readonly parentLens: Lens<T, Target | undefined>,
               private readonly defaultValue: Target) {
   }

   focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]> {
      return new KeyFocusedLens(this, key)
   }

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined> {
      throw new Error("Method not implemented.")
   }

   read(source: T): Target {
      const value = this.parentLens.read(source)
      if (value === undefined) return this.defaultValue
      else return value
   }

   setValue(source: T, newValue: Target): T {
      throw new Error("Method not implemented.")
   }

   update(source: T, updater: ValueUpdater<Target>): T {
      throw new Error("Method not implemented.")
   }

   updateFields(this: Lens<T, Target & NotAnArray>, source: T, fields: FieldsUpdater<Target>): T {
      throw new Error("Method not implemented.")
   }

   getPath(): string {
      throw new Error("Method not implemented.")
   }

   defaultTo<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }

   abortIfUndefined<SafeTarget>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget> {
      throw new Error("Method not implemented.")
   }

}
