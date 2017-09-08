import {Lens, NotAnArray, Update} from './Lens'
import {AbstractLens} from './AbstractLens'
import {DefaultValueLens} from './DefaultValueLens'
import {IndexFocusedLens} from './IndexFocusedLens'
import {ThrowIfUndefinedLens} from './ThrowIfUndefinedLens'

export class KeyFocusedLens<T, ParentTarget extends object, K extends keyof ParentTarget, Target extends ParentTarget[K]> extends AbstractLens<T, Target> {
   constructor(private readonly parentLens: Lens<T, ParentTarget>,
               private readonly key: K) {
      super()
   }

   get path() {
      return this.parentLens.path + '.' + this.key
   }


   focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]> {
      return new KeyFocusedLens(this, key)
   }

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined> {
      return new IndexFocusedLens(this, index)
   }

   read(source: T): Target {
      return this.parentLens.read(source)[this.key]
   }

   setValue(newValue: Target): Update<T> {
      return (source: T) => {
         const parent = this.parentLens.read(source) as any
         if (parent[this.key] === newValue) return source
         const parentCopy = {...parent}
         parentCopy[this.key] = newValue
         return this.parentLens.setValue(parentCopy)(source)
      }
   }

   defaultTo<SafeTarget>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      return new DefaultValueLens(this, value)
   }

   throwIfUndefined<SafeTarget>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget> {
      return new ThrowIfUndefinedLens(this)
   }
}
