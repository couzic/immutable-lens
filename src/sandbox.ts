import {createLens} from './Lens'

type State = {
   user: {
      name: string
   }
}
const lens = createLens<State>()

const userLens = lens.focusOn('user')
const userNameLens = userLens.focusOn('name')

const setUserNameToJohn =
   // THE FOUR LINES BELOW ARE ALL EQUIVALENT
   userNameLens.setValue('John')
userNameLens.update(name => 'John')
userLens.setFieldValues({name: 'John'})
userLens.updateFields({name: (name) => 'John'})

setUserNameToJohn({user: {name: 'Bob'}}) // {user: {name: 'John'}}

type StateOpt = {
   loggedUser?: {
      name: string
   }
}
const defaultUserLens = createLens<StateOpt>()
   .focusOn('loggedUser')
   .defaultTo({name: 'Default User'})

const setLoggedUserNameToBob = defaultUserLens
   .focusOn('name')
   .setValue('Bob')

setLoggedUserNameToBob({}) // {user: {name: 'Bob'}}
