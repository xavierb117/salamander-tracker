'use client'

import { useEffect, useState } from "react"
import Header from "@/app/components/Header.jsx"
import {useRouter} from "next/navigation"; // RESEARCHED TO HELP WITH POST REQUEST

export default function ThumbnailHandling({filename}) {
    const router = useRouter();

    const [imgURL, setImgURL] = useState(null)
    const [color, setColor] = useState("000000")
    const [range, setRange] = useState(0)
    
    useEffect(() => {
        async function load() {
            const res = await fetch(`http://localhost:3000/thumbnail/${filename}`)
            const blob = await res.blob()
            setImgURL(URL.createObjectURL(blob))
        }

        load()
    }, [filename])

    function changeColor(hex) {
        const trueHex = hex.target.value.slice(1)
        setColor(trueHex)
    }

    const handleClick = async() => {
        const res = await fetch(`http://localhost:3000/process/${filename}?targetColor=${color}&threshold=${range}`)
        const resBody = await res.json()
        router.push(`/process/${resBody.jobId}/status`)
    } 

    return (
        <div>
            <Header head={`Thumbnail: ${filename}`}/>
            <div className="content">
                <p><u>Images:</u> The image on the left is a thumbnail of your chosen video. The image on the right is the converted version for analysis.</p>
                <p><u>Center Dot:</u> The dot on the right will track the center of the largest mass for the CSV, which updates live based on your options. The coordiantes of this dot gets recorded over time in the CSV.</p>
                <p><u>Color Selection:</u> The color you choose will affect the image on the right. The closer it resembles the color of the thumbnail, the better it will be converted.</p>
                <p><u>Threshold:</u> The tolerance level that you want for your color. A high threshold can tolerate slightly different colors, a low threshold will not accept any other colors.</p>
            </div>
            <div className="analysis">
                <div className="selections">
                    <label>
                        Select your favorite color: <input type="color" onChange={(e) => changeColor(e)}/>
                    </label>
                    <label>
                        Select your threshold: <input type="range" min="0" max="255" onChange={(e) => setRange(Number(e.target.value))}/>
                    </label>
                    <button onClick={handleClick}>Process Video with These Settings</button>
                </div>
                <div className="imageAnalysis">
                    {imgURL ? (
                        <img src={imgURL} width={400} />
                    ) : (
                        <p>Loading thumbnail...</p>
                    )}
                </div>
            </div>
        </div>
    )
}