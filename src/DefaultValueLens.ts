import {Lens, NotAnArray} from './Lens'
import {SafeFocusedLens} from './SafeFocusedLens'
import {KeyFocusedLens} from './KeyFocusedLens'
import {IndexFocusedLens} from './IndexFocusedLens'

export class DefaultValueLens<T, Target> extends SafeFocusedLens<T, Target> {
   constructor(private readonly parentLens: Lens<T, Target | undefined>,
               private readonly defaultValue: Target) {
      super()
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

   getPath() {
      return this.parentLens.getPath() + '?.defaultTo(' + JSON.stringify(this.defaultValue) + ')'
   }

   defaultTo<SafeTarget>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      return new DefaultValueLens(this, value)
   }
}
