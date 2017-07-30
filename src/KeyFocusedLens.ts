import {Lens, NotAnArray} from './Lens'
import {AbstractLens} from './AbstractLens'
import {DefaultValueLens} from './DefaultValueLens'
import {IndexFocusedLens} from './IndexFocusedLens'

export class KeyFocusedLens<T, ParentTarget extends object, K extends keyof ParentTarget, Target extends ParentTarget[K]> extends AbstractLens<T, Target> {
   constructor(private readonly parentLens: Lens<T, ParentTarget>,
               private readonly key: K) {
      super()
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

   setValue(source: T, newValue: Target): T {
      const parent = this.parentLens.read(source) as any
      if (parent[this.key] === newValue) return source
      const parentCopy = {...parent}
      parentCopy[this.key] = newValue
      return this.parentLens.setValue(source, parentCopy)
   }

   getPath() {
      return this.parentLens.getPath() + '.' + this.key
   }

   defaultTo<SafeTarget>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget> {
      return new DefaultValueLens(this, value)
   }
}
