'use client'

import { useEffect, useState } from "react"
import Header from "@/app/components/Header.jsx"
import Link from "next/link"

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
            <p>Images: The image on the left is a thumbnail of your chosen video. The image on the right is the converted version for analysis.</p>
            <p>Center Dot: The dot on the right will track the center of the largest mass for the CSV, which updates live based on your options. The coordiantes of this dot gets recorded over time in the CSV.</p>
            <p>Color Selection: The color you choose will affect the image on the right. The closer it resembles the color of the thumbnail, the better it will be converted.</p>
            <p>Threshold: The tolerance level that you want for your color. A high threshold can tolerate slightly different colors, a low threshold will not accept any other colors.</p>
            <label htmlFor="favcolor">Select your favorite color:</label>
            <input type="color" id="favcolor"/>
            <label htmlFor="slider">Select your threshold:</label>
            <input type="range" min="1" max="255" id="slider" />
            <Link href="/process/8d52422d-2a92-46b7-ab3a-d906903a73f1/status"><button>Analyze</button></Link>
            {imgURL ? (
                <img src={imgURL} width={400} />
            ) : (
                <p>Loading thumbnail...</p>
            )}
        </div>
    )
}