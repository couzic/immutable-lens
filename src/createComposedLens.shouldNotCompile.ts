import {createComposedLens} from './createComposedLens'
import {Source} from '../test/testData'

// composing null @shouldNotCompile
createComposedLens<Source>().withFields(null)

// composing undefined @shouldNotCompile
createComposedLens<Source>().withFields(undefined)

// composing field with null @shouldNotCompile
createComposedLens<Source>().withFields({fieldName: null})

// composing field with undefined @shouldNotCompile
createComposedLens<Source>().withFields({fieldName: undefined})

// composing field with string @shouldNotCompile
createComposedLens<Source>().withFields({fieldName: 'string'})

// composing field with updater @shouldNotCompile
createComposedLens<Source>().withFields({fieldName: (value) => value})

//////////////////////////////////
// Should not but does compile //
////////////////////////////////

// composing function @shouldNotButDoesCompile
createComposedLens<Source>().withFields(() => ({}))
