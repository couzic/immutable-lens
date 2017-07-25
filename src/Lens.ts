export type ObjectLiteral = object & { reduceRight?: 'Not an array' }

export interface ValueUpdater<V> {
   (value: V): V
}

export type FieldsUpdater<T> = ObjectLiteral & { [K in keyof T]?: T[K] | ValueUpdater<T[K]> }

export interface Lens<T, Target> {
   focusOn<K extends keyof Target>(this: Lens<T, Target & ObjectLiteral>, key: K): Lens<T, Target[K]>

   // focusAt<NewTarget>(lens: Lens<Target, NewTarget>): Lens<T, NewTarget>

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined>

   read(source: T): Target

   setValue(source: T, newValue: Target): T

   update(source: T, updater: ValueUpdater<Target>): T

   updateFields(this: Lens<T, Target & ObjectLiteral>, source: T, fields: FieldsUpdater<Target>): T

   getPath(): string
}

export interface UnfocusedLens<T> extends Lens<T, T> {
}

export function createLens<T extends object>(instance?: T): UnfocusedLens<T> {
   return new RootLens<T>()
}

class RootLens<T extends object> implements UnfocusedLens<T> {
   focusOn<K extends keyof T>(key: K): Lens<T, T[K]> {
      return new KeyFocusedLens(this, key)
   }

   // focusAt<NewTarget>(lens: Lens<T, NewTarget>): Lens<T, NewTarget> {
   //    throw new Error("Method not implemented.")
   // }

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined> {
      return new IndexFocusedLens(this, index)
   }

   read(source: T): T {
      return source
   }

   setValue(source: T, newValue: T): T {
      return newValue
   }

   update(source: T, updater: ValueUpdater<T>): T {
      return updater(source)
   }

   updateFields(source: T, fields: FieldsUpdater<T>): T {
      return updateFields(source, fields)
   }

   getPath() {
      return 'source'
   }
}

class KeyFocusedLens<T, ParentTarget extends object, K extends keyof ParentTarget, Target extends ParentTarget[K]> implements Lens<T, Target> {
   constructor(private readonly parentLens: Lens<T, ParentTarget>, private readonly key: K) {
   }

   focusOn<K extends keyof Target>(key: K): Lens<T, Target[K]> {
      return new KeyFocusedLens(this, key)
   }

   // focusAt<NewTarget>(lens: Lens<Target, NewTarget>): Lens<T, NewTarget> {
   //    throw new Error("Method not implemented.")
   // }

   focusIndex<Item>(index: number): Lens<T, Item | undefined> {
      return new IndexFocusedLens(this, index)
   }

   read(source: T): Target {
      return this.parentLens.read(source)[this.key]
   }

   setValue(source: T, newValue: Target): T {
      const fields = {} as any
      fields[this.key] = newValue
      return this.parentLens.updateFields(source, fields)
   }

   update(source: T, updater: ValueUpdater<Target>): T {
      const value = this.read(source)
      if (value === undefined) throw Error('No value defined at ' + this.getPath())
      const newValue = updater(value)
      return this.setValue(source, newValue)
   }

   updateFields(source: T, fields: FieldsUpdater<Target>): T {
      const updatedFields = updateFields(this.read(source), fields)
      return this.setValue(source, updatedFields)
   }

   getPath() {
      return this.parentLens.getPath() + '.' + this.key
   }
}

class IndexFocusedLens<T, Item> implements Lens<T, Item> {
   constructor(private readonly parentLens: Lens<T, Item[]>, private readonly index: number) {
   }

   focusOn<K extends keyof Item>(key: K): Lens<T, Item[K]> {
      throw new Error("Method not implemented.")
   }

   focusIndex<Item>(index: number): Lens<T, any | Item> {
      throw new Error("Method not implemented.")
   }

   read(source: T): Item {
      return this.parentLens.read(source)[this.index]
   }

   setValue(source: T, newValue: Item): T {
      const array = this.parentLens.read(source)
      if (array[this.index] === newValue) return source
      const copy = [...array]
      copy[this.index] = newValue
      return this.parentLens.setValue(source, copy)
   }

   update(source: T, updater: ValueUpdater<Item>): T {
      const value = this.read(source)
      if (value === undefined) throw Error('No value defined at ' + this.getPath())
      const newValue = updater(value)
      return this.setValue(source, newValue)
   }

   updateFields(source: T, fields: FieldsUpdater<Item>): T {
      const updatedFields = updateFields(this.read(source), fields)
      return this.setValue(source, updatedFields)
   }

   getPath(): string {
      return this.parentLens.getPath() + `[${this.index}]`
   }
}

function updateFields<T, Target>(source: T, fields: FieldsUpdater<Target>): T {
   if (Array.isArray(source)) throw Error('Lens.updateFields() can NOT be called when focused on an array. Try calling focusIndex() first')
   if (typeof fields === 'function') throw Error('Lens.updateFields() does NOT accept functions as argument')
   let hasChanged = false
   const sourceObject = source as any
   const fieldsObject = fields as any
   if (Object.keys(fields).length === 0) return source
   const copy = {...sourceObject}
   for (let key in fields) {
      const fieldSpec = fieldsObject[key]
      if (typeof fieldSpec === 'function') {
         const newValue = fieldSpec(sourceObject[key])
         if (newValue !== sourceObject[key]) {
            hasChanged = true
            copy[key] = newValue
         }
      }
      else {
         const newValue = fieldSpec
         if (newValue !== sourceObject[key]) {
            copy[key] = fieldSpec
            hasChanged = true
         }
      }
   }
   return hasChanged ? copy : source
}
