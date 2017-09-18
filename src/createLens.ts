import {RootLens} from './RootLens'
import {UnfocusedLens} from './Lens'

export function createLens<T extends object>(instance?: T): UnfocusedLens<T> {
   return new RootLens<T>()
}
