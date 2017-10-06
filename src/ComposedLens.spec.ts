import {expect} from 'chai'
import {createLens} from './createLens'
import {Source, source, TodoItem} from '../test/testData'
import {createComposedLens} from './createComposedLens'

describe('ComposedLens', () => {

   it('should throw when provided a function as lens fields', () => {
      expect(() => createComposedLens<Source>().withFields(() => ({}))).to.throw()
   })

   const sourceLens = createLens<Source>()
   let lens = createComposedLens<Source>().withFields({
      counter: sourceLens.focusOn('counter'),
      todoList: sourceLens.focusOn('todo').focusOn('list')
   })

   it('has path', () => {
      expect(lens.path).to.deep.equal('composed({counter:source.counter, todoList:source.todo.list})')
   })

   it('can focus path', () => {
      const pathLens = lens.focusPath('todoList', 'length')
      const length = pathLens.read(source)
      expect(length).to.equal(source.todo.list.length)
   })

   it('can read source', () => {
      const composition = lens.read(source)
      expect(composition).to.deep.equal({
         counter: source.counter,
         todoList: source.todo.list
      })
      expect(composition.todoList).to.equal(source.todo.list)
   })

   it('can set field values', () => {
      const newList: TodoItem[] = []
      const updated: Source = lens.setFieldValues({todoList: newList})(source)
      expect(updated.todo.list).to.equal(newList)
   })

   it('can set value', () => {
      const newList: TodoItem[] = []
      const updated = lens.setValue({
         counter: 0,
         todoList: newList
      })(source)
      expect(updated.counter).to.equal(0)
      expect(updated.todo.list).to.equal(newList)
   })

   it('can update fields', () => {
      const newList: TodoItem[] = []
      const updated = lens.updateFields({todoList: () => newList})(source)
      expect(updated.todo.list).to.equal(newList)
   })

   it('can update value', () => {
      const newList: TodoItem[] = []
      const updated = lens.update(() => ({
         counter: 0,
         todoList: newList
      }))(source)
      expect(updated.counter).to.equal(0)
      expect(updated.todo.list).to.equal(newList)
   })

   it('can update field values', () => {
      const updated = lens.updateFieldValues(value => ({
         counter: value.counter + 1,
      }))(source)
      expect(updated.counter).to.equal(source.counter + 1)
   })

   it('can pipe updaters', () => {
      const localLens = createLens<{ counter: number, todoList: TodoItem[] }>()
      const incrementCounter = localLens.focusOn('counter').update(c => c + 1)
      const updated = lens.pipe(
         incrementCounter,
         incrementCounter
      )(source)
      expect(updated.counter).to.equal(44)
   })

   it('can focus key', () => {
      const counterLens = lens.focusOn('counter')
      const updated = counterLens.setValue(0)(source)
      expect(updated.counter).to.equal(0)
   })

})
