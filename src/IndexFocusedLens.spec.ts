import { expect } from 'chai'

import { createLens } from './createLens'

describe('IndexFocusedLens', () => {
   describe('when focused on object', () => {
      type User = { name: string }
      type Data = { users: User[] }
      const lens = createLens<Data>()
         .focusPath('users')
         .focusIndex(0)

      it('returns path', () => {
         expect(lens.path).to.equal('root.users[0]')
      })

      it('can default to value', () => {
         lens.defaultTo({ name: 'Default User' })
      })

      describe('when target is defined', () => {
         const definedUser = { name: 'User Name' }
         const data = { users: [definedUser] }

         it('can read value', () => {
            expect(lens.read(data)).to.equal(data.users[0])
         })

         it('can set value', () => {
            const newUser: User = { name: 'New User' }
            const result = lens.setValue(newUser)(data)
            expect(result.users.length).to.equal(data.users.length)
            expect(result.users[0]).to.equal(newUser)
            expect(result.users[0]).to.deep.equal(newUser)
         })

         it('returns same data reference if value does not change', () => {
            const result = lens.setValue(data.users[0])(data)
            expect(result).to.equal(data)
         })

         it('can update value', () => {
            const user: User = { name: 'Updated User' }
            const result = lens.update(() => user)(data)
            expect(result).not.to.equal(data)
            expect(result.users[0]).to.equal(user)
            expect(result.users[0]).to.deep.equal(user)
         })

         it('returns same data reference if updated value unchanged', () => {
            const result = lens.update(() => definedUser)(data)
            expect(result).to.equal(data)
         })

         it('can update field values', () => {
            const result = lens.throwIfUndefined().updatePartial(value => ({
               name: value.name.toUpperCase(),
            }))(data)
            expect(result).not.to.equal(data)
            expect(result.users[0]).not.to.equal(data.users[0])
            expect(result.users[0]).to.deep.equal({
               name: data.users[0].name.toUpperCase(),
            })
         })
      })

      describe('when target is undefined', () => {
         const data = { users: [] }

         it('returns undefined when reading', () => {
            const result = lens.read(data)
            expect(result).to.equal(undefined)
         })

         it('can set value', () => {
            const newUser: User = { name: 'New User' }
            const result = lens.setValue(newUser)(data)
            expect(result).not.to.equal(data)
            expect(result.users.length).to.not.equal(data.users.length)
            expect(result.users).to.deep.equal([newUser])
         })

         it('returns same reference when update returns undefined', () => {
            const result = lens.update(user => undefined)(data)
            expect(result).to.equal(data)
         })

         it('updates target', () => {
            const updatedUser = { name: 'Updated User' }
            const result = lens.update(user => updatedUser)(data)
            expect(result.users[0]).to.equal(updatedUser)
         })

         it('can throw', () => {
            lens.throwIfUndefined()
         })
      })
   })
})
