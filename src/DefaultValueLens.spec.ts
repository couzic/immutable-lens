import {expect} from 'chai'
import {createLens} from './createLens'

describe('DefaultValueLens', () => {

   describe('when defaults to undefined', () => {
      type User = { name: string }
      type Data = { user?: User }
      const lens = createLens<Data>().focusOn('user').defaultTo(undefined)

      it('returns same reference when updater returns undefined', () => {
         const data = {}
         const result = lens.update(user => undefined)(data)
         expect(result).to.equal(data)
      })

      it('updates target', () => {
         const updatedUser = {name: 'Updated User'}
         const result = lens.update(user => updatedUser)({})
         expect(result.user).to.equal(updatedUser)
      })

      it('can override default to defined value', () => {
         const name = 'User Name'
         const user = lens.defaultTo({name}).read({})
         expect(user).to.deep.equal({name})
      })

      it('can throw', () => {
         expect(() => lens.throwIfUndefined().read({})).to.throw()
      })
   })

   describe('when focused on object', () => {
      type User = { name: string }
      type Data = { user?: User }
      const defaultUser: User = {name: 'Default User'}
      const lens = createLens<Data>().focusOn('user').defaultTo(defaultUser)

      it('returns path', () => {
         expect(lens.path).to.equal('source.user?.defaultTo({"name":"Default User"})')
      })

      describe('when target is undefined', () => {
         const data: Data = {
            user: undefined
         }

         it('reads default target', () => {
            const user: User = lens.read(data)
            expect(user).to.equal(defaultUser)
         })

         it('reads default target property', () => {
            const name: string = lens.focusOn('name').read(data)
            expect(name).to.equal(defaultUser.name)
         })

         it('can set value', () => {
            const newUser: User = {name: 'New User'}
            const result = lens.setValue(newUser)(data)
            expect(result.user).to.equal(newUser)
         })

         it('can update value', () => {
            const updatedName = 'Updated Name'
            const result = lens.update(user => ({name: updatedName}))(data)
            expect(result.user).to.deep.equal({name: updatedName})
         })

         it('can update fields', () => {
            const result = lens.updateFields({name: (name) => name.toUpperCase()})(data)
            expect(result.user).to.deep.equal({name: defaultUser.name.toUpperCase()})
         })

         it('returns default value even if asked to throw if undefined', () => {
            expect(lens.throwIfUndefined().read(data)).to.equal(defaultUser)
         })
      })

      describe('when target is defined', () => {
         const definedUser: User = {name: 'Defined User'}
         const data: Data = {
            user: definedUser
         }

         it('reads defined target', () => {
            const user: User = lens.read(data)
            expect(user).to.equal(definedUser)
         })

         it('reads defined target property', () => {
            const name: string = lens.focusOn('name').read(data)
            expect(name).to.equal(definedUser.name)
         })

         it('can set field values', () => {
            const newName = 'New Name'
            const result = lens.setFieldValues({name: newName})(data)
            expect(result.user).to.deep.equal({name: newName})
         })

         it('can update fields', () => {
            const result = lens.updateFields({name: (name) => name.toUpperCase()})(data)
            expect(result.user).to.deep.equal({name: definedUser.name.toUpperCase()})
         })
      })
   })

   describe('when focused on primitive array', () => {
      type Data = { names?: string[] }
      const defaultName = 'Default Name'
      const defaultArray = [defaultName]
      const lens = createLens<Data>().focusOn('names').defaultTo(defaultArray)

      describe('when target is undefined', () => {
         const data: Data = {names: undefined}

         describe('when focusing on default array defined index', () => {
            const indexLens = lens.focusIndex(0)

            it('can read default array item', () => {
               const name: string | undefined = indexLens.read(data)
               expect(name).to.equal(defaultName)
            })
         })

         describe('when focusing on default array undefined index', () => {
            const indexLens = lens.focusIndex(42)
            it('can read item', () => {
               const name: string | undefined = indexLens.read(data)
               expect(name).to.equal(undefined)
            })
         })
      })
   })

   describe('when focused on array item', () => {
      type User = { name: string }
      type Data = { users: User[] }
      const defaultUser = {name: 'Default User'}
      const lens = createLens<Data>().focusOn('users').focusIndex(0).defaultTo(defaultUser)

      describe('when target is undefined', () => {
         const data: Data = {users: []}

         it('reads default value', () => {
            const user = lens.read(data)
            expect(user).to.equal(defaultUser)
         })
      })
   })
})
