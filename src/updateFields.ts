import {FieldUpdaters} from './Lens'

export function updateFields<T, Target>(source: T, fieldUpdaters: FieldUpdaters<Target>): T {
   if (typeof fieldUpdaters === 'function') throw Error('Lens.updateFields() does NOT accept functions as argument')
   if (Object.keys(fieldUpdaters).length === 0) return source
   const sourceObject = source as any
   const updaters = fieldUpdaters as any
   const shallowCopy = {...sourceObject}
   let hasChanged = false
   for (let key in updaters) {
      const updater = updaters[key]
      const newValue = updater(sourceObject[key])
      if (newValue !== sourceObject[key]) {
         hasChanged = true
         shallowCopy[key] = newValue
      }
   }
   return hasChanged ? shallowCopy : source
}
