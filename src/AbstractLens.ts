import {FieldUpdates, FieldValues, Lens, NotAnArray, Update} from './Lens'
import {setFieldValues} from './setFieldValues'
import {updateFields} from './updateFields'
import {pipeUpdates} from './pipeUpdates'

export abstract class AbstractLens<T, Target> implements Lens<T, Target> {

   abstract readonly path: string

   abstract focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]>

   abstract focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined>

   abstract read(source: T): Target

   abstract setValue(newValue: Target): Update<T>

   abstract defaultTo<SafeTarget>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget>

   abstract throwIfUndefined<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>

   update(update: Update<Target>): Update<T> {
      return (source: T) => {
         const value = this.read(source)
         const newValue = update(value)
         if (newValue === value) return source
         return this.setValue(newValue)(source)
      }
   }

   setFieldValues(newValues: FieldValues<Target>): Update<T> {
      return (source: T) => {
         const currentTarget = this.read(source)
         const updatedTarget = setFieldValues(currentTarget, newValues)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
   }

   updateFields(fieldUpdates: FieldUpdates<Target>): Update<T> {
      return (source: T) => {
         const currentTarget = this.read(source)
         const updatedTarget = updateFields(currentTarget, fieldUpdates)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
   }

   pipe(...updates: Update<Target>[]): Update<T> {
      return this.update(pipeUpdates(...updates))
   }

}
