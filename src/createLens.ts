import {UnfocusedLens} from './Lens'
import {ImmutableLens} from './ImmutableLens'

export function createLens<T extends {}>(instance?: T): UnfocusedLens<T> {
   return new ImmutableLens(
      'root',
      (source: T) => source,
      (target: T) => target,
      (newValue: T) => () => newValue,
      (target: T) => () => target
   )
}
