import {FieldUpdaters, FieldValues, Lens, NotAnArray, ValueUpdater} from './Lens'
import {setFieldValues} from './setFieldValues'
import {updateFields} from './updateFields'

export abstract class AbstractLens<T, Target> implements Lens<T, Target> {

   abstract focusOn<K extends keyof Target>(this: Lens<T, Target & NotAnArray>, key: K): Lens<T, Target[K]>

   abstract focusIndex<Item>(this: Lens<T, Item[]>, index: number): Lens<T, Item | undefined>

   abstract read(source: T): Target

   abstract setValue(source: T, newValue: Target): T

   abstract getPath(): string

   abstract defaultTo<SafeTarget>(this: Lens<T, SafeTarget | undefined>, value: SafeTarget): Lens<T, SafeTarget>

   update(source: T, updater: ValueUpdater<Target>): T {
      const value = this.read(source)
      if (value === undefined) throw Error('No value defined at ' + this.getPath())
      const newValue = updater(value)
      // TODO Optimize by checking reference equality here (save a read() in setValue())
      return this.setValue(source, newValue)
   }

   setFieldValues(source: T, fields: FieldValues<Target>): T {
      const currentTarget = this.read(source)
      const updatedTarget = setFieldValues(currentTarget, fields)
      // TODO Optimize by checking reference equality here (save a call to setValue())
      return this.setValue(source, updatedTarget)
   }

   updateFields(source: T, fields: FieldUpdaters<Target>): T {
      const currentTarget = this.read(source)
      const updatedTarget = updateFields(currentTarget, fields)
      // TODO Optimize by checking target references here (save a read() in setValue())
      return this.setValue(source, updatedTarget)
   }
}
