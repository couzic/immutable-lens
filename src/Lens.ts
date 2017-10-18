export interface NotAnArray {
   reduceRight?: 'NotAnArray'
}

export interface Updater<T> {
   (value: T): T
}

export interface LensCreatedUpdater<T> extends Updater<T> {
   readonly name: string
   readonly genericName: string
   readonly detailedName: string
   readonly details: T | Updater<T> | FieldValues<T> | FieldUpdaters<T> | FieldsUpdater<T>
   readonly lensPath: string
   readonly pipedUpdaters: LensCreatedUpdater<T>[] | undefined
}

export type FieldValues<T> = object & NotAnArray & { [K in keyof T]?: T[K] }

export type FieldUpdaters<T> = object & NotAnArray & { [K in keyof T]?: Updater<T[K]> }

export interface FieldsUpdater<T> {
   (value: T): FieldValues<T>
}

export type FieldLenses<T, Composition> = object & NotAnArray & {[K in keyof Composition]: Lens<T, Composition[K]>}

export interface Lens<Source, Target> {

   readonly path: string

   ////////////
   // FOCUS //
   //////////

   focusOn<K extends keyof Target>(this: Lens<Source, Target & NotAnArray>, key: K): Lens<Source, Target[K]>

   focusPath<K extends keyof Target>(this: Lens<Source, Target & NotAnArray>, key: K): Lens<Source, Target[K]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1]>(key1: K1, key2: K2): Lens<Source, Target[K1][K2]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2]>(key1: K1, key2: K2, key3: K3): Lens<Source, Target[K1][K2][K3]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3]>(key1: K1, key2: K2, key3: K3, key4: K4): Lens<Source, Target[K1][K2][K3][K4]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3],
      K5 extends keyof Target[K1][K2][K3][K4]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5): Lens<Source, Target[K1][K2][K3][K4][K5]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3],
      K5 extends keyof Target[K1][K2][K3][K4],
      K6 extends keyof Target[K1][K2][K3][K4][K5]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6): Lens<Source, Target[K1][K2][K3][K4][K5][K6]>

   focusPath<K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3],
      K5 extends keyof Target[K1][K2][K3][K4],
      K6 extends keyof Target[K1][K2][K3][K4][K5],
      K7 extends keyof Target[K1][K2][K3][K4][K5][K6]>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6, key7: K7): Lens<Source, Target[K1][K2][K3][K4][K5][K6][K7]>

   // focusAt<NewTarget>(lens: Lens<Sourcearget, NewTarget>): Lens<Source, NewTarget>

   focusIndex<Item>(this: Lens<Source, Item[]>, index: number): Lens<Source, Item | undefined>

   recompose<Composition>(this: Lens<Source, Target & object & NotAnArray>, fields: FieldLenses<Target, Composition>): Lens<Source, Composition>

   ///////////
   // READ //
   /////////

   read(source: Source): Target

   /////////////
   // UPDATE //
   ///////////

   setValue(newValue: Target): LensCreatedUpdater<Source>

   update(updater: Updater<Target>): LensCreatedUpdater<Source>

   setFieldValues(this: Lens<Source, Target & NotAnArray>, newValues: FieldValues<Target>): LensCreatedUpdater<Source>

   updateFields(this: Lens<Source, Target & NotAnArray>, updaters: FieldUpdaters<Target>): LensCreatedUpdater<Source>

   updateFieldValues(this: Lens<Source, Target & NotAnArray>, fieldsUpdater: FieldsUpdater<Target>): LensCreatedUpdater<Source>

   // TODO API DESIGN
   // setIndexValues()
   // updateIndexes()
   // updateIndexValues()

   pipe(...updaters: Updater<Target>[]): Updater<Source>

   defaultTo<SafeTarget extends Target>(this: Lens<Source, SafeTarget | undefined>, value: SafeTarget): Lens<Source, SafeTarget>

   throwIfUndefined<SafeTarget extends Target>(this: Lens<Source, SafeTarget | undefined>): Lens<Source, SafeTarget>

   // abortIfUndefined<SafeTarget>(this: Lens<Source, SafeTarget | undefined>): Lens<Source, SafeTarget>
}

export interface UnfocusedLens<Source> extends Lens<Source, Source> {
}
