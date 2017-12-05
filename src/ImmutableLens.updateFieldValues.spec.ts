import { expect } from 'chai'

import { createLens } from './createLens'

interface Message {
   text: string
   user: {
      firstName: string
      lastName: string
   }
}

const lens = createLens<Message>()

const message: Message = {
   text: 'Message Text',
   user: {
      firstName: 'John',
      lastName: 'Doe'
   }
}

describe('ImmutableLens.updateFieldValues()', () => {

   it('can update field', () => {
      const result = lens.updateFieldValues(state => ({
         text: state.text.toLowerCase()
      }))(message)
      expect(result.text).to.equal(message.text.toLowerCase())
   })

   describe('on recomposed lens', () => {
      const recomposed = lens.recompose({
         user: lens.focusPath('user')
      })

      it('throws error when trying to update unknown field', () => {
         expect(() => recomposed.updateFieldValues(state => ({
            unknown: state.user.firstName
         }))(message)).to.throw('unknown')
      })
   })

})
