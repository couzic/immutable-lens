import { expect } from 'chai'

import { Source, source } from '../test/data.test'
import { cherryPick } from './cherryPick'
import { createLens } from './createLens'

describe('cherryPick()', () => {
   it('extracts single deep field', () => {
      const lens = createLens<Source>()
      const result = cherryPick(source, {
         todoList: lens.focusPath('todo', 'list'),
      })
      expect(result).to.deep.equal({ todoList: source.todo.list })
      expect(result.todoList).to.equal(source.todo.list)
   })

   it('throws error when passed a function instead of field lenses', () => {
      expect(() => cherryPick(source, () => null)).to.throw()
   })
})
