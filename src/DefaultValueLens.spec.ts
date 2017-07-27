import {expect} from 'chai'
import {createLens} from './Lens'

describe('DefaultValueLens', () => {

   describe('when defaults to undefined', () => {
      type User = { name: string }
      type Data = { user?: User }
      const lens = createLens<Data>().focusOn('user').defaultTo(undefined)

      it('throws error when updating value', () => {
         expect(() => lens.update({}, v => v)).to.throw()
      })

      it('can override default to defined value', () => {
         const name = 'User Name'
         const user = lens.defaultTo({name}).read({})
         expect(user).to.deep.equal({name})
      })
   })

   describe('when focused on object', () => {
      type User = { name: string }
      type Data = { user?: User }
      const defaultUser: User = {name: 'Default User'}
      const lens = createLens<Data>().focusOn('user').defaultTo(defaultUser)

      it('returns path', () => {
         expect(lens.getPath()).to.equal('source.user?.defaultTo({"name":"Default User"})')
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
            const result = lens.setValue(data, newUser)
            expect(result.user).to.equal(newUser)
         })

         it('can update value', () => {
            const updatedName = 'Updated Name'
            const result = lens.update(data, user => ({name: updatedName}))
            expect(result.user).to.deep.equal({name: updatedName})
         })

         it('can update fields', () => {
            const result = lens.updateFields(data, {name: (name) => name.toUpperCase()})
            expect(result.user).to.deep.equal({name: defaultUser.name.toUpperCase()})
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

         it('can update fields', () => {
            const result = lens.updateFields(data, {name: (name) => name.toUpperCase()})
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
})