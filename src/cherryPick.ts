import { FieldLenses } from './Lens'

export function cherryPick<Source extends object, Composition>(
   source: Source,
   fields: FieldLenses<Source, Composition>,
): Composition {
   if (typeof fields === 'function')
      throw Error('cherryPick() does NOT accept functions as arguments')
   const composition: Composition = {} as any
   const keys = Object.keys(fields) as Array<keyof Composition>
   keys.forEach(key => {
      const lens = (fields as any)[key]
      composition[key] = lens.read(source)
   })
   return composition
}
