import logo from "@/public/salamander-logo.jpg"
import Link from "next/link"

export default function Header({head}) {
    return (
        <header>
            <img src = {logo.src} alt = "Salamander Logo" />
            <h1>{head}</h1>
            <Link href="/">Go Home</Link>
            <img src = {logo.src} alt = "Salamander Logo" />
        </header>
    )
}