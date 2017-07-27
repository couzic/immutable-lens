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

      it('can update fields with new values', () => {
         const result = lens.updateFields(source, {
            counter: 24,
            todo: {
               ...source.todo,
               input: 'new input value'
            }
         })
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: 24,
            todo: {
               ...source.todo,
               input: 'new input value'
            }
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

      it('returns same source reference if field values are equal to source', () => {
         const result = lens.updateFields(source, {
            counter: source.counter
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

      const lens = createLens(source.todo.list)

      xit('can focus item key', () => {
         // const firstPersonName = lens.focusOn('name')
      })

   })
})