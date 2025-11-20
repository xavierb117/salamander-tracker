import Header from "@/app/components/Header.jsx"
import {mockData} from "../../../mock/data.js";

export default function Videos() 
{

    function VideoChooser() 
    {
        const [videos, setVideos] = useState([]);

    useEffect(() => 
    {
        const fetchVideos = async () => {
            try {
                const res = await fetch(mockData);
                const data = await res.json();
                setVideos(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchVideos();
    }, [])};


    return (
        <div>
            <Header head={}/>
        </div>
    )
}