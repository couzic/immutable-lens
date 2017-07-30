# immutable-lens

#### Type-safe Lens API for immutable updates in complex data structures

### Introduction
 - No mutations
 - Powerful API

### Quickstart

#### Install
```sh
$ npm i -S immutable-lens
```

#### Create a Lens
```ts
import {createLens} from 'immutable-lens'

type State = {
   counter: number
   user: {
      id: string
      name: string
   }
}
const state: State = { ... }

const lens = createLens<State>() // OR
const lens = createLens(state)
```

#### Focus
```ts
const counterLens = lens.focusOn('counter')
const userNameLens = lens.focusOn('user').focusOn('name')
```

#### Update
```ts
const updatedState: State = 
   userNameLens.setValue(state, 'Bob')
   userNameLens.update(state, name => 'Bob')
   lens.focusOn('user').setFieldValues(state, {name: 'Bob'})
   lens.focusOn('user').updateFields(state, {name: () => 'Bob'})
```

#### Optional types
```ts
type State = {
   loggedUser?: {
      name: string
   }
}
const state: State = { ... }

const lens = createLens<State>()
const loggedUserLens = lens.focusOn('loggedUser')

loggedUserLens.setValue(state, {name: 'Bob}) // OK
loggedUserLens.update(state, loggedUser => ({name: 'Bob'})) // OK (Runtime error if loggedUser udefined)

loggedUserLens.setFieldValues(state, { ... }) // ERROR: 
loggedUserLens.defaultTo({ id: '', name: 'Default User' })
```


