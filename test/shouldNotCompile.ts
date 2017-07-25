import {createLens, Lens} from '../src/Lens'

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
      list: string[]
      count: number
   }
   user: User | undefined
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
counterLens.setValue(null, 42)

// Setting value on undefined source @shouldNotCompile
counterLens.setValue(undefined, 42)

// Setting value on primitive source @shouldNotCompile
counterLens.setValue(42, 42)

// Setting value on wrong type source @shouldNotCompile
counterLens.setValue({counter: 42}, 42)

// Setting null value with primitive-focused lens @shouldNotCompile
counterLens.setValue(source, null)

// Setting null value with object-focused lens @shouldNotCompile
todoLens.setValue(source, null)

// Setting undefined value with primitive-focused lens @shouldNotCompile
counterLens.setValue(source, undefined)

// Setting undefined value with object-focused lens @shouldNotCompile
todoLens.setValue(source, undefined)

// Setting wrong primitive type value with primitive-focused lens @shouldNotCompile
counterLens.setValue(source, '42')

// Setting object value with primitive-focused lens @shouldNotCompile
counterLens.setValue(source, {})

// Setting primitive value with object-focused lens @shouldNotCompile
todoLens.setValue(source, 42)

// Setting wrong type object value with object-focused lens @shouldNotCompile
todoLens.setValue(source, {count: 42})

// Setting function value with object-focused lens @shouldNotCompile
todoLens.setValue(source, () => source.todo)

// Updating null source @shouldNotCompile
counterLens.update(null, () => 42)

// Updating undefined source @shouldNotCompile
counterLens.update(undefined, () => 42)

// Updating on primitive source @shouldNotCompile
counterLens.update(42, () => 42)

// Updating on wrong type source @shouldNotCompile
counterLens.update({counter: 42}, () => 42)

// Updating with null updater @shouldNotCompile
counterLens.update(source, null)

// Updating with undefined updater @shouldNotCompile
counterLens.update(source, undefined)

// Updating with primitive updater @shouldNotCompile
counterLens.update(source, 42)

// Updating with object updater @shouldNotCompile
counterLens.update(source, {counter: 42})

// Updating with wrong input type updater @shouldNotCompile
counterLens.update(source, (counter: string) => 42)

// Updating with wrong output type updater @shouldNotCompile
counterLens.update(source, (counter: number) => '42')

// Updating object with wrong output type updater @shouldNotCompile
todoLens.update(source, (todo) => 'todo')

// Updating fields with primitive-focused lens @shouldNotCompile
counterLens.updateFields(source, {})

// Updating null fields @shouldNotCompile
todoLens.updateFields(source, null)

// Updating undefined fields @shouldNotCompile
todoLens.updateFields(source, undefined)

// Updating unknown fields @shouldNotCompile
todoLens.updateFields(source, {unknown: ''})

// Updating primitive field with wrong type @shouldNotCompile
todoLens.updateFields(source, {input: 42})

// Updating fields with array @shouldNotButDoesCompile
// todoLens.updateFields(source, [])

// Updating primitive field with wrong input type updater @shouldNotCompile
todoLens.updateFields(source, {input: (v: number) => ''})

// Updating primitive field with wrong output type updater @shouldNotCompile
todoLens.updateFields(source, {input: (v: string) => 42})

// Updating object field with wrong type @shouldNotCompile
lens.updateFields(source, {todo: {}})

// Updating object field with wrong input type updater @shouldNotCompile
lens.updateFields(source, {todo: (value: { input: number }) => source.todo})

// Updating object field with wrong output type updater @shouldNotCompile
lens.updateFields(source, {todo: (value) => ({})})

/////////////////////////
// Handling undefined //
///////////////////////

// Assigning optional value focused lens to non-optional reference @shouldNotCompile
const nonOptionalUserLens: Lens<Source, User> = lens.focusOn('user')

// Reading optional value and assigning result to non-optional reference @shouldNotCompile
const userRead: User = userLens.read(source)

// Focusing on key of optional value @shouldNotCompile
userLens.focusOn('name')

// Updating fields of optional value @shouldNotCompile
userLens.updateFields(source, {name: 'toto'})

// Reading indexed-focused value and assigning result to non-optional reference @shouldNotCompile
const indexedFocusedRead: string = todoListItemLens.read(source)

//////////////////////////////////
// Should not but does compile //
////////////////////////////////

// Updating optional value with non-optional input updater @shouldNotButDoesCompile
const userUpdated: Source = userLens.update(source, (current: User) => source.user)

// Updating indexed-focused value with non-optional input updater @shouldNotButDoesCompile
todoListItemLens.update(source, (item: string) => '')
