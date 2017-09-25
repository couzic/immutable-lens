export interface NotAnArray {
   reduceRight?: 'NotAnArray'
}

export interface Updater<T> {
   (value: T): T
}

export type FieldValues<T> = object & NotAnArray & { [K in keyof T]?: T[K] }

export type FieldUpdaters<T> = object & NotAnArray & { [K in keyof T]?: Updater<T[K]> }

export type FieldLenses<Source, Composition> = object & NotAnArray & {[K in keyof Composition]: Lens<Source, Composition[K]>}

export interface Lens<T, Target> {

   readonly path: string

   ////////////
   // FOCUS //
   //////////

   focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]>

   // focusAt<NewTarget>(lens: Lens<Target, NewTarget>): Lens<T, NewTarget>

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined>

   ///////////
   // READ //
   /////////

   read(source: T): Target

   /////////////
   // UPDATE //
   ///////////

   setValue(newValue: Target): Updater<T>

   update(updater: Updater<Target>): Updater<T>

   setFieldValues(this: Lens<T, Target & NotAnArray>, newValues: FieldValues<Target>): Updater<T>

   updateFields(this: Lens<T, Target & NotAnArray>, updaters: FieldUpdaters<Target>): Updater<T>

   pipe(...updaters: Updater<Target>[]): Updater<T>

   defaultTo<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget>

   throwIfUndefined<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>

   // abortIfUndefined<SafeTarget>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>
}

export interface UnfocusedLens<T> extends Lens<T, T> {
}
