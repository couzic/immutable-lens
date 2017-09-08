import {RootLens} from './RootLens'

export interface NotAnArray {
   reduceRight?: 'NotAnArray'
}

export type Update<T> = (value: T) => T

export type FieldValues<T> = object & NotAnArray & { [K in keyof T]?: T[K] }

export type FieldUpdates<T> = object & NotAnArray & { [K in keyof T]?: Update<T[K]> }

export interface Lens<T, Target> {

   readonly path: string

   focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]>

   // focusAt<NewTarget>(lens: Lens<Target, NewTarget>): Lens<T, NewTarget>

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined>

   read(source: T): Target

   setValue(newValue: Target): Update<T>

   update(update: Update<Target>): Update<T>

   setFieldValues(this: Lens<T, Target & NotAnArray>, newValues: FieldValues<Target>): Update<T>

   updateFields(this: Lens<T, Target & NotAnArray>, fieldUpdates: FieldUpdates<Target>): Update<T>

   pipe(...updates: Update<Target>[]): Update<T>

   defaultTo<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget>

   throwIfUndefined<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>

   // abortIfUndefined<SafeTarget>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>
}

export interface UnfocusedLens<T> extends Lens<T, T> {
}

export function createLens<T extends object>(instance?: T): UnfocusedLens<T> {
   return new RootLens<T>()
}
