import { useState, useEffect, } from "react";
import UsersView from "./UserView";

const UserContainer = () => {
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);


    const token =JSON.parse(localStorage.getItem('token'))
    console.log("token", token)
    
    const getDataUser = async () => {
        try {
            const response = await fetch("http://localhost:5000/users",{headers: {"Authorization": `${token}`}});

            if (!response.ok) {
                console.log("Hubo un error en la consulta");
            }
            const results = await response.json();
            setData(results);
        } catch {
            console.log("Error en la API");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getDataUser();
    }, []);

    return (
        <UsersView loadingData={loadingData} data={data}/>
    );
};

export default UserContainer;
