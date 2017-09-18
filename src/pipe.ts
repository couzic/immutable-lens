import {Updater} from './Lens'

export function pipe<T>(...updaters: Updater<T>[]): Updater<T> {
   if (updaters.length === 0) return (something) => something
   else return (data: T) => updaters.reduce((previousValue, update) => update(previousValue), data)
}
