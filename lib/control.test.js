import { solveEquations } from 'nerdamer'
import 'nerdamer/Solve'
import 'nerdamer/Algebra'
import 'nerdamer/Calculus'
import { complex } from 'mathjs'
import { rlocusPlotData } from './control'

function test() {
    sys = {
        numerator: '(s + 1)(s + 2)',
        denominator: '(s - 1)(s - 2)'
    }
    let data = rlocusPlotData(sys, { start: 0.01, end: 30, step: 2 })
    console.log(data)

    // [1, -5, 6], [1, 5, 6, 0]
    sys = {
        numerator: '(s - 2)(s - 3)',
        denominator: 's(s + 2)(s + 3)'
    }
    data = rlocusPlotData(sys, { start: 0.01, end: 30, step: 2 })
    console.log(data)

    const eq = `1`
    const rawRoots = solveEquations(eq, 's')
    console.log(rawRoots.toString())
    // const roots = rootsFromRawRoots(rawRoots)
}

test()