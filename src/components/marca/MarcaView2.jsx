import React, { Fragment, useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";

const MarcaView = ({ data, loadingData }) => {
    const activeMaras = data.filter((marca) => marca.activo);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [updatedMarcaData, setUpdatedMarcaData] = useState({
        nombre: "",
        marca_id: null
    });

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            alert("Debe iniciar sesión para acceder a esta página.");
            navigate("/inicio-sesion");
        }
    }, [navigate]);

    const ValidationSchema = Yup.object().shape({
        nombre: Yup.string()
            .min(3, 'El nombre de la marca debe tener al menos 3 caracteres')
            .max(255, 'El nombre de la marca no debe exceder los 255 caracteres')
            .required('El nombre de la marca es requerido'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await handleEdit(values.marca_id, values);
            if (response.status === 200) {
                setMessage("Marca actualizada correctamente");
                window.location.reload();
            }
        } catch (error) {
            setMessage(error.message);
            console.error("Error al actualizar la marca:", error);
        }
        setSubmitting(false);
    };

    const handleEdit = async (marcaId, updatedData) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const payload = { marca_id: marcaId, ...updatedData };
    
        try {
            const response = await axios.post(
                "http://127.0.0.1:5000/marca/editar",
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

    const handleDeactivate = async (marcaId) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const payload = { marca_id: marcaId };
    
        try {
            const response = await axios.post(
                "http://127.0.0.1:5000/marca/deactivate",
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

    const bodyMarcaStatus = (rowData) => {
        return rowData.activo ? <span>Activa</span> : <span>Inactiva</span>;
    };

    const bodyActions = (rowData) => {
        return (
            <div>
                <Button
                    label="Editar"
                    className="p-button-warning"
                    onClick={() => setUpdatedMarcaData({
                        marca_id: rowData.id,
                        nombre: rowData.nombre,
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
            <h1>Marcas</h1>
            {loadingData ? (
                <ProgressSpinner />
            ) : (
                <DataTable value={activeMaras} tableStyle={{ minWidth: "50rem" }}>
                    <Column field="nombre" header="Nombre" />
                    <Column body={bodyMarcaStatus} header="Estado" />
                    <Column body={bodyActions} header="Acciones" />
                </DataTable>
            )}

            {message && (
                <div style={{ marginTop: "1rem", color: message.includes("Error") ? "red" : "green" }}>
                    <p>{message}</p>
                </div>
            )}

            <div style={{ marginTop: "2rem" }}>
                <h2>Editar Marca</h2>
                <Formik
                    initialValues={updatedMarcaData}
                    enableReinitialize
                    validationSchema={ValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div>
                                <label>Nombre de Marca:</label>
                                <Field type="text" name="nombre" />
                                <ErrorMessage name="nombre" component="div" style={{ color: "red" }} />
                            </div>
                            <Button type="submit" label="Actualizar Marca" className="p-button-danger" disabled={isSubmitting} />
                        </Form>
                    )}
                </Formik>
            </div>
        </Fragment>
    );
};

export default MarcaView;
        </Fragment>
    );
};

export default MarcaView;
