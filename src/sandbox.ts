import {createLens} from './Lens'

type State = {
   user: {
      name: string
   }
}
const state: State = {user: {name: 'Bob'}}

const lens = createLens<State>() // OR
// const lens = createLens(state)

const userLens = lens.focusOn('user')
const userNameLens = userLens.focusOn('name')

const updatedState: State =
   // ALL EQUIVALENT
   userNameLens.setValue(state, 'BOB')
userNameLens.update(state, (name) => name.toUpperCase())
userLens.setFieldValues(state, {name: 'BOB'})
userLens.updateFields(state, {name: (name) => name.toUpperCase()})

console.log(updatedState) // {user: {name: 'BOB'}}


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

createLens(source)
   .focusOn('todo')
   .focusOn('input')
   .setValue(source, 'New val')






