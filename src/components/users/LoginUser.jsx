import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, ErrorMessage } from 'formik';
import { Button } from 'primereact/button';
import * as Yup from 'yup';

const LoginUser = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Hook para redirigir

    const onLoginUser = async (values, resetForm) => {
        const bodyLoginUser = btoa(`${values.username}:${values.password}`);
        
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${bodyLoginUser}`
                }
            });
            
            if (response.data.Token) {
                localStorage.setItem('token', JSON.stringify(response.data.Token));
                localStorage.setItem('username', values.username); // Guardar el nombre de usuario

                setMessage("Login exitoso");
                resetForm(); // Limpiar formulario después del login
                
                navigate('/bienvenida'); // Redirigir a la pantalla de bienvenida
            } else {
                setMessage("Login fallido: " + response.data.Mensaje);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage("Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.");
            } else {
                setMessage("Ocurrió un error: " + error.message);
            }
        }
    };

    const ValidationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Este es un campo requerido')
            .min(5, 'La contraseña debe tener al menos 5 caracteres'),
        username: Yup.string()
            .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
            .max(20, 'El nombre de usuario no debe exceder los 20 caracteres')
            .required('El nombre de usuario es requerido'),
    });

    return (
        <Formik
            initialValues={{ password: '', username: '' }}
            validationSchema={ValidationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                onLoginUser(values, resetForm);
                setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid
            }) => (
                <form onSubmit={handleSubmit}>
                    <h1>Inicio Sesión</h1>
                    <div>
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            placeholder="Nombre de usuario"
                        />
                        {errors.username && touched.username && (
                            <div style={{ color: 'red' }}>{errors.username}</div>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            placeholder="Contraseña"
                        />
                        {errors.password && touched.password && (
                            <div style={{ color: 'red' }}>{errors.password}</div>
                        )}
                    </div>
                    
                    <Button type="submit" label="Iniciar sesión" className="p-button-danger" disabled={isSubmitting || !isValid} />
                    {message && <div style={{ marginTop: '10px', color: message.includes("Error") ? "red" : "green" }}>{message}</div>}
                </form>
            )}
        </Formik>
    );
};

export default LoginUser;
