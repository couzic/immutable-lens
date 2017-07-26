import {RootLens} from './RootLens'

export interface NotAnArray {
   reduceRight?: 'NotAnArray'
}

export interface ValueUpdater<V> {
   (value: V): V
}

export type FieldsUpdater<T> = object & NotAnArray & { [K in keyof T]?: T[K] | ValueUpdater<T[K]> }

export interface Lens<T, Target> {
   focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]>

   // focusAt<NewTarget>(lens: Lens<Target, NewTarget>): Lens<T, NewTarget>

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined>

   read(source: T): Target

   setValue(source: T, newValue: Target): T

   update(source: T, updater: ValueUpdater<Target>): T

   updateFields(this: Lens<T, Target & NotAnArray>, source: T, fields: FieldsUpdater<Target>): T

   getPath(): string

   defaultTo<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget>

   abortIfUndefined<SafeTarget>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>
}

export interface UnfocusedLens<T> extends Lens<T, T> {
}

export function createLens<T extends object>(instance?: T): UnfocusedLens<T> {
   return new RootLens<T>()
}
