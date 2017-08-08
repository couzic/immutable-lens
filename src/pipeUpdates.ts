import {Update} from './Lens'

export function pipeUpdates<T>(...updates: Update<T>[]): Update<T> {
   if (updates.length === 0) return (something) => something
   else return (data: T) => updates.reduce((previousData, update) => update(previousData), data)
}
