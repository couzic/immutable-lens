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

export type UnfocusedLens<T> = Lens<T, T>

export function createLens<T>(instance?: T): UnfocusedLens<T> {
   return {
      focusOn<TO extends T & object, K extends keyof TO>(this: UnfocusedLens<TO>, key: K): Lens<T, TO[K]> {
         return focusLens(this, key)
      },
      read(source) {
         return source
      },
      setValue(source, newValue) {
         return newValue
      },
      update(source, updater) {
         return updater(source)
      },
      updateFields(source, fields) {
         return updateFields(source, fields)
      }
   } as UnfocusedLens<T>
}

function focusLens<T, Target extends object, K extends keyof Target>(parentLens: Lens<T, Target>, key: K): Lens<T, Target[K]> {
   return {
      read(source: T): Target[K] {
         return parentLens.read(source)[key]
      },
      setValue(source: T, newValue: Target[K]): T {
         const fields = {} as any
         fields[key] = newValue
         return parentLens.updateFields(source, fields)
      },
      update(source: T, updater: ValueUpdater<Target[K]>): T {
         const fields = {} as any
         fields[key] = updater
         return parentLens.updateFields(source, fields)
      },
      updateFields(source: T, fields: FieldsUpdater<Target[K]>): T {
         const updatedFields = updateFields(this.read(source), fields)
         return this.setValue(source, updatedFields)
      }
   } as any as Lens<T, Target[K]>
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
