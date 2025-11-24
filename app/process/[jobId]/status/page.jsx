'use client'

import {mockData} from "@/mock/data.js"
import Header from "@/app/components/Header.jsx"
import {useEffect, useState} from "react"

export default function Status() {
    const [link, setLink] = useState("")

    useEffect(() => {
        const {status} = mockData;
        setLink(status)
    }, [])

    return (
        <div>
            <Header head="CSV Download" />
            {link === "done" ? <p>Your file has been analyzed!</p> : <p>An error has occured</p>}
        </div>
    )
}