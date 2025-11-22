import Link from "next/link"
import Header from "@/app/components/Header.jsx"

export default function Home() {
  return (
    <div className = "homePage">
      <Header head="Welcome to the Salamander Tracker!"/>
        <p>Here, you can track the movements of your salamander which get recorded in a CSV file! Here's what you do:</p>
        <p>1. Click on the button below to fetch all your videos</p>
        <p>2. Select a video of your choice.</p>
        <p>3. Choose your desired color and color threshold tolerance. This will update your black and white image with a center dot for tracking!</p>
        <p>4. Your results will be recorded in a link for a CSV!</p>
      <Link href = "/api/videos"><button>Fetch All Videos</button></Link>
    </div>
  );
}
