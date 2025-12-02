import logo from "@/public/salamander-logo.jpg"
import Link from "next/link"

export default function Header({head}) {
    return (
        <header>
            <img src = {logo.src} alt = "Salamander Logo" />

            <div className="homeHeading">
                <h1>{head}</h1>
                <Link className = "homeLink" href="/">Go Home</Link>
            </div>

            <img src = {logo.src} alt = "Salamander Logo" />
        </header>
    )
}