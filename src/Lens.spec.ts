import {expect} from 'chai'
import {createLens} from './Lens'

type Source = {
   counter: number
   todo: {
      input: string
      list: string[]
      count: number
   }
}

const source = {
   counter: 42,
   todo: {
      input: 'input',
      list: [],
      count: 42
   }
}

const lens = createLens<Source>()

describe('Lens', () => {

   it('can read', () => {
      const result = lens.read(source)
      expect(result).to.deep.equal(source)
   })

})
