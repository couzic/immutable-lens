export interface ValueUpdater<V> {
   (value: V): V
}

export type FieldsUpdater<T> = object & { [K in keyof T]?: T[K] | ValueUpdater<T[K]> }

export interface Lens<T, Target> {
   focusOn<TO extends T & object, K extends keyof Target>(this: Lens<TO, Target>, key: K): Lens<T, Target[K]>

   focusAt<NewTarget>(lens: Lens<Target, NewTarget>): Lens<T, NewTarget>

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined>

   read(source: T): Target

   setValue(source: T, newValue: Target): T

   update(source: T, updater: ValueUpdater<Target>): T

   updateFields(this: Lens<T, Target & object>, source: T, fields: FieldsUpdater<Target>): T
}

export function createLens<T extends object>(instance?: T): Lens<T, T> {
   return new UnfocusedLens<T>()
}

class UnfocusedLens<T extends object> implements Lens<T, T> {
   focusOn<TO extends T & object, K extends keyof TO>(this: Lens<TO, TO>, key: K): Lens<TO, TO[K]> {
      return new FocusedLens(this, key)
   }

   focusAt<NewTarget>(lens: Lens<T, NewTarget>): Lens<T, NewTarget> {
      throw new Error("Method not implemented.")
   }

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined> {
      throw new Error("Method not implemented.")
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

   updateFields(this: Lens<T, T & object>, source: T, fields: FieldsUpdater<T>): T {
      return updateFields(source, fields)
   }
}

class FocusedLens<T, ParentTarget extends object, K extends keyof ParentTarget, Target extends ParentTarget[K]> implements Lens<T, Target> {
   constructor(private readonly parentLens: Lens<T, ParentTarget>, private readonly key: K) {
   }

   focusOn<TO extends T & object, K extends keyof Target>(this: Lens<TO, Target>, key: K): Lens<TO, Target[K]> {
      return new FocusedLens(this, key)
   }

   focusAt<NewTarget>(lens: Lens<Target, NewTarget>): Lens<T, NewTarget> {
      throw new Error("Method not implemented.")
   }

   focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined> {
      throw new Error("Method not implemented.")
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
      const fields = {} as any
      fields[this.key] = updater
      return this.parentLens.updateFields(source, fields)
   }

   updateFields(this: Lens<T, Target & object>, source: T, fields: FieldsUpdater<Target>): T {
      const updatedFields = updateFields(this.read(source), fields)
      return this.setValue(source, updatedFields)
   }
}

function updateFields<T, Target>(source: T, fields: FieldsUpdater<Target>): T {
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
