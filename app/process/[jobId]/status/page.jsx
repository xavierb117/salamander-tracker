'use client'

import Header from "@/app/components/Header.jsx"
import React from "react"

export default function Status({params}) {
    const {jobId} = React.use(params)

    const [status, setStatus] = React.useState("")

    console.log(status.status)


    React.useEffect(() => {
        const interval = setInterval(async () => {
            const res = await fetch(`http://localhost:3000/process/${jobId}/status`)
            const data = await res.json();
            if (data.status === "done" || data.status === "error") {
                setStatus(data)
                clearInterval(interval)
                console.log("stopped")
            }
        }, 1000)
    }, [])

    function grabURL() {
        if (status.status !== "done") return
        const csvPath = status.result
        return `http://localhost:3000${csvPath}`
    }

    return (
        <div>
            <Header head="CSV Download" />
            {(status.status === "done") ? 
            <p className="processing">Analysis Complete! This link will hold coordinates of X and Y over each second of your video in a CSV.
            <a className="csvBlock" href={grabURL()} download="analysis.csv">CSV File</a></p> 
            : (status.status === "error") ? <p className="error">An error has occured during analysis.</p>
            : <p className="processing">Your video is currently being processed...</p>}
        </div>
    )
}