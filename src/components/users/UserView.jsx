import React, { Fragment, useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";

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

    const ValidationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
            .max(20, 'El nombre de usuario no debe exceder los 20 caracteres')
            .required('El nombre de usuario es requerido'),
        password: Yup.string()
            .required('Este es un campo requerido')
            .min(5, 'La contraseña debe tener al menos 5 caracteres'),
        userType: Yup.string()
            .oneOf(['admin', 'visor', 'editor'], 'Debe seleccionar un tipo de usuario válido')
            .required('El tipo de usuario es requerido')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await handleEdit(values.user_id, values);
            if (response.status === 200) {
                setMessage("Usuario actualizado correctamente");
                window.location.reload();
            }
        } catch (error) {
            setMessage(error.message);
            console.error("Error al actualizar el usuario:", error);
        }
        setSubmitting(false);
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
            return response;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.Mensaje || "Error al procesar la solicitud");
            } else {
                throw new Error("Error al conectar con el servidor");
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
                <div style={{ marginTop: "1rem", color: message.includes("Error") ? "red" : "green" }}>
                    <p>{message}</p>
                </div>
            )}

            <div style={{ marginTop: "2rem" }}>
                <h2>Editar Usuario</h2>
                <Formik
                    initialValues={updatedUserData}
                    enableReinitialize
                    validationSchema={ValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div>
                                <label>Nombre de Usuario:</label>
                                <Field type="text" name="username" />
                                <ErrorMessage name="username" component="div" style={{ color: "red" }} />
                            </div>
                            <div>
                                <label>Password:</label>
                                <Field type="text" name="password" />
                                <ErrorMessage name="password" component="div" style={{ color: "red" }} />
                            </div>
                            <div>
                                <label htmlFor="userType">Tipo de Usuario:</label>
                                <Field as="select" name="userType">
                                    <option value="">Seleccione un tipo</option>
                                    <option value="admin">Administrador</option>
                                    <option value="visor">Visor</option>
                                    <option value="editor">Editor</option>
                                </Field>
                                <ErrorMessage name="userType" component="div" style={{ color: "red" }} />
                            </div>
                            <Button type="submit" label="Actualizar Usuario" className="p-button-danger" disabled={isSubmitting} />
                        </Form>
                    )}
                </Formik>
            </div>
        </Fragment>
    );
};

export default UsersView;
