import nerdamer, { realpart, imagpart, solveEquations } from 'nerdamer'
import 'nerdamer/Solve'
import 'nerdamer/Algebra'
import 'nerdamer/Calculus'
import { complex } from 'mathjs'

function complexesFromAnswers(answers) {

    let comps = [complex(1, 0)]
    comps.pop()
    console.log(answers)
    comps = answers.map(answer => {
        const re = nerdamer(realpart(answer)).evaluate().text()
        const im = nerdamer(imagpart(answer)).evaluate().text()
        const comp = complex(re, im)
        return comp

    })
    return comps
}

export function zeros(sys) {
    const eq = `${sys.numerator}`
    try {
        const answers = solveEquations(eq, 's')
        const zeros = complexesFromAnswers(answers)
        return zeros
    } catch {
        return []
    }

}
export function poles(sys) {
    const eq = `${sys.denominator}`
    const answers = solveEquations(eq, 's')
    const poles = complexesFromAnswers(answers)

    return poles
}

export function rlocusPlotData(sys, { start = 0, end = 30, step = 2 } = {}) {
    console.log(sys)
    console.log('calculating rlocus, this may take a while...')
    let data = [{ x: 1, y: 1 }]
    data.pop()
    for (let k = start; k < end; k *= step) {
        const eq = `1 + ${k} * (${sys.numerator})/(${sys.denominator})`
        const answers = solveEquations(eq, 's')
        const roots = complexesFromAnswers(answers)

        roots.forEach(root => {
            data.push({ x: root.re, y: root.im })
        })
    }
    return {
        id: 'rlocus',
        data: data
    }
}

export default  {
    zeros, poles, rlocusPlotData
}