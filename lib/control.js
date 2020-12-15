const nerdamer = require('nerdamer')
require('nerdamer/Solve')
require('nerdamer/Algebra')
require('nerdamer/Calculus')
const { complex, add, multiply, sin, sqrt, pi, equal, sort, format } = require('mathjs')

function rootsFromRawRoots(rawRoots) {
    const roots = rawRoots.map(root => {
        const re = nerdamer(nerdamer.realpart(root)).evaluate().text()
        const im = nerdamer(nerdamer.imagpart(root)).evaluate().text()
        const comp = complex(re, im)
        return comp

    })
    return roots
}
exports.rlocusPlotData = (sys, { start = 0, end = 30, step = 2 } = {}) => {

    let x = []
    let data = [{ x: 1, y: 1 }]
    data.pop()
    for (let k = start; k < end; k *= step) {
        const eq = `1 + ${k} * (${sys.numerator})/(${sys.denominator})`
        const rawRoots = nerdamer.solveEquations(eq, 's')
        const roots = rootsFromRawRoots(rawRoots)

        roots.forEach(root => {
            data.push({ x: root.re, y: root.im })
        })
    }
    return {
        id: 'rlocus',
        data: data
    }


}