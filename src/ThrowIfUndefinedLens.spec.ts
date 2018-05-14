import { expect } from 'chai'

import { createLens } from './createLens'

describe('ThrowIfUndefinedLens', () => {
   describe('when focused on object', () => {
      type Data = { user?: { name: string } }
      const lens = createLens<Data>()
         .focusPath('user')
         .throwIfUndefined()

      it('returns path', () => {
         expect(lens.path).to.equal('root.user?.throwIfUndefined')
      })

      // TODO Add type test
      it('returns itself when asked to throw if undefined', () => {
         expect((lens as any).throwIfUndefined()).to.equal(lens)
      })

      describe('when defined', () => {
         const data = { user: { name: 'Bob' } }

         it('can read value', () => {
            expect(lens.read(data)).to.equal(data.user)
         })
      })

      describe('when undefined', () => {
         const data = {}

         it('can throw', () => {
            expect(() => lens.read(data)).to.throw()
         })

         // TODO Add type test
         it('can default to value', () => {
            const defaultUser = { name: 'Default user' }
            expect((lens as any).defaultTo(defaultUser).read(data)).to.equal(
               defaultUser,
            )
         })
      })
   })
})
