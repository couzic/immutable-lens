# immutable-lens

#### Type-safe Lens API for immutable updates in deep data structures

### Features
 - No mutations (obviously...)
 - Human-friendly API
 - Update your Redux store, your React component state, your Immutable.js collection... Whatever !
 - Bring in your favorite libraries (Ramda, lodash-fp, date-fns...)
 - Optimized for the strict equality checks performed in `React.PureComponent`, `connect()`...
 - Written in TypeScript, designed for maximal type-safety

### Quickstart

#### Install
```sh
$ npm i -S immutable-lens
```

#### Create lens
```typescript
import {createLens} from 'immutable-lens'

type State = {
   user: {
      name: string
      age: number
   }
}
const lens = createLens<State>()
```

#### Focus
```typescript
const userLens = lens.focusPath('user')
const nameLens = userLens.focusPath('name')
const ageLens = lens.focusPath('user', 'age')
```

#### Read
```typescript
const state: State = {
   user: {
      name: 'Bob',
      age: 18
   }
}

userLens.read(state) // {name: 'Bob', age: 18}
nameLens.read(state) // 'Bob'
```

#### Update
```typescript
const setNameToJohn = 
   // THE FOUR LINES BELOW ARE ALL EQUIVALENT
   nameLens.setValue('John')
   nameLens.update(currentName => 'John')
   userLens.setFields({name: 'John'})
   userLens.updateFields({name: (currentName) => 'John'})
   userLens.updatePartial(user => ({name: 'John'}))

setNameToJohn(state) // {user: {name: 'John', age: 18}}
```

#### Compose updates with `pipeUpdaters()`
```typescript
import {createLens, pipeUpdaters} from 'immutable-lens'

type State = {
   user: {
      name: string
   }
}

const state = {
   user: {
      name: 'Bob',
   }
}

const nameLens = createLens<State>().focusPath('user', 'name')

const setNameToJohn = nameLens.setValue('John')
const uppercaseName = nameLens.update(name => name.toUpperCase())

const setNameToJOHN = pipeUpdaters(
   setNameToJohn,
   uppercaseName
)

const updatedState = setNameToJOHN(state) // {user: {name: 'JOHN', age: 18}}
```

#### Use `defaultTo()` to avoid undefined values when reading or updating optional types
```typescript
import {createLens} from 'immutable-lens'

type State = {
   loggedUser?: {
      name: string
      age: number
   }
}

const state = {
   // optional loggedUser field is undefined
}

const nameLens = createLens<State>()
   .focusOn('loggedUser')
   .defaultTo({name: 'Guest', age: 0})
   .focusOn('name')

const name = nameLens.read(state) // 'Guest'

const setNameToBob = nameLens.setValue('Bob')
const updatedState = setNameToBob(state) // {user: {name: 'Bob', age: 0}}
```

#### Focus on array index
```typescript
import {Lens, createLens} from 'immutable-lens'

type Person = {
   name: string
}

type State = {
   friends: Person[] 
}

const firstFriendLens = createLens<State>()
   .focusOn('friends')
   .focusIndex(0)
   
const firstFriend: Person | undefined = firstFriendLens.read({friends: []})
```

<!-- #### Compose Lenses
```typescript
import {createLens, createComposedLens} from 'immutable-lens'

type State = {
   todoList: string[]
}
const lens = createLens<State>()

const composedLens = createComposedLens<State>().withFields({
   firstTodoItem: lens.focusOn('todoList').focusIndex(0)
})

const setImproveReadmeAsFirstTodoItem = composedLens.setFieldValues({firstTodoItem: 'Improve README'})

setImproveReadmeAsFirstTodoItem({todoList: []}) // {todoList: ['Improve README']}
``` -->
