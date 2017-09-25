import {FieldLenses, Lens} from './Lens'
import {ComposedLens} from './ComposedLens'

export function createComposedLens<Source extends object>(source?: Source) {
   return {
      withFields<Composition>(fields: FieldLenses<Source, Composition>): Lens<Source, Composition> {
         return new ComposedLens(fields)
      }
   }
}
