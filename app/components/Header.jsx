import logo from "@/public/salamander-logo.jpg"

export default function Header({head}) {
    return (
        <header>
            <img src = {logo.src} alt = "Salamander Logo" />
            <h1>{head}</h1>
            <img src = {logo.src} alt = "Salamander Logo" />
        </header>
    )
}