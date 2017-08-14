# WIP - immutable-lens

#### Type-safe Lens API for immutable updates in complex data structures

### Features
 - No mutations (obviously...)
 - Human-friendly API
 - Bring in your favorite functional library (Ramda, lodash-fp, date-fns, Immutable.js...)
 - Written in TypeScript for maximal type-safety

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
const lens = createLens<State>()
```

#### Focus
```ts
const userLens = lens.focusOn('user')
const userNameLens = userLens.focusOn('name')
```

#### Describe and apply updates
```ts
const setUserNameToJohn = 
   // THE FOUR LINES BELOW ARE ALL EQUIVALENT
   userNameLens.setValue('John')
   userNameLens.update(name => 'John')
   userLens.setFieldValues({name: 'John'})
   userLens.updateFields({name: (name) => 'John'})

setUserNameToJohn({user: {name: 'Bob'}}) // {user: {name: 'John'}}
```

#### Use `defaultTo()` to avoid undefined values when updating optional types
```ts
type State = {
   loggedUser?: {
      name: string
   }
}
const defaultUserLens = createLens<State>()
   .focusOn('loggedUser')
   .defaultTo({name: 'Default User'})

const setLoggedUserNameToBob = defaultUserLens
   .focusOn('name')
   .setValue('Bob')

setLoggedUserNameToBob({}) // {user: {name: 'Bob'}}

```

#### `pipe()`

#### `getPath()`
