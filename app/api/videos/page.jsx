'use client'

import Header from "@/app/components/Header.jsx"
import {mockData} from "@/mock/data.js";
import {useEffect, useState} from 'react'
import Link from "next/link"

export default function Videos() 
{
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        setVideos(mockData)
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