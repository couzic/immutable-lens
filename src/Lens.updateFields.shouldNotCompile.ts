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

// Updating fields with primitive-focused lens @shouldNotCompile
counterLens.updateFields({})

// Updating fields with null updaters @shouldNotCompile
todoLens.updateFields(null)

// Updating fields with undefined updaters @shouldNotCompile
todoLens.updateFields(undefined)

// Updating unknown fields @shouldNotCompile
todoLens.updateFields({ unknown: () => '' })

// Updating fields with array @shouldNotCompile
todoLens.updateFields([])

// Updating fields with wrong input type updaters @shouldNotCompile
todoLens.updateFields({ input: (v: number) => '' })

// Updating fields with wrong output type updaters @shouldNotCompile
todoLens.updateFields({ input: (v: string) => 42 })

// Updating object fields with wrong input type updaters @shouldNotCompile
lens.updateFields({ todo: (value: { input: number }) => source.todo })

// Updating object fields with wrong output type updaters @shouldNotCompile
lens.updateFields({ todo: (value) => ({}) })

// Updating fields of array @shouldNotCompile
todoListLens.updateFields({})

/////////////////////////
// Handling undefined //
///////////////////////

// Updating fields of optional target @shouldNotCompile
userLens.updateFields({ name: () => 'toto' })

// Updating fields of index-focused value @shouldNotCompile
todoListItemLens.updateFields({ done: () => true })

// Accessing properties in updaters of optional fields @shouldNotCompile
lens.updateFields({
   user: (user) => {
      const name = user.name
      return user
   }
})
