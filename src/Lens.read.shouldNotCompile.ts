import { createLens } from '../src/createLens'
import { Lens, Updater } from '../src/Lens'

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


// Reading null source @shouldNotCompile
lens.read(null)

// Reading undefined source @shouldNotCompile
lens.read(undefined)

// Reading primitive source @shouldNotCompile
lens.read(42)

// Reading empty object source @shouldNotCompile
lens.read({})

// Reading wrong source with correct target @shouldNotCompile
counterLens.read({ counter: 42 })

// Reading child source @shouldNotCompile
lens.read(source.todo)

// Reading sibling source @shouldNotCompile
counterLens.read(source.todo)

////////////////////////
// Handling optional //
//////////////////////

// Reading optional value and assigning result to non-optional reference @shouldNotCompile
const userRead: User = userLens.read(source)

// Reading indexed-focused value and assigning result to non-optional reference @shouldNotCompile
const indexedFocusedRead: string = todoListItemLens.read(source)
