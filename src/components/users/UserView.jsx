import React, { Fragment, useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UsersView = ({ data, loadingData }) => {
    const activeUsers = data.filter((user) => user.activo);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [updatedUserData, setUpdatedUserData] = useState({
        username: "",
        password: "",
        userType: "",
        user_id: null
    });

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            alert("Debe iniciar sesión para acceder a esta página.");
            navigate("/inicio-sesion");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            await handleEdit(updatedUserData.user_id, updatedUserData);
            setMessage("Usuario actualizado correctamente");
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    const handleEdit = async (userId, updatedData) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const payload = { user_id: userId, ...updatedData };
    
        try {
            const response = await axios.post(
                "http://127.0.0.1:5000/user/editar",
                payload,
                {
                    headers: {
                        Authorization: `${token}`, 
                        "Content-Type": "application/json",
                    },
                }
            );
    
            setMessage(response.data.Mensaje);
            window.location.reload();
        } catch (error) {
            console.error("Error en la solicitud:", error);
            if (error.response) {
                console.error("Respuesta del servidor:", error.response.data);
                setMessage(error.response.data.Mensaje);
            } else {
                setMessage("Error al conectar con el servidor");
            }
        }
    };

    const handleDeactivate = async (userId) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const payload = { user_id: userId };
    
        try {
            const response = await axios.post(
                "http://127.0.0.1:5000/user/deactivate",
                payload,
                {
                    headers: {
                        Authorization: `${token}`, 
                        "Content-Type": "application/json",
                    },
                }
            );
    
            setMessage(response.data.Mensaje);
            window.location.reload();
        } catch (error) {
            console.error("Error en la solicitud:", error);
            if (error.response) {
                console.error("Respuesta del servidor:", error.response.data);
                setMessage(error.response.data.Mensaje);
            } else {
                setMessage("Error al conectar con el servidor");
            }
        }
    };

    const bodyUserRole = (rowData) => {
        if (rowData.is_admin) return <span>Administrador</span>;
        if (rowData.is_viewer) return <span>Visor</span>;
        if (rowData.is_editor) return <span>Editor</span>;
        return <span>Sin permisos para ver Rol</span>;
    };

    const bodyActions = (rowData) => {
        return (
            <div>
                <Button
                    label="Editar"
                    className="p-button-warning"
                    onClick={() => setUpdatedUserData({
                        user_id: rowData.id,
                        username: rowData.username,
                        userType: rowData.userType || "",
                    })}
                />
                <Button
                    label="Borrar"
                    className="p-button-danger"
                    onClick={() => handleDeactivate(rowData.id)}
                />
            </div>
        );
    };

    return (
        <Fragment>
            <h1>Usuarios</h1>
            {loadingData ? (
                <ProgressSpinner />
            ) : (
                <DataTable value={activeUsers} tableStyle={{ minWidth: "50rem" }}>
                    <Column field="username" header="Nombre de usuario" />
                    <Column body={bodyUserRole} header="Rol" />
                    <Column body={bodyActions} header="Acciones" />
                </DataTable>
            )}

            {message && (
                <div style={{ marginTop: "1rem", color: "green" }}>
                    <p>{message}</p>
                </div>
            )}
            <div style={{ marginTop: "2rem" }}>
                <h2>Editar Usuario</h2>
                <div>
                    <label>Nombre de Usuario:</label>
                    <input
                        type="text"
                        name="username"
                        value={updatedUserData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="text"
                        name="password"
                        value={updatedUserData.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="userType">Tipo de Usuario:</label>
                    <select
                        name="userType"
                        value={updatedUserData.userType}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un tipo</option>
                        <option value="admin">Administrador</option>
                        <option value="visor">Visor</option>
                        <option value="editor">Editor</option>
                    </select>
                </div>
                <Button onClick={handleSubmit} label="Actualizar Usuario" className="p-button-danger" />
                {message && (
                    <div style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>
                        {message}
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default UsersView;
