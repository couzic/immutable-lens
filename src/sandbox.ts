import { createLens } from './createLens'

type State = {
   user: {
      name: string
   }
}
const lens = createLens<State>()

const userLens = lens.focusPath('user')
const userNameLens = userLens.focusPath('name')

const setUserNameToJohn =
   // THE FOUR LINES BELOW ARE ALL EQUIVALENT
   userNameLens.setValue('John')
userNameLens.update(name => 'John')
userLens.setFields({ name: 'John' })
userLens.updateFields({ name: name => 'John' })

setUserNameToJohn({ user: { name: 'Bob' } }) // {user: {name: 'John'}}

type StateOpt = {
   loggedUser?: {
      name: string
   }
}
const defaultUserLens = createLens<StateOpt>()
   .focusPath('loggedUser')
   .defaultTo({ name: 'Default User' })

const setLoggedUserNameToBob = defaultUserLens.focusPath('name').setValue('Bob')

setLoggedUserNameToBob({}) // {user: {name: 'Bob'}}
