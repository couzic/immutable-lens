import {RootLens} from './RootLens'

export interface NotAnArray {
   reduceRight?: 'NotAnArray'
}

export interface ValueUpdater<V> {
   (value: V): V
}

export type FieldValues<T> = object & NotAnArray & { [K in keyof T]?: T[K] }

export type FieldUpdaters<T> = object & NotAnArray & { [K in keyof T]?: ValueUpdater<T[K]> }

export interface Lens<T, Target> {
   focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]>

   // focusAt<NewTarget>(lens: Lens<Target, NewTarget>): Lens<T, NewTarget>

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined>

   read(source: T): Target

   setValue(newValue: Target): ValueUpdater<T>

   update(updater: ValueUpdater<Target>): ValueUpdater<T>

   setFieldValues(this: Lens<T, Target & NotAnArray>, fields: FieldValues<Target>): ValueUpdater<T>

   updateFields(this: Lens<T, Target & NotAnArray>, updaters: FieldUpdaters<Target>): ValueUpdater<T>

   getPath(): string

   defaultTo<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget>

   // abortIfUndefined<SafeTarget>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>
}

export interface UnfocusedLens<T> extends Lens<T, T> {
}

export function createLens<T extends object>(instance?: T): UnfocusedLens<T> {
   return new RootLens<T>()
}
