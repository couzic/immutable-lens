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
      lastName: 'Doe',
   },
}

describe('ImmutableLens.updatePartial()', () => {
   it('can update field', () => {
      const result = lens.updatePartial(state => ({
         text: state.text.toLowerCase(),
      }))(message)
      expect(result.text).to.equal(message.text.toLowerCase())
   })

   describe('on recomposed lens', () => {
      const recomposed = lens.recompose({
         user: lens.focusPath('user'),
      })
   })
})
