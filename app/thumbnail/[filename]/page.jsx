import React from "react"
import ThumbnailHandling from "./ThumbnailHandling"

export default function ThumbnailPage({params}) {
    const { filename } = React.use(params);

    return (
        <div>
            <ThumbnailHandling filename={filename}/>
        </div>
    )
}
