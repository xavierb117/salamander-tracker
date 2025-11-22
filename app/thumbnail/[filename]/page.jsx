'use client'

import Header from "@/app/components/Header.jsx"
import { useEffect, useState } from "react"
import React from "react";

export default function ThumbnailPage(props) {
    const { filename } = React.use(props.params)
    const [imgURL, setImgURL] = useState(null)

    useEffect(() => {
        async function load() {
            // fetch the frame from backend
            const res = await fetch(`http://localhost:3000/thumbnail/${filename}`)
            const blob = await res.blob()

            // turn it into a usable img src
            setImgURL(URL.createObjectURL(blob))
        }

        load()
    }, [filename])

    return (
        <div>
            <Header head={`Thumbnail: ${filename}`}/>

            {imgURL ? (
                <img src={imgURL} width={400} />
            ) : (
                <p>Loading thumbnail...</p>
            )}
        </div>
    )
}
