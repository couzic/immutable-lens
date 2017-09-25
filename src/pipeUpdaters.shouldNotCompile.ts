import {createLens} from './createLens'
import {Source} from '../test/testData'
import {pipeUpdaters} from './pipeUpdaters'

const lens = createLens<Source>()

// Piping null @shouldNotCompile
pipeUpdaters(null)

// Piping undefined @shouldNotCompile
pipeUpdaters(undefined)

// Piping non valid updater @shouldNotCompile
pipeUpdaters((value: number) => '42')

// Piping updater with wrong output type @shouldNotCompile
pipeUpdaters<{ toto: string }>(value => ({}))

// Piping updaters of different type @shouldNotCompile
pipeUpdaters(
   (data: number) => data,
   (data: string) => data
)

//////////////////////////////////
// Should not but does compile //
////////////////////////////////

// Piping single updater with output type being a subset of input type @shouldNotButDoesCompile
pipeUpdaters((value: { toto: string }) => ({}))

// Piping multiple updaters with output type being a subset of input type @shouldNotButDoesCompile
pipeUpdaters(
   (value: { toto: string }) => ({}),
   (value: { toto: string }) => ({})
)
