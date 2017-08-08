import {FieldUpdates} from './Lens'

export function updateFields<T, Target>(source: T, fieldUpdates: FieldUpdates<Target>): T {
   if (typeof fieldUpdates === 'function') throw Error('Lens.updateFields() does NOT accept functions as argument')
   if (Object.keys(fieldUpdates).length === 0) return source
   const sourceObject = source as any
   const updates = fieldUpdates as any
   const copy = {...sourceObject}
   let hasChanged = false
   for (let key in updates) {
      const update = updates[key]
      const newValue = update(sourceObject[key])
      if (newValue !== sourceObject[key]) {
         hasChanged = true
         copy[key] = newValue
      }
   }
   return hasChanged ? copy : source
}
