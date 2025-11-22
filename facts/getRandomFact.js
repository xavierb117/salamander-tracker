import {salamanderFacts} from "@/facts/facts.js"

export function getRandom() {
    const randomNum = Math.floor(Math.random() * 15)
    return randomNum
}

export function catchRandom() {
    const random = salamanderFacts[getRandom()]
    return random  
}  