import {expect} from 'chai'
import {createLens} from './Lens'
import {Source, source} from '../test/testData'

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
         const result = lens.setValue(source, newValue)
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal(newValue)
      })

      it('can update value', () => {
         const result = lens.update(source, current => ({
            ...current,
            counter: 24
         }))
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: 24
         })
      })

      it('can set field values', () => {
         const result = lens.setFieldValues(source, {
            counter: 24
         })
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: 24,
            todo: source.todo
         })
      })

      it('can update fields with updater', () => {
         const result = lens.updateFields(source, {
            counter: (v) => v + 1,
            todo: (v) => v
         })
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: source.counter + 1
         })
      })

      it('returns same source reference if no fields', () => {
         const result = lens.updateFields(source, {})
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('returns same source reference if field values unchanged', () => {
         const result = lens.setFieldValues(source, {
            counter: source.counter
         })
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('returns same source reference if updated field values are unchanged', () => {
         const result = lens.updateFields(source, {
            counter: () => source.counter
         })
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('returns same source reference if updaters do not change values', () => {
         const result = lens.updateFields(source, {
            counter: v => v
         })
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('throws error when passing function as fields object', () => {
         expect(() => lens.updateFields(source, () => '')).to.throw()
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
