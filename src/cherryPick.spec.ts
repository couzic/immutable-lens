import {expect} from 'chai'
import {createLens} from './createLens'
import {Source, source} from '../test/data.test'
import {cherryPick} from './cherryPick'

describe('cherryPick()', () => {

   it('extracts single deep field', () => {
      const lens = createLens<Source>()
      const result = cherryPick(source, {
         todoList: lens.focusOn('todo').focusOn('list')
      })
      expect(result).to.deep.equal({todoList: source.todo.list})
      expect(result.todoList).to.equal(source.todo.list)
   })

   it('throws error when passed a function instead of field lenses', () => {
      expect(() => cherryPick(source, () => null)).to.throw()
   })

})
