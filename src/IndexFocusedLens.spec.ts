import {expect} from 'chai'
import {Source, source, TodoItem, todoListLens} from '../test/testData'
import {createLens} from './Lens'

const lens = createLens(source)
   .focusOn('todo')
   .focusOn('list')
   .focusIndex(0)

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

describe('IndexFocusedLens', () => {

   it('returns path', () => {
      const path = lens.getPath()
      expect(path).to.equal('source.todo.list[0]')
   })

   describe('with value at index', () => {

      it('can read value', () => {
         const result = lens.read(source)
         expect(result).to.equal(source.todo.list[0])
      })

      it('can set value', () => {
         const result = lens.setValue(source, newTodoItem)
         checkHasChanged(result)
         expect(result.todo.list.length).to.equal(source.todo.list.length)
         expect(result.todo.list[0]).to.equal(newTodoItem)
         expect(result.todo.list[0]).to.deep.equal(newTodoItem)
      })

      it('returns same source reference if value does not change', () => {
         const result = lens.setValue(source, source.todo.list[0])
         checkHasNotChanged(result)
      })

      it('can update value', () => {
         const result = lens.update(source, () => newTodoItem)
         checkHasChanged(result)
         expect(result.todo.list[0]).to.equal(newTodoItem)
         expect(result.todo.list[0]).to.deep.equal(newTodoItem)
      })

      it('returns same source reference if updated value unchanged', () => {
         const result = lens.update(source, () => source.todo.list[0])
         checkHasNotChanged(result)
      })

   })

   describe('with no value at index', () => {
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
