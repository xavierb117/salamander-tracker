'use client'

import { useEffect, useState } from "react"
import Header from "@/app/components/Header.jsx"

export default function ThumbnailHandling({filename}) {
    const [imgURL, setImgURL] = useState(null)
    
    useEffect(() => {
        async function load() {
            const res = await fetch(`http://localhost:3000/thumbnail/${filename}`)
            const blob = await res.blob()
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