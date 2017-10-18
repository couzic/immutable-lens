import {FieldLenses} from './Lens'

export function cherryPick<Source extends object, Composition>(source: Source, fields: FieldLenses<Source, Composition>): Composition {
   if (typeof fields === 'function') throw Error('cherryPick() does NOT accept functions as arguments')
   const composition = {} as Composition
   const keys = Object.keys(fields)
   keys.forEach((key: keyof Composition) => {
      const lend = (fields as any)[key]
      composition[key] = lend.read(source)
   })
   return composition
}
