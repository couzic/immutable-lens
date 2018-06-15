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

// Focusing on null key @shouldNotCompile
lens.focusPath(null)

// Focusing on undefined key @shouldNotCompile
lens.focusPath(undefined)

// Focusing on non-string key @shouldNotCompile
lens.focusPath(42)

// Focusing on object key @shouldNotCompile
lens.focusPath({})

// Focusing on function key @shouldNotCompile
lens.focusPath(() => 'counter')

// Focusing on unknown key @shouldNotCompile
lens.focusPath('unknown')

// recomposing with null @shouldNotCompile
lens.recompose(null)

// recomposing with undefined @shouldNotCompile
lens.recompose(undefined)

// recomposing field with null @shouldNotCompile
lens.recompose({ fieldName: null })

// recomposing field with undefined @shouldNotCompile
lens.recompose({ fieldName: undefined })

// recomposing field with string @shouldNotCompile
lens.recompose({ fieldName: 'string' })

// recomposing field with updater @shouldNotCompile
lens.recompose({ fieldName: value => value })

// recomposing number-focused lens @shouldNotCompile
counterLens.recompose({})

// recomposing array-focused lens @shouldNotCompile
todoListLens.recompose({})

// Focusing on key of array @shouldNotCompile
todoListLens.focusPath('length')

// Focusing null index @shouldNotCompile
todoListLens.focusIndex(null)

// Focusing undefined index @shouldNotCompile
todoListLens.focusIndex(undefined)

// Focusing non-number index @shouldNotCompile
todoListLens.focusIndex('42')

// Focusing object index @shouldNotCompile
todoListLens.focusIndex({})

// Focusing index on primitive-focused lens @shouldNotCompile
counterLens.focusIndex(4)

// Focusing index on object-focused lens @shouldNotCompile
todoLens.focusIndex(4)

////////////////////////
// Handling optional //
//////////////////////

// Assigning optional value focused lens to non-optional reference @shouldNotCompile
const nonOptionalUserLens: Lens<Source, User> = lens.focusPath('user')

// Focusing on key of optional value @shouldNotCompile
userLens.focusPath('name')

// Focusing index on index-focused lens @shouldNotCompile
lens
   .focusPath('matrix')
   .focusIndex(0)
   .focusIndex(0)

// Creating lens with optional type @shouldNotCompile
createLens<{} | undefined>()

//////////////////////////////////
// Should not but does compile //
////////////////////////////////

// Recomposing lens with function @shouldNotButDoesCompile
lens.recompose(() => null)
