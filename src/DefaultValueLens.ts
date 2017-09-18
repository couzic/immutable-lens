import {Lens, NotAnArray, Updater} from './Lens'
import {AbstractLens} from './AbstractLens'
import {KeyFocusedLens} from './KeyFocusedLens'
import {IndexFocusedLens} from './IndexFocusedLens'
import {ThrowIfUndefinedLens} from './ThrowIfUndefinedLens'

export class DefaultValueLens<T, Target> extends AbstractLens<T, Target> {
   constructor(private readonly parentLens: Lens<T, Target | undefined>,
               private readonly defaultValue: Target) {
      super()
   }

   get path() {
      return this.parentLens.path + '?.defaultTo(' + JSON.stringify(this.defaultValue) + ')'
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

   setValue(newValue: Target): Updater<T> {
      return this.parentLens.setValue(newValue)
   }

   defaultTo<SafeTarget>(this: DefaultValueLens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      return new DefaultValueLens(this.parentLens, value)
   }

   throwIfUndefined<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget> {
      return new ThrowIfUndefinedLens(this)
   }
}
