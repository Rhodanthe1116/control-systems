import { useState } from 'react'

// utils
import { factorial } from 'mathjs'

import markdownStyles from '../../components/markdown-styles.module.css'
import 'katex/dist/katex.min.css';

import { ResponsiveLine } from '@nivo/line'
import { ScatterPlot } from '@nivo/scatterplot'
import Container from '../../components/container'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'

import Post from '../../types/post'

const { InlineMath, BlockMath } = require('react-katex');

const { sqrt, exp, PI, cos, sin, min } = Math

type Props = {
    allPosts: Post[]
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

function generateDataFromBesselFunction(f: (n: number, x: number, M: number) => number, n: number, M: number, start: number, end: number, step: number) {
    let data = []
    for (let x: number = start; x < end; x += step) {
        data.push({ x: x, y: f(n, x, M) })
    }
    return [
        {
            id: 'function',
            data: data
        }
    ]

}

const Chapter = ({ allPosts }: Props) => {
    const [resolution, setResolution] = useState<number>(20);

    const [n, setN] = useState<number>(0);
    const nrange = {
        min: "0",
        max: "10",
        step: "1"
    }
    const [M, setM] = useState<number>(100);

    const [a, setA] = useState<number>(0.02);
    const [b, setB] = useState<number>(0.04);
    const [damp, setDamp] = useState<number>(0.7);
    const [omegan, setOmegan] = useState<number>(1);
    const Tp: number = PI / (omegan * sqrt(1 - damp ** 2))
    const Ts: number = 4 / (damp * omegan)
    const Tr: number = (0.8 + 2.5 * damp) / omegan
    const overshoot = exp(-(damp * PI / sqrt(1 - damp ** 2))) * 100
    const omegad = omegan * sqrt(1 - damp ** 2)
    const sigmad = damp * omegan
    const c = (t: number) => k - exp(-damp * omegan * t) * (cos(omegan * sqrt(1 - damp ** 2) * t) + (damp / sqrt(1 - damp ** 2)) * sin(omegan * sqrt(1 - damp ** 2) * t))


    // x range
    const start = 0
    const end = 15
    const step = (end - start) / resolution

    function J(n: number, x: number, M: number = 10 ** 5) {
        let term = 1 / 2 ** n / factorial(n)
        let sum = term
        // let mfac = 1
        // let nmfac = factorial(n)
        for (let m = 1; m < M; m++) {


            term *= (-1) * x ** 2 / 4 / m / (n + m)



            // let numerator = (-1) ** m * x ** (2 * m)
            // let denominator = (2 ** (2 * m + n) * mfac * nmfac)
            // if (numerator === Infinity || denominator === Infinity ) {
            //     console.log('numerator or denominator is infinity')
            //     console.log('numerator: ', numerator)
            //     console.log('denominator: ', denominator)
            //     break
            // }

            sum += term
            // console.log('term is: ', term)
            // console.log('sum is: ', sum)

            if (isNaN(sum)) {
                console.log('sum is NaN: ', sum)
                break
            }
            // if (m == 0) {
            //     continue
            // }
            // mfac *= m
            // nmfac *= m
        }
        return x ** n * sum
    }

    const Cfinal = 1
    const k = 1
    const fixed = 3;

    function handleNChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newN = Number(e.currentTarget.value)
        setN(newN)
    }

    function handleMChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newM = Number(e.currentTarget.value)
        setM(newM)
    }
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
                                <input value={resolution} onChange={(e) => setResolution(Number(e.target.value))} type="range" min="1" max="1000" step="10" className="slider" id="myRange" />
                            </div>

                            <div className="slidecontainer">
                                M {M}
                                <br />
                                <input value={M} onChange={handleMChange} className="slider" id="myRange" />
                            </div>

                            <div className="slidecontainer">
                                n {n}
                                <br />
                                <input value={n} onChange={(e) => setN(Number(e.target.value))} type="range" {...nrange} className="slider" id="myRange" />
                            </div>

                            <InlineMath math="Tp = \frac{\pi}{\omega_n \sqrt{1 - \zeta^2}} = \ " />
                            <InlineMath math={`${Tp.toFixed(fixed)}`} />
                            <br />

                        </div>
                        <div className="w-full">

                            <div className="h-64">
                                <ResponsiveLine
                                    data={generateDataFromBesselFunction(J, n, M, start, end, step)}
                                    enablePoints={false}
                                    xScale={{ type: 'linear', min: start, max: end }}
                                    yScale={{ type: 'linear', min: -2, max: 2 }}
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


                    </div>
                    <br />
                </Container>
            </Layout>
        </>
    )
}

export default Chapter

