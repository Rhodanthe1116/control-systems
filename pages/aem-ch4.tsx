import Container from '../components/container'
import Intro from '../components/intro'
import Layout from '../components/layout'
import Head from 'next/head'
import Post from '../types/post'
import { useState } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { ScatterPlot } from '@nivo/scatterplot'
import cn from 'classnames'
import 'katex/dist/katex.min.css';
import markdownStyles from '../components/markdown-styles.module.css'
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

const Chapter = ({ allPosts }: Props) => {
    const [a, setA] = useState<number>(0.02);
    const [b, setB] = useState<number>(0.04);
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

    const Cfinal = 1
    const k = 1
    const fixed = 3;

    function handleAChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newA = Number(e.currentTarget.value)
        setA(newA)
        setDamp(newA / (2 * sqrt(b)))
    }

    function handleBChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newB = Number(e.currentTarget.value)
        setB(newB)
        setOmegan(sqrt(newB))
        setDamp(a / (2 * sqrt(newB)))
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
                                <input value={resolution} onChange={(e) => setResolution(Number(e.target.value))} className="slider" id="myRange" />
                            </div>
                            <div className="slidecontainer">
                                a {a}
                                <br />
                                <input value={a} onChange={handleAChange} className="slider" id="myRange" />
                            </div>
                            <div className="slidecontainer">
                                b {b}
                                <br />
                                <input value={b} onChange={handleBChange} className="slider" id="myRange" />
                            </div>
                            <div className="slidecontainer">
                                Natural Frequency Omegan {omegan}, 越大反應時間越短
                        <br />
                                <input value={omegan} onChange={(e) => setOmegan(Number(e.target.value))} type="range" min="0" max="5" step="0.1" className="slider" id="myRange" />
                            </div>
                            <div className="slidecontainer">
                                Damping ratio {damp}, 越大overshoot越小
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
                            <InlineMath math=" Tr = \frac{0.8 + 2.5 * \zeta}  {\omega_n} = \ " />
                            <InlineMath math={`${Tr.toFixed(fixed)}`} />
                            <br />
                            
                        </div>
                        <div className="w-full">

                            <div className="h-64">
                                <ScatterPlot
                                    data={[
                                        {
                                            id: '1',
                                            data: [
                                                { x: -sigmad, y: omegad }
                                            ]
                                        }
                                    ]}
                                    width={250}
                                    height={250}
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
                        <BlockMath math="y'' + \frac{c}{m}y' + \frac{k}{m}y = 0" />
                        <BlockMath math={String.raw`\begin{bmatrix}
                                            y_1' \\ 
                                            y_2' 
                                            \end{bmatrix}
                                            = 
                                            \begin{bmatrix}
                                            0 & 1 \\ 
                                            -\frac{k}{m} & -\frac{c}{m}   
                                            \end{bmatrix}
                                            \begin{bmatrix}
                                            y_1 \\ 
                                            y_2 
                                            \end{bmatrix}
                                            `} />
                        <BlockMath math="p = a_{11} + a_{22} = -\frac{c}{m}" />
                        <BlockMath math="q = det(A) = \frac{k}{m}" />
                        <BlockMath math="\Delta = p^2 - 4q = \frac{c^2}{m^2} - \frac{4k}{m}
                                                    = \frac{c^2 - 4mk}{m^2}" />

                        <h3>No Damping: <InlineMath math="c = 0" /> </h3>
                        <BlockMath math="p = 0" />
                        <BlockMath math="q = \frac{k}{m} > 0" />
                        <BlockMath math="\Delta = -\frac{4k}{m} < 0" />
                        <p>Center.</p>

                        <h3>Under Damping: <InlineMath math="c^2 < 4mk" /> </h3>
                        <BlockMath math="p = -\frac{c}{m} < 0" />
                        <BlockMath math="q = \frac{k}{m} > 0" />
                        <BlockMath math="\Delta = -\frac{c^2 - 4mk}{m^2} < 0" />
                        <p>Stable spiral.</p>

                        <h3>Critical Damping: <InlineMath math="c^2 = 4mk" /> </h3>
                        <BlockMath math="p = -\frac{c}{m} < 0" />
                        <BlockMath math="q = \frac{k}{m} > 0" />
                        <BlockMath math="\Delta = 0" />
                        <p>Stable degenerated node.</p>

                        <h3>Over Damping: <InlineMath math="c^2 > 4mk " /> </h3>
                        <BlockMath math="p = -\frac{c}{m} < 0" />
                        <BlockMath math="q = \frac{k}{m} > 0" />
                        <BlockMath math="\Delta = -\frac{c^2 - 4mk}{m^2} > 0" />
                        <p>Stable spiral.</p>

                    </div>
                    <br />
                </Container>
            </Layout>
        </>
    )
}

export default Chapter

