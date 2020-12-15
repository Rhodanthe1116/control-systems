const nerdamer = require('nerdamer')
require('nerdamer/Solve')
require('nerdamer/Algebra')
require('nerdamer/Calculus')
const { complex } = require('mathjs')
const { rlocusPlotData } = require('./control')

function test() {
    sys = {
        numerator: '(s + 1)(s + 2)',
        denominator: '(s - 1)(s - 2)'
    }
    const data = rlocusPlotData(sys, { start: 0.01, end: 30, step: 2 })
    console.log(data)
}

test()