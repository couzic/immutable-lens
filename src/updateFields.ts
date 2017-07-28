import {FieldUpdaters} from './Lens'

export function updateFields<T, Target>(source: T, fieldUpdaters: FieldUpdaters<Target>): T {
   // TODO: Keep runtime check for array detection ?
   // if (Array.isArray(source)) throw Error('Lens.updateFields() can NOT be called when focused on an array. Try calling focusIndex() first')
   if (typeof fieldUpdaters === 'function') throw Error('Lens.updateFields() does NOT accept functions as argument')
   if (Object.keys(fieldUpdaters).length === 0) return source
   const sourceObject = source as any
   const fieldsObject = fieldUpdaters as any
   const copy = {...sourceObject}
   let hasChanged = false
   for (let key in fieldUpdaters) {
      const fieldSpec = fieldsObject[key]
      const newValue = fieldSpec(sourceObject[key])
      if (newValue !== sourceObject[key]) {
         hasChanged = true
         copy[key] = newValue
      }
   }
   return hasChanged ? copy : source
}
