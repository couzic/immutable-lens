import { ImmutableLens, LensType } from './ImmutableLens'
import { UnfocusedLens } from './Lens'

export function createLens<T extends {}>(instance?: T): UnfocusedLens<T> {
   return new ImmutableLens(
      'root',
      LensType.ROOT,
      (source: T) => source,
      (target: T) => target,
      (newValue: T) => () => newValue,
      (target: T) => () => target,
   )
}
