import colorDistance from "./colorDistance.js"

export default function binarizeImage(imageData, targetColor, threshold) {
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