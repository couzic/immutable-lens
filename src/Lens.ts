export type PlainObject<T> = T extends any[]
   ? never
   : T extends (...args: any[]) => any ? never : T extends object ? T : never

export type Updater<T> = (value: T) => T

export type FieldValues<T> = Partial<PlainObject<T>>

export type FieldUpdaters<T> = PlainObject<{ [K in keyof T]?: Updater<T[K]> }>

export type FieldsUpdater<T> = (value: T) => FieldValues<T>

export type FieldLenses<T, Composition> = PlainObject<
   { [K in keyof Composition]: Lens<T, Composition[K]> }
>

export interface Lens<Source, Target> {
   readonly path: string

   ////////////
   // FOCUS //
   //////////

   focus<NewTarget>(
      get: (value: Target) => NewTarget,
      set: (newValue: NewTarget) => Updater<Target>,
   ): Lens<Source, NewTarget>

   focusIndex<Item>(
      this: UnfocusedLens<Item[]>,
      index: number,
   ): Lens<Item[], Item | undefined>

   focusIndex<Item>(
      this: Lens<Source, Item[]>,
      index: number,
   ): Lens<Source, Item | undefined>

   recompose<Composition>(
      this: Lens<Source, PlainObject<Target>>,
      fields: FieldLenses<Target, Composition>,
   ): Lens<Source, Composition>

   focusPath<K extends keyof Target>(
      this: Lens<Source, PlainObject<Target>>,
      key: K,
   ): Lens<Source, Target[K]>

   focusPath<K1 extends keyof Target, K2 extends keyof Target[K1]>(
      key1: K1,
      key2: K2,
   ): Lens<Source, Target[K1][K2]>

   focusPath<
      K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2]
   >(
      key1: K1,
      key2: K2,
      key3: K3,
   ): Lens<Source, Target[K1][K2][K3]>

   focusPath<
      K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3]
   >(
      key1: K1,
      key2: K2,
      key3: K3,
      key4: K4,
   ): Lens<Source, Target[K1][K2][K3][K4]>

   focusPath<
      K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3],
      K5 extends keyof Target[K1][K2][K3][K4]
   >(
      key1: K1,
      key2: K2,
      key3: K3,
      key4: K4,
      key5: K5,
   ): Lens<Source, Target[K1][K2][K3][K4][K5]>

   focusPath<
      K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3],
      K5 extends keyof Target[K1][K2][K3][K4],
      K6 extends keyof Target[K1][K2][K3][K4][K5]
   >(
      key1: K1,
      key2: K2,
      key3: K3,
      key4: K4,
      key5: K5,
      key6: K6,
   ): Lens<Source, Target[K1][K2][K3][K4][K5][K6]>

   focusPath<
      K1 extends keyof Target,
      K2 extends keyof Target[K1],
      K3 extends keyof Target[K1][K2],
      K4 extends keyof Target[K1][K2][K3],
      K5 extends keyof Target[K1][K2][K3][K4],
      K6 extends keyof Target[K1][K2][K3][K4][K5],
      K7 extends keyof Target[K1][K2][K3][K4][K5][K6]
   >(
      key1: K1,
      key2: K2,
      key3: K3,
      key4: K4,
      key5: K5,
      key6: K6,
      key7: K7,
   ): Lens<Source, Target[K1][K2][K3][K4][K5][K6][K7]>

   ///////////
   // READ //
   /////////

   read(source: Source): Target

   /////////////
   // UPDATE //
   ///////////

   setValue(newValue: Target): Updater<Source>

   setValue(): (newValue: Target) => Updater<Source>

   update(updater: Updater<Target>): Updater<Source>

   setFields(
      this: Lens<Source, PlainObject<Target>>,
      newValues: FieldValues<Target>,
   ): Updater<Source>

   setFields(
      this: Lens<Source, PlainObject<Target>>,
   ): (newValues: FieldValues<Target>) => Updater<Source>

   updateFields(
      this: Lens<Source, PlainObject<Target>>,
      updaters: FieldUpdaters<Target>,
   ): Updater<Source>

   updatePartial(
      this: Lens<Source, PlainObject<Target>>,
      fieldsUpdater: FieldsUpdater<Target>,
   ): Updater<Source>

   // TODO API DESIGN
   // view()
   // map()
   // pick<K extends keyof Target>(...keys: K[]): (source:Source) => Pick<Target, K>
   // pluck()
   // cherryPick()
   // recompute()

   // TODO Array-focused update functions ???
   // setIndexes()
   // updateIndexes()
   // updateIndexValues()

   // TODO Non-variadic
   pipe(...updaters: Array<Updater<Target>>): Updater<Source>

   // pipe(updaters: Updater<Target>[], source: Source): Source

   defaultTo<SafeTarget extends Target>(
      this: Lens<Source, SafeTarget | undefined>,
      value: SafeTarget,
   ): Lens<Source, SafeTarget>

   throwIfUndefined<SafeTarget extends Target>(
      this: Lens<Source, SafeTarget | undefined>,
   ): Lens<Source, SafeTarget>

   // abortIfUndefined<SafeTarget>(this: Lens<Source, SafeTarget | undefined>): Lens<Source, SafeTarget>
}

export interface UnfocusedLens<Source> extends Lens<Source, Source> {}
