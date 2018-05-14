import { createLens } from '../src/createLens'

type TodoItem = {
   title: string
   done: boolean
}

type User = {
   name: string
   address: {
      street: string
      city: string
   }
}

type Source = {
   counter: number
   todo: {
      input: string
      list: TodoItem[]
      count: number
   }
   user: User | undefined
   matrix: number[][]
}

const source: Source = {} as any

const lens = createLens<Source>()
const counterLens = lens.focusPath('counter')
const todoLens = lens.focusPath('todo')
const todoListLens = todoLens.focusPath('list')
const todoListItemLens = todoListLens.focusIndex(0)
const userLens = lens.focusPath('user')

// Updating field values with primitive-focused lens @shouldNotCompile
counterLens.updatePartial(value => 42)

// Updating field valuess with wrong output type @shouldNotCompile
todoLens.updatePartial(value => ({
   count: '42',
}))

// Updating field valies of array @shouldNotCompile
todoListLens.updatePartial(value => ({}))

//////////////////////////////////
// Should not but does compile //
////////////////////////////////

// Updating field values with unknown prop @shouldNotButDoesCompile
lens.updatePartial(state => ({
   unknown: 'unknown',
}))
