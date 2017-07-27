import {expect} from 'chai'
import {createLens} from './Lens'

describe('IndexFocusedLens', () => {

   describe('when focused on object', () => {
      type User = { name: string }
      type Data = { users: User[] }
      const lens = createLens<Data>().focusOn('users').focusIndex(0)

      it('returns path', () => {
         const path = lens.getPath()
         expect(path).to.equal('source.users[0]')
      })

      describe('when target is defined', () => {
         const definedUser = {name: 'User Name'}
         const data = {users: [definedUser]}

         it('can read value', () => {
            expect(lens.read(data)).to.equal(data.users[0])
         })

         it('can set value', () => {
            const newUser: User = {name: 'New User'}
            const result = lens.setValue(data, newUser)
            expect(result.users.length).to.equal(data.users.length)
            expect(result.users[0]).to.equal(newUser)
            expect(result.users[0]).to.deep.equal(newUser)
         })

         it('returns same data reference if value does not change', () => {
            const result = lens.setValue(data, data.users[0])
            expect(result).to.equal(data)
         })

         it('can update value', () => {
            const user: User = {name: 'Updated User'}
            const result = lens.update(data, () => user)
            expect(result).not.to.equal(data)
            expect(result.users[0]).to.equal(user)
            expect(result.users[0]).to.deep.equal(user)
         })

         it('returns same data reference if updated value unchanged', () => {
            const result = lens.update(data, () => definedUser)
            expect(result).to.equal(data)
         })
      })

      describe('when target is undefined', () => {
         const data = {users: []}

         it('returns undefined when reading', () => {
            const result = lens.read(data)
            expect(result).to.equal(undefined)
         })

         it('can set value', () => {
            const newUser: User = {name: 'New User'}
            const result = lens.setValue(data, newUser)
            expect(result).not.to.equal(data)
            expect(result.users.length).to.not.equal(data.users.length)
            expect(result.users).to.deep.equal([newUser])
         })

         it('throws error when updating value', () => {
            expect(() => lens.update(data, v => v)).to.throw()
         })
      })
   })
})
