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

const source = {} as Source

const lens = createLens<Source>()
const counterLens = lens.focusPath('counter')
const todoLens = lens.focusPath('todo')
const todoListLens = todoLens.focusPath('list')
const todoListItemLens = todoListLens.focusIndex(0)
const userLens = lens.focusPath('user')


// Setting value on null source @shouldNotCompile
counterLens.setValue(42)(null)

// Setting value on undefined source @shouldNotCompile
counterLens.setValue(42)(undefined)

// Setting value on primitive source @shouldNotCompile
counterLens.setValue(42)(42)

// Setting value on wrong type source @shouldNotCompile
counterLens.setValue(42)({ counter: 42 })

// Setting null value with primitive-focused lens @shouldNotCompile
counterLens.setValue(null)

// Setting null value with object-focused lens @shouldNotCompile
todoLens.setValue(null)

// Setting undefined value with primitive-focused lens @shouldNotCompile
counterLens.setValue(undefined)

// Setting undefined value with object-focused lens @shouldNotCompile
todoLens.setValue(undefined)

// Setting wrong primitive type value with primitive-focused lens @shouldNotCompile
counterLens.setValue('42')

// Setting object value with primitive-focused lens @shouldNotCompile
counterLens.setValue({})

// Setting primitive value with object-focused lens @shouldNotCompile
todoLens.setValue(42)

// Setting wrong type object value with object-focused lens @shouldNotCompile
todoLens.setValue({ count: 42 })

// Setting function value with object-focused lens @shouldNotCompile
todoLens.setValue(() => source.todo)
