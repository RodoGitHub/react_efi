import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, ErrorMessage, Formik } from 'formik';
import { Button } from 'primereact/button';
import * as Yup from 'yup';

const CreateUser = () => {
  const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario está logueado
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            alert("Debe iniciar sesión para acceder a esta página.");
            navigate("/inicio-sesion"); // Redirige al usuario al login
        }
    }, [navigate]);

  const [message, setMessage] = useState(''); // Estado para almacenar el mensaje de éxito o error
  const token = JSON.parse(localStorage.getItem('token'));

  const RegisterUser = async (values, resetForm) => {
    const bodyRegisterUser = {
      usuario: values.username,
      contrasenia: values.password,
      tipo: values.userType
    };

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        body: JSON.stringify(bodyRegisterUser),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        
        },
      });
      setMessage(response.data.Mensaje);
      console.log(JSON.stringify(bodyRegisterUser))
      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }


      resetForm(); // Limpiar el formulario después de un envío exitoso
    } catch (error) {
      setMessage('Error en el registro: ' + error.message); 
    }
  };

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

  return (
    <Formik
      
      initialValues={{ username: '', password: '', userType: '' }}
      validationSchema={ValidationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await RegisterUser(values, resetForm);
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
      }) => (
        <form onSubmit={handleSubmit}>
          <h1>Crear nuevo usuario</h1>
          <div>
            <label htmlFor="username">Nombre de Usuario:</label>
            <Field
              type="text"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
            />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <Field
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <ErrorMessage name="password" component="div" />
          </div>
          <div>
            <label htmlFor="userType">Tipo de Usuario:</label>
            <Field as="select" name="userType" onChange={handleChange} onBlur={handleBlur} value={values.userType}>
              <option value="">Seleccione un tipo</option>
              <option value="admin">Administrador</option>
              <option value="visor">Visor</option>
              <option value="editor">Editor</option>
            </Field>
            <ErrorMessage name="userType" component="div" />
          </div>
          <Button type="submit" label="Crear Usuario" className="p-button-danger" disabled={isSubmitting} />
          {/* Mostrar mensaje de éxito o error */}
          {message && <div style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>{message}</div>}
        </form>
      )}
    </Formik>
  );
};

export default CreateUser;
