export default function floodFill(startY, startX, binary, visited) {
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