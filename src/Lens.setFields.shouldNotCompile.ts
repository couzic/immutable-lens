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

// Setting field values with primitive-focused lens @shouldNotCompile
counterLens.setFields({})

// Setting field values with null fields @shouldNotCompile
todoLens.setFields(null)

// Setting field values with undefined fields @shouldNotCompile
todoLens.setFields(undefined)

// Setting field values for unknown fields @shouldNotCompile
todoLens.setFields({ unknown: '' })

// Setting primitive field values with wrong types @shouldNotCompile
todoLens.setFields({ input: 42 })

// Setting field values with array @shouldNotCompile
todoLens.setFields([])

// Setting object field values with wrong type @shouldNotCompile
lens.setFields({ todo: {} })

// Setting field values of array @shouldNotCompile
todoListLens.setFields({})

////////////////////////
// Handling optional //
//////////////////////

// Setting field values of optional target @shouldNotCompile
userLens.setFields({ name: 'toto' })

// Setting field values with index-focused lens @shouldNotCompile
todoListItemLens.setFields({ done: true })
