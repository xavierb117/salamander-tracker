'use client'

import { useEffect, useState } from "react"
import Header from "@/app/components/Header.jsx"
import { useRouter } from "next/navigation"

// ---------------------------------------------------------
// COLOR DISTANCE
// ---------------------------------------------------------
function colorDistance(c1, c2) {
    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;

    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;

    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

// ---------------------------------------------------------
// BINARIZER
// ---------------------------------------------------------
function binarizeImage(imageData, targetColor, threshold) {
    const { data, width, height } = imageData;
    const binary = Array.from({ length: height }, () => Array(width).fill(0));

    let i = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const rgb = (r << 16) | (g << 8) | b;
            const dist = colorDistance(targetColor, rgb);

            binary[y][x] = dist < threshold ? 1 : 0;

            i += 4;
        }
    }

    return binary;
}

// ---------------------------------------------------------
// ITERATIVE FLOOD-FILL 
// ---------------------------------------------------------
    function floodFill(startY, startX, binary, visited) {
        const h = binary.length;
        const w = binary[0].length;

        const stack = [[startY, startX]];
        const pixels = [];

        while (stack.length > 0) {
            const [y, x] = stack.pop();

            if (y < 0 || x < 0 || y >= h || x >= w) continue;
            if (visited[y][x]) continue;
            if (binary[y][x] === 0) continue;

            visited[y][x] = true;
            pixels.push([x, y]);

            stack.push([y + 1, x]);
            stack.push([y - 1, x]);
            stack.push([y, x + 1]);
            stack.push([y, x - 1]);
        }

        return pixels;
    }

// ---------------------------------------------------------
// GROUP FINDER
// ---------------------------------------------------------
    function findConnectedGroups(binary) {
        const h = binary.length;
        const w = binary[0].length;

        const visited = Array.from({ length: h }, () => Array(w).fill(false));
        const groups = [];

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (binary[y][x] === 1 && !visited[y][x]) {
                    const group = floodFill(y, x, binary, visited);
                    groups.push(group);
                }
            }
        }

        return groups;
    }

// ---------------------------------------------------------
// CENTROID
// ---------------------------------------------------------
    function computeCentroid(pixels) {
        let sx = 0, sy = 0;
        for (const [x, y] of pixels) {
            sx += x;
            sy += y;
        }
        return {
            x: sx / pixels.length,
            y: sy / pixels.length
        };
    }

// ---------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------
    export default function ThumbnailHandling({ filename }) {

        const router = useRouter();
        const [imgURL, setImgURL] = useState(null);
        const [color, setColor] = useState("000000");
        const [range, setRange] = useState(60);   // safer default threshold
        const [loadedImg, setLoadedImg] = useState(null);


// ---------------------------------------------------------
// LOAD IMAGE → DRAW TO ORIGINAL CANVAS
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// LIVE UPDATE: BINARIZE + CENTROID
// ---------------------------------------------------------
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
            // ---- FIX STARTS HERE ----
            // Draw centroid on ORIGINAL image
            const octx2 = oCanvas.getContext("2d");

            // Clear original
            octx2.clearRect(0, 0, oCanvas.width, oCanvas.height);

            // Redraw original image (REAL FIX)
            if (loadedImg) {
                octx2.drawImage(loadedImg, 0, 0);
            }
            octx2.fillStyle = "lime";
            octx2.beginPath();
            octx2.arc(centroid.x, centroid.y, 10, 0, Math.PI * 2);
            octx2.fill();

        }, [imgURL, color, range]);

        function changeColor(e) {
            const hex = e.target.value.slice(1);
            setColor(hex);
        }

        function changeRange(e) {
            if (e.target.value < 0 || e.target.value > 255) {
                return
            }
            setRange(Number(e.target.value))
        }

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
                            Select your favorite color: 
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
