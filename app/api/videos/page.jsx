'use client'

import Header from "@/app/components/Header.jsx"
import {useEffect, useState} from 'react'
import Link from "next/link"

export default function Videos() 
{
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        async function load()
        {
            const res = await fetch("http://localhost:3000/api/videos")
            const data = await res.json();
            setVideos(data)
        }
        load()
    }, [])

    const items = videos.map((item) => (
        <Link key = {item} href = {`/thumbnail/${item}`}>{item}</Link>
    ))

    return (
        <div>
            <Header head="List of Videos"/>
            <div className = "videoLinks">
                {items}
            </div>
        </div>
    )
}