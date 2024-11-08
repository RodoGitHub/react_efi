import React from "react";
import MarcaView from "./MarcaView";
import { useState, useEffect } from "react";
import axios from "axios";

const MarcaContainer = () => {
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("token"));
                const response = await axios.get("http://127.0.0.1:5000/marca", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching marcas:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchMarcas();
    }, []);

    return <MarcaView data={data} loadingData={loadingData} />;
};

export default MarcaContainer;
