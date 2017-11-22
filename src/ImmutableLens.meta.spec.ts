import { expect } from 'chai'

import { Source, source } from '../test/data.test'
import { createLens } from './createLens'

describe('KeyFocusedLens', () => {

   describe('when focused on number', () => {
      const counter = createLens<Source>().focusPath('counter')

      describe('setValue updater', () => {
         const newValue = source.counter + 1
         const updater = counter.setValue(newValue)
         const {meta} = updater

         it('has path', () => {
            expect(meta.lensPath).to.equal(counter.path)
         })
         it('has meta properties', () => {
            const expectedName = 'setValue()'
            const expectedDetailedName = 'setValue(' + newValue + ')'
            expect(meta.name).to.equal(expectedName)
            expect(meta.genericName).to.equal(expectedName)
            expect(meta.detailedName).to.equal(expectedDetailedName)
            expect(meta.details).to.equal(newValue)
         })
      })

      describe('update updater', () => {
         it('has path', () => {
            const updater = counter.update(c => c)
            expect(updater.meta.lensPath).to.equal(counter.path)
         })

         describe('when wrapped updater has name', () => {
            const increment = (i: number) => i + 1
            const updater = counter.update(increment)
            const {meta} = updater
            it('has meta properties', () => {
               expect(meta.name).to.equal('increment()')
               expect(meta.genericName).to.equal('update()')
               expect(meta.detailedName).to.equal('update(increment)')
               expect(meta.details).to.equal(increment)
            })
         })

         describe('when wrapped updater is anonymous', () => {
            let updater = counter.update(c => c + 1)
            const {meta} = updater
            it('has meta properties', () => {
               const genericName = 'update()'
               expect(meta.name).to.equal(genericName)
               expect(meta.genericName).to.equal(genericName)
               expect(meta.detailedName).to.equal(genericName)
            })
         })
      })
   })

})
