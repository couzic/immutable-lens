import { FieldValues } from './Lens'

export function setFieldValues<T>(source: T, fieldValues: FieldValues<T>): T {
   if (typeof fieldValues === 'function')
      throw Error('Lens.setFieldValues() does NOT accept functions as argument')
   if (Object.keys(fieldValues).length === 0) return source
   const sourceObject = source as any
   const newValues = fieldValues as any
   const copy = { ...sourceObject }
   let hasChanged = false
   for (const key in newValues) {
      const newValue = newValues[key]
      if (newValue !== sourceObject[key]) {
         copy[key] = newValue
         hasChanged = true
      }
   }
   return hasChanged ? copy : source
}
