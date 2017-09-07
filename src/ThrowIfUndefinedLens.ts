import {Lens, NotAnArray, Update} from './Lens'
import {AbstractLens} from './AbstractLens'
import {KeyFocusedLens} from './KeyFocusedLens'
import {IndexFocusedLens} from './IndexFocusedLens'
import {DefaultValueLens} from "./DefaultValueLens"

export class ThrowIfUndefinedLens<T, Target> extends AbstractLens<T, Target> {
   constructor(private readonly parentLens: Lens<T, Target | undefined>) {
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
      if (value === undefined) throw Error('Unable to read data: Undefined value')
      else return value
   }

   setValue(newValue: Target): Update<T> {
      return this.parentLens.setValue(newValue)
   }

   getPath() {
      return this.parentLens.getPath() + '?.throwIfUndefined'
   }

   defaultTo<SafeTarget>(this: ThrowIfUndefinedLens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      return new DefaultValueLens(this.parentLens, value)
   }

   throwIfUndefined<SafeTarget>(this: Lens<T, SafeTarget>): Lens<T, SafeTarget> {
      return this
   }
}