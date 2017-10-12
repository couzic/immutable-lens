export interface NotAnArray {
   reduceRight?: 'NotAnArray'
}

export interface Updater<T> {
   (value: T): T
}

export type FieldValues<T> = object & NotAnArray & { [K in keyof T]?: T[K] }

export type FieldUpdaters<T> = object & NotAnArray & { [K in keyof T]?: Updater<T[K]> }

export interface FieldsUpdater<T> {
   (value: T): FieldValues<T>
}

export type FieldLenses<Source, Composition> = object & NotAnArray & {[K in keyof Composition]: Lens<Source, Composition[K]>}

export interface Lens<T, Target> {

   readonly path: string

   ////////////
   // FOCUS //
   //////////

   focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1]>(key1: K1, key2: K2): Lens<T, Target[K1][K2]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2]>(key1: K1, key2: K2, key3: K3): Lens<T, Target[K1][K2][K3]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3]>(key1: K1, key2: K2, key3: K3, key4: K4): Lens<T, Target[K1][K2][K3][K4]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3],
      K5 extends keyof Target[K1][K2][K3][K4]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5): Lens<T, Target[K1][K2][K3][K4][K5]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3],
      K5 extends keyof Target[K1][K2][K3][K4],
      K6 extends keyof Target[K1][K2][K3][K4][K5]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6): Lens<T, Target[K1][K2][K3][K4][K5][K6]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3],
      K5 extends keyof Target[K1][K2][K3][K4],
      K6 extends keyof Target[K1][K2][K3][K4][K5],
      K7 extends keyof Target[K1][K2][K3][K4][K5][K6]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6, key7: K7): Lens<T, Target[K1][K2][K3][K4][K5][K6][K7]>

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

   updateFieldValues(this: Lens<T, Target & NotAnArray>, fieldsUpdater: FieldsUpdater<Target>): Updater<T>

   // TODO API DESIGN
   // setIndexValues()
   // updateIndexes()
   // updateIndexValues()

   pipe(...updaters: Updater<Target>[]): Updater<T>

   defaultTo<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget>

   throwIfUndefined<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>

   // abortIfUndefined<SafeTarget>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>
}

export interface UnfocusedLens<T> extends Lens<T, T> {
}
