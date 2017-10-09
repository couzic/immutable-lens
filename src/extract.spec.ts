import {expect} from 'chai'
import {createLens} from './createLens'
import {Source, source} from '../test/data.test'
import {extract} from './extract'

describe('extract()', () => {

   it('extracts single deep field', () => {
      const lens = createLens<Source>()
      const extracted = extract(source, {
         todoList: lens.focusOn('todo').focusOn('list')
      })
      expect(extracted).to.deep.equal({todoList: source.todo.list})
      expect(extracted.todoList).to.equal(source.todo.list)
   })

   it('throws error when passed a function instead of field lenses', () => {
      expect(() => extract(source, () => null)).to.throw()
   })

})
