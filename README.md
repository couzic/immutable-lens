# immutable-lens

#### Type-safe Lens API for immutable updates in complex data structures

### Features
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
   user: {
      name: string
   }
}
const state: State = {user: {name: 'Bob'}}

const lens = createLens<State>() // OR
const lens = createLens(state)
```

#### Focus
```ts
const userLens = lens.focusOn('user')
const userNameLens = userLens.focusOn('name')
```

#### Describe and apply updates
```ts
const upperCaseUserName: (state: State) => State = 
   // ALL EQUIVALENT
   userNameLens.setValue('BOB')
   userNameLens.update(name => name.toUpperCase())
   userLens.setFieldValues({name: 'BOB'})
   userLens.updateFields({name: (name) => name.toUpperCase()})
   
const updatedState = upperCaseUserName(state) 
console.log(updatedState) // {user: {name: 'BOB'}}
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


