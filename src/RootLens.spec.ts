import {expect} from 'chai'
import {Source, source} from '../test/data.test'
import {createLens} from './createLens'
import {FieldsUpdater, FieldUpdaters} from './Lens'

const lens = createLens<Source>()

describe('RootLens', () => {

   it('can focus path', () => {
      const pathLens = lens.focusPath('todo', 'list')
      const todoList = pathLens.read(source)
      expect(todoList).to.equal(source.todo.list)
   })

   describe('when focused on object', () => {

      it('can read source', () => {
         const result = lens.read(source)
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('can recompose', () => {
         lens.recompose({
            todoList: lens.focusPath('todo', 'list')
         })
      })

      it('throws error when provided a function as lens fields', () => {
         expect(() => lens.recompose(() => ({}))).to.throw()
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

      it('can update fields', () => {
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

      it('can update field values', () => {
         const result = lens.updateFieldValues(({counter, todo}) => ({
            counter: counter + 1,
            todo
         }))(source)
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: source.counter + 1
         })
      })

      // it('throws error when updating unknown field value', () => {
      //    expect(() => lens.updateFieldValues(() => ({
      //       unknown: 'unknown'
      //    }))).to.throw()
      // })

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

   describe('setFieldValues updater', () => {
      it('has path', () => {
         const updater = lens.setFieldValues({})
         expect(updater.lensPath).to.equal(lens.path)
      })

      it('has meta properties', () => {
         const values = {counter: 24}
         const updater = lens.setFieldValues(values)
         expect(updater.name).to.equal('setFieldValues()')
         expect(updater.genericName).to.equal('setFieldValues()')
         expect(updater.detailedName).to.equal('setFieldValues({counter})')
         expect(updater.details).to.equal(values)
      })
   })

   describe('updateFields updater', () => {
      it('has path', () => {
         const updater = lens.updateFields({})
         expect(updater.lensPath).to.equal(lens.path)
      })

      describe('when field updater has name', () => {
         it('has meta properties', () => {
            const increment = (i: number) => i + 1
            const updaters = {counter: increment}
            const updater = lens.updateFields(updaters)
            expect(updater.name).to.equal('updateFields()')
            expect(updater.genericName).to.equal('updateFields()')
            expect(updater.detailedName).to.equal('updateFields({counter: increment})')
            expect(updater.details).to.equal(updaters)
         })
      })

      describe('when field updater is anonymous', () => {
         it('has meta properties', () => {
            const updaters: FieldUpdaters<Source> = {counter: c => c + 1}
            const updater = lens.updateFields(updaters)
            expect(updater.name).to.equal('updateFields()')
            expect(updater.genericName).to.equal('updateFields()')
            expect(updater.detailedName).to.equal('updateFields({counter})')
            expect(updater.details).to.equal(updaters)
         })
      })
   })

   describe('updateFieldValues updater', () => {
      it('has path', () => {
         const updater = lens.updateFieldValues(() => ({}))
         expect(updater.lensPath).to.equal(lens.path)
      })

      describe('when field updater has name', () => {
         it('has names', () => {
            const incrementCounter: FieldsUpdater<Source> = ({counter}) => ({
               counter: counter + 1
            })
            const updater = lens.updateFieldValues(incrementCounter)
            expect(updater.name).to.equal('incrementCounter()')
            expect(updater.genericName).to.equal('updateFieldValues()')
            expect(updater.detailedName).to.equal('updateFieldValues(incrementCounter)')
            expect(updater.details).to.equal(incrementCounter)
         })
      })

      describe('when field updater is anonymous', () => {
         it('has names', () => {
            const updater = lens.updateFieldValues(({counter}) => ({
               counter: counter + 1
            }))
            expect(updater.name).to.equal('updateFieldValues()')
            expect(updater.genericName).to.equal('updateFieldValues()')
            expect(updater.detailedName).to.equal('updateFieldValues()')
         })
      })
   })
})
