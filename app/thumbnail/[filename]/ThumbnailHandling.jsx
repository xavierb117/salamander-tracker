'use client'

import { useEffect, useState } from "react"
import Header from "@/app/components/Header.jsx"
import { useRouter } from "next/navigation"
import binarizeImage from "@/binarize/binarizer.js"
import findConnectedGroups from "@/binarize/findGroup.js"
import computeCentroid from "@/binarize/centroid.js"


export default function ThumbnailHandling({ filename }) {

    const router = useRouter();
    const [imgURL, setImgURL] = useState(null);
    const [color, setColor] = useState("000000");
    const [range, setRange] = useState("60");
    const [loadedImg, setLoadedImg] = useState(null);

    useEffect(() => {
        async function load() {
            const res = await fetch(`http://localhost:3000/thumbnail/${filename}`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setImgURL(url);

            const img = new Image();
            img.src = url;
            img.onload = () => {
                setLoadedImg(img);
                const canvas = document.getElementById("originalCanvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);
            };
        }

        load();
    }, [filename]);

    useEffect(() => {
        if (!imgURL) return;
        
        const oCanvas = document.getElementById("originalCanvas");
        const bCanvas = document.getElementById("binaryCanvas");

        if (!oCanvas || !bCanvas) return;

        const octx = oCanvas.getContext("2d");
        const bctx = bCanvas.getContext("2d");

        const imageData = octx.getImageData(0, 0, oCanvas.width, oCanvas.height);

        const targetInt = parseInt(color, 16);
        const binary = binarizeImage(imageData, targetInt, range);

        // Draw binary preview
        const output = bctx.createImageData(oCanvas.width, oCanvas.height);
        let i = 0;

        for (let y = 0; y < oCanvas.height; y++) {
            for (let x = 0; x < oCanvas.width; x++) {
                const v = binary[y][x] === 1 ? 255 : 0;

                output.data[i++] = v;
                output.data[i++] = v;
                output.data[i++] = v;
                output.data[i++] = 255;
            }
        }

        bCanvas.width = oCanvas.width;
        bCanvas.height = oCanvas.height;

        bctx.putImageData(output, 0, 0);

        // Compute centroid
        const groups = findConnectedGroups(binary);
        if (groups.length === 0) return;

        const largest = groups.sort((a, b) => b.length - a.length)[0];
        const centroid = computeCentroid(largest);

        // Draw centroid dot
        bctx.fillStyle = "lime";
        bctx.beginPath();
        bctx.arc(centroid.x, centroid.y, 10, 0, Math.PI * 2);
        bctx.fill();

        // Draw centroid on ORIGINAL image
        const octx2 = oCanvas.getContext("2d");

        octx2.clearRect(0, 0, oCanvas.width, oCanvas.height);

        if (loadedImg) {
            octx2.drawImage(loadedImg, 0, 0);
        }
        
        octx2.fillStyle = "lime";
        octx2.beginPath();
        octx2.arc(centroid.x, centroid.y, 10, 0, Math.PI * 2);
        octx2.fill();

    }, [loadedImg, color, range]);

    function changeColor(e) {
        const hex = e.target.value.slice(1);
        setColor(hex);
    }

    function changeRange(e) {
        if (e.target.value < 0 || e.target.value > 255) {
            return
        }
        setRange(Number(e.target.value).toString())
    }

    // Research on useRouter from next.js docs helped achieve this
    const handleClick = async () => {
        console.log(color)
        console.log(range)
        const res = await fetch(
            `http://localhost:3000/process/${filename}?targetColor=${color}&threshold=${range}`
        );
        const resBody = await res.json();
        router.push(`/process/${resBody.jobId}/status`);
    };

    return (
        <div>
            <Header head={`Thumbnail: ${filename}`} />

            <div className="content">
                <p><u>Images:</u> The image on the left is a thumbnail. The image on the right is the converted version.</p>
                <p><u>Center Dot:</u> Tracks the centroid of the largest mass.</p>
                <p><u>Color Selection:</u> Determines which pixels count as a match.</p>
                <p><u>Threshold:</u> Controls how strict the matching is.</p>
            </div>

            <div className="analysis">
                <div className="selections">
                    <label>
                        Select your color: 
                        <input type="color" onChange={changeColor} />
                    </label>

                    <label>
                        Select your threshold:
                        <input type="range" min="0" max="255"
                            value={range}
                            onChange={changeRange} />
                        <span className="thresholdValue">{range}</span>
                    </label>

                    <label>
                        Input Threshold (Alternate Method)
                        <input type="number" min="0" max="255" value={range} onChange={changeRange}/>
                    </label>

                    <button onClick={handleClick}>Process Video with These Settings</button>
                </div>

                <div className="imageAnalysis">
                    {imgURL ? (
                        <>
                            <canvas id="originalCanvas" width="400"></canvas>
                            <canvas id="binaryCanvas" width="400"></canvas>
                        </>
                    ) : (
                        <p>Loading thumbnail...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
