import {expect} from 'chai'
import {Source, source} from '../test/testData'
import {createLens} from './createLens'

const lens = createLens<Source>()

describe('RootLens', () => {

   describe('when focused on object', () => {

      it('can read source', () => {
         const result = lens.read(source)
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('can set new value', () => {
         const newValue = {
            ...source,
            counter: 24
         }
         const result = lens.setValue(newValue)(source)
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal(newValue)
      })

      it('can update value', () => {
         const result = lens.update(current => ({
            ...current,
            counter: 24
         }))(source)
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: 24
         })
      })

      it('can set field values', () => {
         const result = lens.setFieldValues({
            counter: 24
         })(source)
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: 24,
            todo: source.todo
         })
      })

      it('can update fields with Updater', () => {
         const result = lens.updateFields({
            counter: (v) => v + 1,
            todo: (v) => v
         })(source)
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: source.counter + 1
         })
      })

      it('returns same source reference if no fields', () => {
         const result = lens.updateFields({})(source)
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('returns same source reference if field values unchanged', () => {
         const result = lens.setFieldValues({
            counter: source.counter
         })(source)
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('returns same source reference if updated field values are unchanged', () => {
         const result = lens.updateFields({
            counter: () => source.counter
         })(source)
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('returns same source reference if updates do not change values', () => {
         const result = lens.updateFields({
            counter: v => v
         })(source)
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('throws error when passing function as fields object', () => {
         expect(() => lens.updateFields(() => '')(source)).to.throw()
      })

   })

   describe('when focused on array', () => {
      type Data = string[]
      const lens = createLens<Data>()

      it('can read index-focused value', () => {
         const result = lens.focusIndex(0).read(['Value'])
         expect(result).to.equal('Value')
      })
   })
})
