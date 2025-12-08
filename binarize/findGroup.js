import floodFill from "./floodFill.js"

export default function findConnectedGroups(binary) {
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