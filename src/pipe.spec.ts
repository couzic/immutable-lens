import {expect} from 'chai'
import {pipe} from './pipe'

describe('pipe', () => {

   it('handles no updater', () => {
      const result = pipe()
      expect(result('something')).to.equal('something')
   })

   it('handles single updater', () => {
      const updater = (i: number) => i + 1
      const result = pipe(updater)
      expect(result(42)).to.equal(43)
   })

   it('handles double updater', () => {
      const first = (i: number) => i * 2
      const second = (i: number) => i + 1
      const result = pipe(first, second)
      expect(result(42)).to.equal(85)
   })

})
