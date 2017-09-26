import {FieldUpdaters, FieldValues, Lens, NotAnArray, Updater} from './Lens'
import {setFieldValues} from './setFieldValues'
import {updateFields} from './updateFields'
import {pipeUpdaters} from './pipeUpdaters'

export abstract class AbstractLens<T, Target> implements Lens<T, Target> {

   abstract readonly path: string

   abstract focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]>

   abstract focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined>

   abstract read(source: T): Target

   abstract setValue(newValue: Target): Updater<T>

   abstract defaultTo<SafeTarget>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget>

   abstract throwIfUndefined<SafeTarget extends Target>(this: Lens<T, SafeTarget | undefined>): Lens<T, SafeTarget>

   focusPath(...keys: any[]) {
      let lens: any = this
      keys.forEach(key => lens = lens.focusOn(key))
      return lens
   }

   update(updater: Updater<Target>): Updater<T> {
      return (source: T) => {
         const value = this.read(source)
         const newValue = updater(value)
         if (newValue === value) return source
         return this.setValue(newValue)(source)
      }
   }

   setFieldValues(newValues: FieldValues<Target>): Updater<T> {
      return (source: T) => {
         const currentTarget = this.read(source)
         const updatedTarget = setFieldValues(currentTarget, newValues)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
   }

   updateFields(updaters: FieldUpdaters<Target>): Updater<T> {
      return (source: T) => {
         const currentTarget = this.read(source)
         const updatedTarget = updateFields(currentTarget, updaters)
         if (updatedTarget === currentTarget) return source
         return this.setValue(updatedTarget)(source)
      }
   }

   pipe(...updaters: Updater<Target>[]): Updater<T> {
      return this.update(pipeUpdaters(...updaters))
   }

}
