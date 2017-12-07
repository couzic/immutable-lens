import {createLens} from '../src/createLens'
import {Lens, Updater} from '../src/Lens'

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

const source = {} as Source

const lens = createLens<Source>()
const counterLens = lens.focusPath('counter')
const todoLens = lens.focusPath('todo')
const todoListLens = todoLens.focusPath('list')
const todoListItemLens = todoListLens.focusIndex(0)
const userLens = lens.focusPath('user')

////////////////////////
// Handling optional //
//////////////////////

// Defaulting to wrong type @shouldNotCompile
todoListItemLens.defaultTo({})

// Defaulting to wrong type @shouldNotCompile
userLens.defaultTo({})

// Defaulting non-optional value @shouldNotCompile
counterLens.defaultTo(44)

// Defaulting to undefined and assigning to non optional reference @shouldNotCompile
const defaultToUndefined: TodoItem = todoListItemLens.defaultTo(undefined).read(source)

// Creating lens with optional type @shouldNotCompile
createLens<{} | undefined>()
