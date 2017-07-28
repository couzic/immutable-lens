import {FieldValues} from './Lens'

export function setFieldValues<T>(source: T, fieldValues: FieldValues<T>): T {
   if (typeof fieldValues === 'function') throw Error('Lens.setFieldValues() does NOT accept functions as argument')
   if (Object.keys(fieldValues).length === 0) return source
   const sourceObject = source as any
   const fieldsObject = fieldValues as any
   const copy = {...sourceObject}
   let hasChanged = false
   for (let key in fieldValues) {
      const fieldSpec = fieldsObject[key]
      const newValue = fieldSpec
      if (newValue !== sourceObject[key]) {
         copy[key] = fieldSpec
         hasChanged = true
      }
   }
   return hasChanged ? copy : source
}
