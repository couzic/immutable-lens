import {FocusedUpdater} from './Lens'

export function pipeUpdaters<T>(...updaters: FocusedUpdater<T>[]): FocusedUpdater<T> {
   if (updaters.length === 0) return (something) => something
   else return (data: T) => updaters.reduce((previousData, updater) => updater(previousData), data)
}
