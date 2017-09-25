import {source} from '../test/testData'
import {extract} from './extract'
import {createLens} from './createLens'

// Extracting null source @shouldNotCompile
extract(null, {})

// Extracting undefined source @shouldNotCompile
extract(undefined, {})

// Extracting with null extractors @shouldNotCompile
extract(source, null)

// Extracting with undefined extractors @shouldNotCompile
extract(source, undefined)

// Extracting with unknown key extractor @shouldNotCompile
extract(source, {unknown: {} as any})

// Extracting with wrong lens source @shouldNotCompile
extract(source, {counter: createLens({counter: 0})})

//////////////////////////////////
// Should not but does compile //
////////////////////////////////

// Extracting wrong source type @shouldNotButDoesCompile
extract(source, () => null)
