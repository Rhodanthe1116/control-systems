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
/**
 *
 *  Evaluate the transfer function at a list of angular frequencies.
*   Reports the frequency response of the system,
*        G(j*omega) = mag*exp(j*phase)
*   for continuous time. For discrete time systems, the response is
*   evaluated around the unit circle such that
*        G(exp(j*omega*dt)) = mag*exp(j*phase).
*   Parameters
*   ----------
*   @param {*} sys : system
*       A system.
*   @param {*} omega : array_like
*       A list of frequencies in radians/sec at which the system should be
*       evaluated. The list can be either a python list or a numpy array
*       and will be sorted before evaluation.
*   Returns
*   -------
*   @param {*} mag : (self.outputs, self.inputs, len(omega)) ndarray
*       The magnitude (absolute value, not dB or log10) of the system
*       frequency response.
*   @param {*} phase : (self.outputs, self.inputs, len(omega)) ndarray
*       The wrapped phase in radians of the system frequency response.
*   @param {*} omega : ndarray or list or tuple
*       The list of sorted frequencies at which the response was
*       evaluated.
*   """
 */
export function freqresp(sys, omega = []) {

    // Preallocate outputs.
    const num_freq = omega.length
    let mag = []
    let phase = []

    // Figure out the frequencies
    omega.sort()
    slist = omega.map(w => complex(0, w))

    // Compute frequency response for each input/output pair

    // fresp = (polyval(self.num[i][j], slist) /
    //             polyval(self.den[i][j], slist))
    // mag[i, j, :] = abs(fresp)
    // phase[i, j, :] = angle(fresp)

    return mag, phase, omega
}
/**
 *
 *
 * @export
 * @param {*} sys
 * @param {*} [{ start = 0, end = 30, step = 2 }={}]
 * @return {*} 
 */
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

export default {
    zeros, poles, rlocusPlotData
}