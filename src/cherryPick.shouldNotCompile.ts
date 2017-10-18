import {source} from '../test/data.test'
import {cherryPick} from './cherryPick'
import {createLens} from './createLens'

// Extracting null source @shouldNotCompile
cherryPick(null, {})

// Extracting undefined source @shouldNotCompile
cherryPick(undefined, {})

// Extracting with null extractors @shouldNotCompile
cherryPick(source, null)

// Extracting with undefined extractors @shouldNotCompile
cherryPick(source, undefined)

// Extracting with unknown key extractor @shouldNotCompile
cherryPick(source, {unknown: {} as any})

// Extracting with wrong lens source @shouldNotCompile
cherryPick(source, {counter: createLens({counter: 0})})

//////////////////////////////////
// Should not but does compile //
////////////////////////////////

// Extracting wrong source type @shouldNotButDoesCompile
cherryPick(source, () => null)
