import { useState, useEffect } from 'react'
import control, { rlocusPlotData } from '../lib/control'
import nerdamer from 'nerdamer';
import { complex, Complex } from 'mathjs';

// import  '../types/nerdamer'

import 'katex/dist/katex.min.css';
import markdownStyles from '../components/markdown-styles.module.css'
 
import Post from '../types/post'

import Head from 'next/head'
import { ResponsiveLine } from '@nivo/line'
import { ScatterPlot, Serie } from '@nivo/scatterplot'
import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'

const { InlineMath, BlockMath } = require('react-katex');

const { sqrt, exp, PI, cos, sin, min } = Math

type System = {
    numerator: string,
    denominator: string
}

function generateDataFromFunction(f: (t: number) => number, start: number, end: number, step: number) {
    let data = []
    for (let x: number = start; x < end; x += step) {
        data.push({ x: x, y: f(x) })
    }
    return [
        {
            id: 'function',
            data: data
        }
    ]
}

function scatterDataFromRoot(id: string, arr: Complex[]) {
    let data = []
    data = arr.map((comp: Complex) => {
        return {
            x: comp.re, y: comp.im
        }
    })
    return {
        id: id,
        data: data
    }
}



const Chapter = () => {
    const [numeratorInput, setNumeratorInput] = useState<string>('(s + 1)(s + 2)');
    const [numerator, setNumerator] = useState<string>('(s + 1)(s + 2)');
    const [denominatorInput, setDenominatorInput] = useState<string>('(s - 1)(s - 2)');
    const [denominator, setDenominator] = useState<string>('(s - 1)(s - 2)');
    const [rlocusData, setRlocusData] = useState<Serie>({ id: 'rlocus', data: [{ x: 0, y: 0 }] });
    useEffect(() => {
        const newRlocusData = rlocusPlotData({ numerator: numerator, denominator: denominator }, { start: 0.01, end: 100, step: 1.5 })
        setRlocusData(newRlocusData)
    }, [numerator, denominator])
    const [valid, setValid] = useState(true)

    const [zerosInput, setZerosInput] = useState<string>('[-1, -2]');
    const [zeros, setZeros] = useState<Complex[]>([complex(-1, 0), complex(-2, 0)]);
    const [polesInput, setPolesInput] = useState<string>('[1, 2]');
    const [poles, setPoles] = useState<Complex[]>([complex(1, 0), complex(2, 0)]);

    const [damp, setDamp] = useState<number>(0.7);
    const [omegan, setOmegan] = useState<number>(1);
    const [resolution, setResolution] = useState<number>(20);
    const Tp: number = PI / (omegan * sqrt(1 - damp ** 2))
    const Ts: number = 4 / (damp * omegan)
    const Tr: number = (0.8 + 2.5 * damp) / omegan
    const overshoot = exp(-(damp * PI / sqrt(1 - damp ** 2))) * 100
    const omegad = omegan * sqrt(1 - damp ** 2)
    const sigmad = damp * omegan
    const c = (t: number) => k - exp(-damp * omegan * t) * (cos(omegan * sqrt(1 - damp ** 2) * t) + (damp / sqrt(1 - damp ** 2)) * sin(omegan * sqrt(1 - damp ** 2) * t))

    const k = 1
    const fixed = 3;
    function handleNumeratorInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const input = e.currentTarget.value
        setNumeratorInput(input)

        try {
            setValid(Boolean(nerdamer(input)))
            setNumerator(input)
            setZeros(control.zeros({ numerator: input, denominator: denominator }))
        } catch (e) {
            console.error(e)
            setValid(false)
        }
    }

    function handleDenominatorInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const input = e.currentTarget.value
        setDenominatorInput(input)

        let newPoles = poles
        try {
            setValid(Boolean(nerdamer(input)))
            setDenominator(input)
            setPoles(control.poles({ numerator: numerator, denominator: input }))
        } catch (e) {
            console.error(e)
            setValid(false)
        }
    }

    function handleZerosInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const input = e.currentTarget.value

        let newZeros = zeros
        try {
            newZeros = JSON.parse(input)
            setZeros(newZeros)
        } catch (e) {
            console.log(e)
        }

        setZerosInput(input)
    }

    function handlePolesInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const input = e.currentTarget.value

        let newPoles = poles
        try {
            newPoles = JSON.parse(input)
            setPoles(newPoles)
        } catch (e) {
            console.log(e)
        }

        setPolesInput(input)
    }

    const zeroData = scatterDataFromRoot('zeros', zeros)
    const poleData = scatterDataFromRoot('poles', poles)


    return (
        <Layout>
            <Head>
                <title>Interactive Control Systems</title>
            </Head>
            <Container>
                <Intro />
                <div className="flex flex-col md:flex-row md:justify-between">

                </div>
                <div className="max-w-2xl mx-auto">
                    <div className={markdownStyles['markdown']}>
                        <h2>Frequency Domain</h2>
                        <BlockMath math="f(t) = M_icos(\omega t + \phi) = M_i(\omega)<\phi(\omega)" />
                        <BlockMath math="G(j\omega) = G(s)\Big|_{s->j\omega}" />

                        <h3>Contrast</h3>
                        <BlockMath math="\mathcal{L}\{f(t)\} = \int_{0}^{\infty}f(t)e^{-st}dt" />
                        <BlockMath math="\mathcal{F}\{f(t)\} = \int_{0}^{\infty}f(t)e^{-j\omega}dt" />

                        <h3>Bode plot</h3>
                        <BlockMath math="Bode plot" />
                        <BlockMath math="20logM - \omega" />
                        <BlockMath math="\phi - log\omega" />

                        <BlockMath math="G(\omega) = \frac{2-j\omega}{\omega^2 + 4}" />
                        <BlockMath math="|G(\omega)| = \frac{1}{\omega^2 + 4} \sqrt{2^2 + \omega^2}" />
                        <BlockMath math="|\phi| = tan^{-1}{(-\frac{\omega}{2})}" />

                        <h2>Approximation</h2>
                        <BlockMath
                            math="G(s) = \frac{K(s + z_1)(s + z_2)...(s + z_k)}{s^m(s + p_1)(s + p_2)...(s + p_n)}" />
                        <h3>Magnitude</h3>
                        <BlockMath
                            math="|G(j\omega)| = \frac{K|(s + z_1)||(s + z_2)|...|(s + z_k)|}{|s^m||(s + p_1)||(s + p_2)|...|(s + p_n)|}" />
                        <BlockMath
                            math="20log|G(j\omega)| = 20logK + 20log|(s + z_1)| + 20log|(s + z_2)| + ... 
                            - 20log|s^m| - 20log|(s + p_1)| - 20log|(s + p_2)|..." />

                        <h3>Phase</h3>
                        <BlockMath
                            math="<G(j\omega) = K + (s + z_1) + ... - (s + p_1) - ... -(s + p_n)" />


                        <h2>Ex:</h2>
                        <BlockMath math="G(s) = (s + a)" />
                        <BlockMath math="20log|G(j\omega)| = 20log(a^2 + \omega^2)^{1/2}" />
                        <p>At high frequency at w {'>>'}  a</p>
                        <BlockMath math="20log|G(j\omega)| = 20loga" />
                        <p>At high frequency at w {'>>'}  a</p>
                        <BlockMath math="20log|G(j\omega)| = 20log\omega" />
                        <p>Decade: 10 times the initial frequency, i.e. 1 decade = 10^0 ~ 10^1 Hz or rad/sec</p>
                        <p>Phase: 0 at w = 0.1a, 45 at w = a, 90 at w = 10a</p>
                    </div>
                </div>
                <br />
            </Container>
        </Layout>
    )
}

export default Chapter

