import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, ErrorMessage, Formik } from 'formik';
import { Button } from 'primereact/button';
import * as Yup from 'yup';

const CreateMarca = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      alert("Debe iniciar sesión para acceder a esta página.");
      navigate("/inicio-sesion");
    }
  }, [navigate]);

  const [message, setMessage] = useState('');
  const token = JSON.parse(localStorage.getItem('token'));

  const RegisterMarca = async (values, resetForm) => {
    const bodyRegisterMarca = { nombre: values.nombre };

    try {
      const response = await fetch('http://localhost:5000/marca', {
        method: 'POST',
        body: JSON.stringify(bodyRegisterMarca),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al registrar la marca');
      }

      setMessage('Marca creada exitosamente');
      resetForm(); 
    } catch (error) {
      setMessage('Error en el registro: ' + error.message);
    }
  };

  const ValidationSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(20, 'El nombre no debe exceder los 20 caracteres')
      .required('El nombre es requerido'),
  });

  return (
    <Formik
      initialValues={{ nombre: '' }}
      validationSchema={ValidationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await RegisterMarca(values, resetForm);
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
          <h1>Crear nueva marca</h1>
          <div>
            <label htmlFor="nombre">Nombre de Marca:</label>
            <Field
              type="text"
              name="nombre"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.nombre}
            />
            <ErrorMessage name="nombre" component="div" />
          </div>
          <Button type="submit" label="Crear Marca" className="p-button-success" disabled={isSubmitting} />
          {message && <div style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>{message}</div>}
        </form>
      )}
    </Formik>
  );
};

export default CreateMarca;
