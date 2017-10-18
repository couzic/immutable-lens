import {expect} from 'chai'
import {createLens} from './createLens'
import {Source, source, TodoItem} from '../test/data.test'

describe('RecomposedLens', () => {

   const rootLens = createLens<Source>()
   const lens = rootLens.recompose({
      todoList: rootLens.focusPath('todo', 'list')
   })

   it('has path', () => {
      expect(lens.path).to.equal('recomposed({todoList})')
   })

   it('can read', () => {
      expect(lens.read(source)).to.deep.equal({todoList: source.todo.list})
      expect(lens.read(source).todoList).to.equal(source.todo.list)
   })

   it('can set value', () => {
      const newList: TodoItem[] = []
      const result = lens.setValue({
         todoList: newList
      })(source)
      expect(result.todo).to.deep.equal({
         ...source.todo,
         list: newList
      })
      expect(result.todo.list).to.equal(newList)
   })

})
