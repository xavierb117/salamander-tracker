'use client'

import {catchRandom} from "@/facts/getRandomFact.js"
import {useState, useEffect} from 'react'

export default function Facts() {
    const [randomFact, setRandomFact] = useState("")

    const interval = 10000

    useEffect(() => {
        setRandomFact(catchRandom)
        setInterval(() => {
            setRandomFact(catchRandom)
        }, interval)
    }, [])

    return (
        <div className="facts">
            <p>Salamander Fact </p>
            <p>{`${randomFact}`}</p>
        </div>
    )
}