# WIP - immutable-lens

#### Type-safe Lens API for immutable updates in deep data structures

### Features
 - No mutations (obviously...)
 - Human-friendly API
 - Update your Redux store, your React component state... whatever !
 - Use it with your favorite libraries (Ramda, lodash-fp, date-fns, Immutable.js...)
 - Optimized support for the strict equality checks performed in `React.PureComponent`, `connect()`...
 - Written in TypeScript, designed for maximal type-safety

### Quickstart

#### Install
```sh
$ npm i -S immutable-lens
```

#### Create a Lens
```ts
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
```ts
const userLens = lens.focusOn('user')
const nameLens = userLens.focusOn('name')
```

#### Read
```ts
const state = {
   user: {
      name: 'Bob',
      age: 18
   }
}

const user = userLens.read(state) // {name: 'Bob', age: 18}
const name = nameLens.read(state) // 'Bob'
```

#### Describe and apply updates
```ts
const state = {
   user: {
      name: 'Bob',
      age: 18
   }
}

const setNameToJohn = 
   // THE FOUR LINES BELOW ARE ALL EQUIVALENT
   nameLens.setValue('John')
   nameLens.update(currentName => 'John')
   userLens.setFieldValues({name: 'John'})
   userLens.updateFields({name: (currentName) => 'John'})

const updatedState = setNameToJohn(state) // {user: {name: 'John', age: 18}}
```

#### Use `defaultTo()` to avoid undefined values when reading or updating optional types
```ts
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

#### Use `pipe()` to compose updates
```ts
type State = {
   user: {
      name: string
   }
}

const state = {
   user: {
      name: 'Bob',
      age: 18
   }
}

const nameLens = createLens<State>()
   .focusOn('user')
   .focusOn('name')

const setNameToJohn = nameLens.setValue('John')
const uppercaseName = nameLens.update(name => name.toUpperCase())

const setNameToJOHN = pipeUpdates(
   setNameToJohn,
   uppercaseName
)

const updatedState = setNameToJOHN(state) // {user: {name: 'JOHN', age: 18}}
```

#### `getPath()`
