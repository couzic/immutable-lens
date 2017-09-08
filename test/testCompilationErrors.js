/**
 * @author AlexGalays
 */
const ts = require('typescript')
const chalk = require('chalk')
const fs = require('fs')

const tsOptions = {noImplicitAny: false, noEmit: true, strict: true, target: 'es5'}
const expectedErrorCount = (fs.readFileSync('test/shouldNotCompile.ts', 'utf8').match(/@shouldNotCompile/g) || []).length
const program = ts.createProgram(['test/shouldNotCompile'], tsOptions)
const diagnostics = ts.getPreEmitDiagnostics(program)

if (diagnostics.length === expectedErrorCount) {
   console.log(chalk.green('All the expected compilation errors were found'))
}
else {
   const lines = errors(diagnostics).map(d => d.line).join(', ')
   console.log(chalk.red(`${expectedErrorCount} errors were expected but ${diagnostics.length} errors were found at these lines: ${lines}`))
}

function errors(arr) {
   // console.log(arr.filter(diag => diag.file.path !== '/home/mcouzic/WebstormProjects/immutable-lens/test/shouldNotCompile.ts').map(diag => diag.file.path + ', line ' + diag.file.getLineAndCharacterOfPosition(diag.start).line + ', message: ' + diag.messageText))
   return arr.map(diag => ({line: diag.file.getLineAndCharacterOfPosition(diag.start).line + 1}))
}
