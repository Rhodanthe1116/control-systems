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
        <>
            <Layout>
                <Head>
                    <title>Interactive Control Systems</title>
                </Head>
                <Container>
                    <Intro />
                    <div className="flex flex-col md:flex-row md:justify-between">



                        <div>


                            <div className="slidecontainer">
                                Resolution {resolution}
                                <br />
                                <input value={resolution} onChange={(e) => setResolution(Number(e.target.value))} type="range" min="1" max="1000" step="10" />
                            </div>

                            {/* <BlockMath math="KG(s)H(s) = \frac{K(s + z_1)(s + z_2) }{(s + p_1)(s + p_2)}" /> */}
                            <BlockMath math={String.raw`KG(s)H(s) = \frac{K${numeratorInput}}{${denominatorInput} }`} />
                            <BlockMath math={String.raw`1 + KG(s)H(s) = 0`} />

                            <BlockMath math="Damping ratio \zeta = a / (2 * \sqrt{b})" />
                            <BlockMath math="\omega_n = \sqrt{b}" />

                            <br />
                            <h3>{valid ? 'Valid' : 'Invalid'}</h3>
                            <div className="slidecontainer">
                                numerator {numerator}
                                <br />
                                <input value={numeratorInput} onChange={handleNumeratorInputChange} />
                            </div>
                            <div className="slidecontainer">
                                denominator {denominator}
                                <br />
                                <input value={denominatorInput} onChange={handleDenominatorInputChange} />
                            </div>
                            <div className="slidecontainer">
                                zeros {zeros.toString()}
                                <br />
                                {/* <input value={zerosInput} onChange={handleZerosInputChange} /> */}
                            </div>
                            <div className="slidecontainer">
                                poles {poles.toString()}
                                <br />
                                {/* <input value={polesInput} onChange={handlePolesInputChange} /> */}
                            </div>
                            <div className="slidecontainer">
                                Natural Frequency Omegan {omegan}
                                <br />
                                <input value={omegan} onChange={(e) => setOmegan(Number(e.target.value))} type="range" min="0" max="5" step="0.1" />
                            </div>
                            <div className="slidecontainer">
                                Damping ratio {damp}
                                <br />
                                <input value={damp} onChange={(e) => setDamp(Number(e.target.value))} type="range" min="0" max="1" step="0.01" className="slider" id="myRange" />
                            </div>

                            <InlineMath math="Tp = \frac{\pi}{\omega_n \sqrt{1 - \zeta^2}} = \ " />
                            <InlineMath math={`${Tp.toFixed(fixed)}`} />
                            <br />

                            <InlineMath math="\%overshoot = e^{-(\zeta\pi / \sqrt{1 - \zeta^2})} * 100 = \ " />
                            <InlineMath math={`${Tp.toFixed(fixed)}`} />
                            <br />

                            <br />
                            <InlineMath math="Ts = \frac{4}{\zeta \omega_n} = \ " />
                            <InlineMath math={`${Ts.toFixed(fixed)}`} />
                            <br />

                            <br />
                            <InlineMath math="Tr = \frac{0.8 + 2.5 * \zeta}  {\omega_n} = \ " />
                            <InlineMath math={`${Tr.toFixed(fixed)}`} />
                            <br />

                        </div>
                        <div className="w-full">

                            <div className="h-128">
                                <ScatterPlot
                                    data={[
                                        {
                                            id: '1',
                                            data: [
                                                { x: -sigmad, y: omegad }
                                            ]
                                        },
                                        zeroData,
                                        poleData,
                                        rlocusData,
                                    ]}
                                    width={500}
                                    height={500}
                                    xScale={{ type: 'linear', min: -10, max: 10 }}
                                    yScale={{ type: 'linear', min: -10, max: 10 }}
                                    margin={{ top: 50, right: 50, bottom: 50, left: 50 }}

                                />
                            </div>
                            <div className="h-64">
                                <ResponsiveLine
                                    data={generateDataFromFunction(c, 0, min(1.3 * Ts, 7), min(1.3 * Ts, 7) / resolution)}
                                    enablePoints={false}
                                    xScale={{ type: 'linear', min: 0, max: 7 }}
                                    yScale={{ type: 'linear', min: 0, max: 2 }}
                                    margin={{ top: 10, right: 30, bottom: 30, left: 30 }}
                                    yFormat=" >-.2f"
                                    axisBottom={{
                                        tickRotation: 90,
                                    }}
                                />
                            </div>
                        </div>


                    </div>

                    <div className={markdownStyles['markdown']}>
                        <BlockMath math="my'' + cy' + ky = 0" />


                    </div>
                    <br />
                </Container>
            </Layout>
        </>
    )
}

export default Chapter

