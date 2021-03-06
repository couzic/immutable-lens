import { expect } from 'chai'

import { createLens } from './createLens'

interface Message {
   text: string
   user?: {
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

describe('ImmutableLens.focus()', () => {
   it('can read', () => {
      const textLens = lens.focus(m => m.text, text => m => ({ ...m, text }))
      const result = textLens.read(message)
      expect(result).to.equal(message.text)
   })

   it('can set value', () => {
      const textLens = lens.focus(m => m.text, text => m => ({ ...m, text }))
      const result = textLens.setValue('New Text')(message)
      expect(result).to.deep.equal({ ...message, text: 'New Text' })
   })

   it('can set value (curried)', () => {
      const textLens = lens.focus(m => m.text, text => m => ({ ...m, text }))
      const result = textLens.setValue()('New Text')(message)
      expect(result).to.deep.equal({ ...message, text: 'New Text' })
   })
})
