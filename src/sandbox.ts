import {createLens, Lens, UnfocusedLens} from './Lens'

export type TodoItem = {
   title: string
   done: boolean
}

export type User = {
   name: string
   address: {
      street: string
      city: string
   }
}

export const bob: User = {
   name: 'Bob',
   address: {
      street: '',
      city: ''
   }
}

export type Source = {
   counter: number
   todo: {
      input: string
      list: TodoItem[]
      count: number
   }
   user: User | undefined
}

export const source: Source = {
   counter: 42,
   todo: {
      input: 'input',
      list: [
         {title: 'item0', done: false},
         {title: 'item1', done: false},
         {title: 'item2', done: false}
      ],
      count: 42
   },
   user: undefined
}

const lens: UnfocusedLens<Source> = createLens(source)
const todoLens: Lens<Source, number> = lens.focusOn('counter')
const userLens: Lens<Source, User | undefined> = lens.focusOn('user')

userLens.focusOn('name').setValue(source, 'Bob')

createLens(source)
   .focusOn('todo')
   .focusOn('input')
   .setValue(source, 'New val')






