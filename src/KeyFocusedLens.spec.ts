import {expect} from 'chai'
import {source} from '../test/testData'
import {createLens} from './Lens'

describe('KeyFocusedLens', () => {

   describe('when focused on primitive', () => {

      const lens = createLens(source).focusOn('counter')

      it('can read value', () => {
         const result = lens.read(source)
         expect(result).to.equal(source.counter)
      })

      it('can set new value', () => {
         const result = lens.setValue(source, 24)
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: 24
         })
      })

      it('returns same source reference when setting same value', () => {
         const result = lens.setValue(source, source.counter)
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

      it('can update value', () => {
         const result = lens.update(source, v => v + 1)
         expect(result).to.not.equal(source)
         expect(result).to.deep.equal({
            ...source,
            counter: source.counter + 1
         })
      })

      it('returns same source reference when updating with same value', () => {
         const result = lens.update(source, () => source.counter)
         expect(result).to.equal(source)
         expect(result).to.deep.equal(source)
      })

   })

   describe('when focused on object', () => {

      const lens = createLens(source).focusOn('todo')

      it('can read value', () => {
         const result = lens.read(source)
         expect(result).to.equal(source.todo)
         expect(result).to.deep.equal(source.todo)
      })

      it('can set new value', () => {
         const result = lens.setValue(source, {
            ...source.todo,
            count: 24
         })
         expect(result).to.not.equal(source)
         expect(result.todo).to.not.equal(source.todo)
         expect(result.todo.list).to.equal(source.todo.list)
         expect(result).to.deep.equal({
            ...source,
            todo: {
               ...source.todo,
               count: 24
            }
         })
      })

      it('can update value', () => {
         const result = lens.update(source, todo => ({
            ...todo,
            count: 24
         }))
         expect(result).to.not.equal(source)
         expect(result.todo).to.not.equal(source.todo)
         expect(result.todo.list).to.equal(source.todo.list)
         expect(result).to.deep.equal({
            ...source,
            todo: {
               ...source.todo,
               count: 24
            }
         })
      })

      it('can update fields with new values', () => {
         const result = lens.updateFields(source, {
            count: 24
         })
         expect(result).to.not.equal(source)
         expect(result.todo).to.not.equal(source.todo)
         expect(result.todo.list).to.equal(source.todo.list)
         expect(result).to.deep.equal({
            ...source,
            todo: {
               ...source.todo,
               count: 24
            }
         })
      })

      it('returns same source reference when updating fields with same values', () => {
         const result = lens.updateFields(source, {
            count: source.todo.count
         })
         expect(result).to.equal(source)
         expect(result.todo).to.equal(source.todo)
         expect(result.todo.list).to.equal(source.todo.list)
         expect(result).to.deep.equal(source)
      })

      it('can update fields with value updaters', () => {
         const result = lens.updateFields(source, {
            count: v => v + 1
         })
         expect(result).to.not.equal(source)
         expect(result.todo).to.not.equal(source.todo)
         expect(result.todo.list).to.equal(source.todo.list)
         expect(result).to.deep.equal({
            ...source,
            todo: {
               ...source.todo,
               count: source.todo.count + 1
            }
         })
      })

      it('returns same source reference when value updaters return same values', () => {
         const result = lens.updateFields(source, {
            count: v => v
         })
         expect(result).to.equal(source)
         expect(result.todo).to.equal(source.todo)
         expect(result.todo.list).to.equal(source.todo.list)
         expect(result).to.deep.equal(source)
      })

      it('can focus', () => {
         const grandChildLens = lens.focusOn('count')
         const result = grandChildLens.read(source)
         expect(result).to.equal(source.todo.count)
      })

   })

   describe('when focused on optional object', () => {
      type User = { name: string }
      type Data = { user?: User }
      const lens = createLens<Data>().focusOn('user')

      describe('when target is defined', () => {
         const definedUser: User = {name: 'Defined User'}
         const data: Data = {user: definedUser}

         it('can read value', () => {
            const user = lens.read(data)
            expect(user).to.equal(definedUser)
            expect(user).to.deep.equal(definedUser)
         })
      })

      describe('when target is undefined', () => {
         const data: Data = {}

         it('returns undefined when reading value', () => {
            expect(lens.read(data)).to.equal(undefined)
         })

         it('throws error when updating undefined value', () => {
            expect(() => lens.update(source, v => v)).to.throw()
         })
      })
   })

})
