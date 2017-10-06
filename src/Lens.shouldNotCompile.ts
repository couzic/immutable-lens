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
const counterLens = lens.focusOn('counter')
const todoLens = lens.focusOn('todo')
const todoListLens = todoLens.focusOn('list')
const todoListItemLens = todoListLens.focusIndex(0)
const userLens = lens.focusOn('user')

// Focusing on null key @shouldNotCompile
lens.focusOn(null)

// Focusing on undefined key @shouldNotCompile
lens.focusOn(undefined)

// Focusing on non-string key @shouldNotCompile
lens.focusOn(42)

// Focusing on object key @shouldNotCompile
lens.focusOn({})

// Focusing on function key @shouldNotCompile
lens.focusOn(() => 'counter')

// Focusing on unknown key @shouldNotCompile
lens.focusOn('unknown')

// Focusing at null lens @shouldNotCompile
lens.focusAt(null)

// Focusing at undefined lens @shouldNotCompile
lens.focusAt(undefined)

// Focusing at non-lens object @shouldNotCompile
lens.focusAt({})

// Focusing at function @shouldNotCompile
lens.focusAt(() => 'counter')

// Focusing at primitive lens @shouldNotCompile
lens.focusAt(42)

// Focusing at parent lens @shouldNotCompile
todoLens.focusAt(lens)

// Focusing at sibling lens @shouldNotCompile
todoLens.focusAt(lens.focusOn('counter'))

// Focusing on key of array @shouldNotCompile
todoListLens.focusOn('length')

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

// Reading null source @shouldNotCompile
lens.read(null)

// Reading undefined source @shouldNotCompile
lens.read(undefined)

// Reading primitive source @shouldNotCompile
lens.read(42)

// Reading empty object source @shouldNotCompile
lens.read({})

// Reading wrong source with correct target @shouldNotCompile
counterLens.read({counter: 42})

// Reading child source @shouldNotCompile
lens.read(source.todo)

// Reading sibling source @shouldNotCompile
counterLens.read(source.todo)

// Setting value on null source @shouldNotCompile
counterLens.setValue(42)(null)

// Setting value on undefined source @shouldNotCompile
counterLens.setValue(42)(undefined)

// Setting value on primitive source @shouldNotCompile
counterLens.setValue(42)(42)

// Setting value on wrong type source @shouldNotCompile
counterLens.setValue(42)({counter: 42})

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
todoLens.setValue({count: 42})

// Setting function value with object-focused lens @shouldNotCompile
todoLens.setValue(() => source.todo)

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

// Setting field values with primitive-focused lens @shouldNotCompile
counterLens.setFieldValues({})

// Updating fields with primitive-focused lens @shouldNotCompile
counterLens.updateFields({})

// Updating field values with primitive-focused lens @shouldNotCompile
counterLens.updateFieldValues(value => 42)

// Setting field values with null fields @shouldNotCompile
todoLens.setFieldValues(null)

// Updating fields with null updaters @shouldNotCompile
todoLens.updateFields(null)

// Setting field values with undefined fields @shouldNotCompile
todoLens.setFieldValues(undefined)

// Updating fields with undefined updaters @shouldNotCompile
todoLens.updateFields(undefined)

// Setting field values for unknown fields @shouldNotCompile
todoLens.setFieldValues({unknown: ''})

// Updating unknown fields @shouldNotCompile
todoLens.updateFields({unknown: () => ''})

// Setting primitive field values with wrong types @shouldNotCompile
todoLens.setFieldValues({input: 42})

// Setting field values with array @shouldNotCompile
todoLens.setFieldValues([])

// Updating fields with array @shouldNotCompile
todoLens.updateFields([])

// Updating fields with wrong input type updaters @shouldNotCompile
todoLens.updateFields({input: (v: number) => ''})

// Updating fields with wrong output type updaters @shouldNotCompile
todoLens.updateFields({input: (v: string) => 42})

// Updating field valuess with wrong output type @shouldNotCompile
todoLens.updateFieldValues(value => ({
   count: '42'
}))

// Setting object field values with wrong type @shouldNotCompile
lens.setFieldValues({todo: {}})

// Updating object fields with wrong input type updaters @shouldNotCompile
lens.updateFields({todo: (value: { input: number }) => source.todo})

// Updating object fields with wrong output type updaters @shouldNotCompile
lens.updateFields({todo: (value) => ({})})

// Setting field values of array @shouldNotCompile
todoListLens.setFieldValues({})

// Updating fields of array @shouldNotCompile
todoListLens.updateFields({})

// Updating field valies of array @shouldNotCompile
todoListLens.updateFieldValues(value => ({}))

/////////////////////////
// Handling undefined //
///////////////////////

// Assigning optional value focused lens to non-optional reference @shouldNotCompile
const nonOptionalUserLens: Lens<Source, User> = lens.focusOn('user')

// Reading optional value and assigning result to non-optional reference @shouldNotCompile
const userRead: User = userLens.read(source)

// Reading indexed-focused value and assigning result to non-optional reference @shouldNotCompile
const indexedFocusedRead: string = todoListItemLens.read(source)

// Focusing on key of optional value @shouldNotCompile
userLens.focusOn('name')

// Setting field values of optional target @shouldNotCompile
userLens.setFieldValues({name: 'toto'})

// Updating fields of optional target @shouldNotCompile
userLens.updateFields({name: () => 'toto'})

// Setting field values with index-focused lens @shouldNotCompile
todoListItemLens.setFieldValues({done: true})

// Updating fields of index-focused value @shouldNotCompile
todoListItemLens.updateFields({done: () => true})

// Defaulting to wrong type @shouldNotCompile
todoListItemLens.defaultTo({})

// Defaulting to wrong type @shouldNotCompile
userLens.defaultTo({})

// Defaulting non-optional value @shouldNotCompile
counterLens.defaultTo(44)

// Defaulting to undefined and assigning to non optional reference @shouldNotCompile
const defaultToUndefined: TodoItem = todoListItemLens.defaultTo(undefined).read(source)

// Focusing index on index-focused lens @shouldNotCompile
lens.focusOn('matrix').focusIndex(0).focusIndex(0)

// Creating lens with optional type @shouldNotCompile
createLens<{} | undefined>()

// Accessing properties of optional target in updater @shouldNotCompile
userLens.update(user => {
   const name = user.name
   return user
})

// Accessing properties in updaters of optional fields @shouldNotCompile
lens.updateFields({
   user: (user) => {
      const name = user.name
      return user
   }
})

//////////////////////////////////
// Should not but does compile //
////////////////////////////////

// Adding unknown props in Updater output @shouldNotButDoesCompile
const updater: Updater<Source> = (source) => ({
   ...source,
   unknownProp: 42
})

// Updating optional value with non-optional input updater @shouldNotButDoesCompile
const userUpdated: Source = userLens.update((current: User) => source.user)(source)

// Updating indexed-focused value with non-optional input updater @shouldNotButDoesCompile
todoListItemLens.update((item: TodoItem) => item)


///////////////////////
// Maybe one day... //
/////////////////////

// Defaulting to on aborted if undefined lens @shouldNotYetCompile
// todoListItemLens.abortIfUndefined().defaultTo({title: '', done: true})
