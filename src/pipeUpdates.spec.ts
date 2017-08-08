import {expect} from 'chai'
import {pipeUpdates} from './pipeUpdates'

describe('pipeUpdates', () => {

   it('handles empty input', () => {
      const result = pipeUpdates()
      expect(result('something')).to.equal('something')
   })

   it('handles single input', () => {
      const update = (i: number) => i + 1
      const result = pipeUpdates(update)
      expect(result(42)).to.equal(43)
   })

   it('handles double input', () => {
      const first = (i: number) => i * 2
      const second = (i: number) => i + 1
      const result = pipeUpdates(first, second)
      expect(result(42)).to.equal(85)
   })

})
