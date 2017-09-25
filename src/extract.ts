import {FieldLenses} from './Lens'

export function extract<Source extends object, Result>(source: Source, fields: FieldLenses<Source, Result>): Result {
   if (typeof fields === 'function') throw Error('extract() does NOT accept functions as arguments')
   const result = {} as Result
   const keys = Object.keys(fields)
   keys.forEach((key: keyof Result) => {
      const lend = (fields as any)[key]
      result[key] = lend.read(source)
   })
   return result
}
