"use client";

import Header from "@/app/components/Header.jsx"
import {mockData} from "../../mock/data.js";
import { useState, useEffect } from "react"

function VideoChooser() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setVideos(mockData);
  }, []);

  return (
    <div>
      <Header head={videos.map(x => <p key={x}>{x}</p>)} />
    </div>
  );
}

export default function Videos() {
  return (
    <div>
      <Header head="Videos" />
      <VideoChooser />
    </div>
  );
}
