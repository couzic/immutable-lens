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
      list: ['item0', 'item1', 'item2'],
      count: 42
   }
}

const lens = createLens<Source>()
const counterLens = lens.focusOn('counter')
const todoLens = lens.focusOn('todo')
const todoListLens = todoLens.focusOn('list')
const todoItem0Lens = todoListLens.focusIndex(0)

describe('Unfocused Lens', () => {

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

describe('Primitive-focused Lens', () => {

   it('can read value', () => {
      const result = counterLens.read(source)
      expect(result).to.equal(source.counter)
   })

   it('can set new value', () => {
      const result = counterLens.setValue(source, 24)
      expect(result).to.not.equal(source)
      expect(result).to.deep.equal({
         ...source,
         counter: 24
      })
   })

   it('returns same source reference when setting same value', () => {
      const result = counterLens.setValue(source, source.counter)
      expect(result).to.equal(source)
      expect(result).to.deep.equal(source)
   })

   it('can update value', () => {
      const result = counterLens.update(source, v => v + 1)
      expect(result).to.not.equal(source)
      expect(result).to.deep.equal({
         ...source,
         counter: source.counter + 1
      })
   })

   it('returns same source reference when updating with same value', () => {
      const result = counterLens.update(source, () => source.counter)
      expect(result).to.equal(source)
      expect(result).to.deep.equal(source)
   })

})

describe('Object-focused Lens', () => {

   it('can read value', () => {
      const result = todoLens.read(source)
      expect(result).to.equal(source.todo)
      expect(result).to.deep.equal(source.todo)
   })

   it('can set new value', () => {
      const result = todoLens.setValue(source, {
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
      const result = todoLens.update(source, todo => ({
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
      const result = todoLens.updateFields(source, {
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
      const result = todoLens.updateFields(source, {
         count: source.todo.count
      })
      expect(result).to.equal(source)
      expect(result.todo).to.equal(source.todo)
      expect(result.todo.list).to.equal(source.todo.list)
      expect(result).to.deep.equal(source)
   })

   it('can update fields with value updaters', () => {
      const result = todoLens.updateFields(source, {
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
      const result = todoLens.updateFields(source, {
         count: v => v
      })
      expect(result).to.equal(source)
      expect(result.todo).to.equal(source.todo)
      expect(result.todo.list).to.equal(source.todo.list)
      expect(result).to.deep.equal(source)
   })

   it('can focus', () => {
      const grandChildLens = todoLens.focusOn('count')
      const result = grandChildLens.read(source)
      expect(result).to.equal(source.todo.count)
   })

})

describe('Existing index focused lens', () => {

   it('can read value', () => {
      const result = todoItem0Lens.read(source)
      expect(result).to.equal(source.todo.list[0])
   })

   it('can set value', () => {
      const newValue = 'newValue'
      const result = todoItem0Lens.setValue(source, newValue)
      expect(result).to.not.equal(source)
      expect(result.todo).to.not.equal(source.todo)
      expect(result.todo.list).to.not.equal(source.todo.list)
      expect(result.todo.list.length).to.equal(source.todo.list.length)
      expect(result.todo.list[0]).to.equal(newValue)
   })

   it('returns same source reference if value does not change', () => {
      const result = todoItem0Lens.setValue(source, source.todo.list[0])
      expect(result).to.equal(source)
      expect(result.todo).to.equal(source.todo)
      expect(result.todo.list).to.equal(source.todo.list)
      expect(result).to.deep.equal(source)
   })

})
