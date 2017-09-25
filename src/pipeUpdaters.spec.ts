import {expect} from 'chai'
import {pipeUpdaters} from './pipeUpdaters'

describe('pipeUpdaters', () => {

   it('handles no updater', () => {
      const result = pipeUpdaters()
      expect(result('something')).to.equal('something')
   })

   it('handles single updater', () => {
      const updater = (i: number) => i + 1
      const result = pipeUpdaters(updater)
      expect(result(42)).to.equal(43)
   })

   it('handles double updater', () => {
      const first = (i: number) => i * 2
      const second = (i: number) => i + 1
      const result = pipeUpdaters(first, second)
      expect(result(42)).to.equal(85)
   })

})
