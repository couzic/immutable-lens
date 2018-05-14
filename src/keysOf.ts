import { NotAnArray } from './Lens'

export function keysOf<T extends object & NotAnArray, K extends keyof T>(
   o: T,
): K[] {
   return Object.keys(o) as K[]
}
