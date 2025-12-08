export default function computeCentroid(pixels) {
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