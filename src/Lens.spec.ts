import {expect} from 'chai'
import {createLens} from './Lens'

type TodoItem = {
   title: string
   done: boolean
}

type User = {
   name: string
   address: {
      street: string
      city: string
   }
}

type Source = {
   counter: number
   todo: {
      input: string
      list: TodoItem[]
      count: number
   }
   user: User | undefined
}

const source: Source = {
   counter: 42,
   todo: {
      input: 'input',
      list: [
         {title: 'item0', done: false},
         {title: 'item1', done: false},
         {title: 'item2', done: false}
      ],
      count: 42
   },
   user: undefined
}

const lens = createLens<Source>()
const counterLens = lens.focusOn('counter')
const todoLens = lens.focusOn('todo')
const todoListLens = todoLens.focusOn('list')
const todoItem0Lens = todoListLens.focusIndex(0)
const userLens = lens.focusOn('user')

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

describe('Index-focused lens', () => {

   const newTodoItem: TodoItem = {title: 'New Todo Item', done: false}

   const checkHasNotChanged = (result: Source) => {
      expect(result).to.equal(source)
      expect(result.todo).to.equal(source.todo)
      expect(result.todo.list).to.equal(source.todo.list)
      expect(result).to.deep.equal(source)
   }

   const checkHasChanged = (result: Source) => {
      expect(result).to.not.equal(source)
      expect(result.todo).to.not.equal(source.todo)
      expect(result.todo.list).to.not.equal(source.todo.list)
      checkHasNotChanged(source)
   }

   it('returns path', () => {
      const path = todoItem0Lens.getPath()
      expect(path).to.equal('source.todo.list[0]')
   })

   describe('with existing index', () => {

      it('can read value', () => {
         const result = todoItem0Lens.read(source)
         expect(result).to.equal(source.todo.list[0])
      })

      it('can set value', () => {
         const result = todoItem0Lens.setValue(source, newTodoItem)
         checkHasChanged(result)
         expect(result.todo.list.length).to.equal(source.todo.list.length)
         expect(result.todo.list[0]).to.equal(newTodoItem)
         expect(result.todo.list[0]).to.deep.equal(newTodoItem)
      })

      it('returns same source reference if value does not change', () => {
         const result = todoItem0Lens.setValue(source, source.todo.list[0])
         checkHasNotChanged(result)
      })

      it('can update value', () => {
         const result = todoItem0Lens.update(source, () => newTodoItem)
         checkHasChanged(result)
         expect(result.todo.list[0]).to.equal(newTodoItem)
         expect(result.todo.list[0]).to.deep.equal(newTodoItem)
      })

      it('returns same source reference if updated value unchanged', () => {
         const result = todoItem0Lens.update(source, () => source.todo.list[0])
         checkHasNotChanged(result)
      })

   })

   describe('with non-existing index', () => {

      const outOfRangeIndex = 42
      const outOfRangeLens = todoListLens.focusIndex(outOfRangeIndex)

      it('returns undefined when reading', () => {
         const result = outOfRangeLens.read(source)
         expect(result).to.equal(undefined)
      })

      it('can set value', () => {
         const result = outOfRangeLens.setValue(source, newTodoItem)
         checkHasChanged(result)
         expect(result.todo.list.length).to.not.equal(source.todo.list.length)
         expect(result.todo.list[outOfRangeIndex]).to.equal(newTodoItem)
      })

      it('throws error when updating value', () => {
         expect(() => outOfRangeLens.update(source, v => v)).to.throw()
      })

   })

})

describe('Array-focused lens', () => {

})

describe('Optional value focused lens', () => {

   it('throws error when updating undefined value', () => {
      expect(() => userLens.update(source, v => v)).to.throw()
   })

})

// describe('Unfocused array lens', () => {
//
//    type Person = { name: string }
//    const people: Person[] = [
//       {name: 'John'},
//       {name: 'Bob'}
//    ]
//    const lens = createLens(people)
//    const firstPersonLens = lens.focusIndex(0)
//
//    it('can focus item key', () => {
//       const firstPersonName = firstPersonLens.focusOn('name')
//    })
//
// })
