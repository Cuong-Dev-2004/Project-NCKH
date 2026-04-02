import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function TourDetailLayout() {
    const { slug } = useParams();
    const [data, setData] = useState(null);


    useEffect(() => {
        const fetchTour = async () => {
            try {

                const res = await axios.get(`http://localhost:5000/api/product/${slug}`);
                setData(res.data.product);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTour();
    }, [slug]);
}
