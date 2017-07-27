import {expect} from 'chai'
import {bob, source} from '../test/testData'
import {createLens} from './Lens'

describe('DefaultValueLens', () => {

   describe('when focused on object', () => {

      const lens = createLens(source).focusOn('user').defaultTo(bob)

      it('returns default value when undefined', () => {
         const user = lens.read(source)
         expect(user).to.equal(bob)
      })

      it('returns value when present')

      it('can read default value field', () => {
         const name = lens.focusOn('name').read(source)
         expect(name).to.equal(bob.name)
      })

      it('returns focused field value when object present')

   })

})
