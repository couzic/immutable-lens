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

// Updating null source @shouldNotCompile
counterLens.update(() => 42)(null)

// Updating undefined source @shouldNotCompile
counterLens.update(() => 42)(undefined)

// Updating on primitive source @shouldNotCompile
counterLens.update(() => 42)(42)

// Updating on wrong type source @shouldNotCompile
counterLens.update(() => 42)({counter: 42})

// Updating with null updater @shouldNotCompile
counterLens.update(null)

// Updating with undefined updater @shouldNotCompile
counterLens.update(undefined)

// Updating with primitive updater @shouldNotCompile
counterLens.update(42)

// Updating with object updater @shouldNotCompile
counterLens.update({counter: 42})

// Updating with wrong input type updater @shouldNotCompile
counterLens.update((counter: string) => 42)

// Updating with wrong output type updater @shouldNotCompile
counterLens.update((counter: number) => '42')

// Updating object with wrong output type updater @shouldNotCompile
todoLens.update(todo => 'todo')

// Updating indexed-focused value with non-optional input updater @shouldNotCompile
todoListItemLens.update((item: TodoItem) => item)

// Updating optional value with non-optional input updater @shouldNotCompile
const userUpdated: Source = userLens.update((current: User) => source.user)(source)

/////////////////////////
// Handling undefined //
///////////////////////

// Accessing properties of optional target in updater @shouldNotCompile
userLens.update(user => {
   const name = user.name
   return user
})
