import { useEffect, useState } from "react";
import '../styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate, useHistory} from "react-router-dom"; // Cambia a useNavigate
import { useSpring, animated } from 'react-spring';
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import axios from 'axios';
import logo from '../../assets/CognitiveX.png';
import backendUrl from "../../configServer";

function errorPassword() {
  Swal.fire({
    icon: 'error',
    title: 'Password erróneo',
    text: 'Las credenciales proporcionadas no coinciden para su acceso.',
    confirmButtonColor: '#4CAF50',
    confirmButtonText: 'Reintentar'
  })
}
function errorUser() {
  Swal.fire({
    icon: 'error',
    title: 'Usuario no existe',
    text: 'No hay registros de este usuario',
    confirmButtonColor: '#4CAF50',
    confirmButtonText: 'Reintentar'
  })
}
function errorServer() {
  Swal.fire({
    icon: 'error',
    title: 'Servidor no conectado',
    text: 'El backend no está en línea',
    confirmButtonColor: '#4CAF50',
    confirmButtonText: 'Reintentar'
  })
}
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Cambia a useNavigate

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: backendUrl, // Reemplaza 'backendUrl' con la URL de tu servidor
});

// Interceptor de respuesta para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 404) {
      errorUser();
    } else if (error.response.status === 401) {
      errorPassword();
    }
    else if (error.response.status === 500) {
      alert('Error de servidor');
    }
    return Promise.reject(error);
  }
);

  // Función para realizar la solicitud de autenticación
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axiosInstance.post('/api/Login', {
        Email: email,
        Password: password,
      });
  
      if (response.status === 200) {
        // El servidor ha respondido con un estado HTTP 200 (OK).
        // Puedes hacer algo con la respuesta exitosa aquí.
        
        // Accede al campo 'uid' en la respuesta JSON.
        const uid = response.data.datos.uid;
        navigate('/Home',{ state: { uid } });
        // Haz algo con 'uid', como mostrarlo en la consola.
        
  
        // Luego, puedes navegar a '/Home'.
       
      } else {
        console.error('Respuesta no válida del servidor:', response);
      }
    } catch (error) {
      console.error('Error en la solicitud de autenticación:', error);
    }
  };
  

  return (
    <div id='body'>
      <div id='contenedor_img'>
        <div id='contentHeader'></div>
      </div>

      <animated.div id="contenedor_form">
        <div id='contenedor_Menu_top'></div>
        <img src={logo} id='IconoLoginForm' preload="true" />
        <animated.h1 id="TitleLogin">INICIAR SESIÓN</animated.h1>
        <p>Bienvenido, por favor identifícate</p>
        <form onSubmit={handleSubmit}>
          <input
            id="inpt_Login"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="usuario"
            placeholder='Correo electrónico'
          />
          <input
            id="inpt_Login"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder='Contraseña'
          />
          <button type="button" onClick={handleTogglePassword} className='btnShow'>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="ico_show" /> {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          </button>
          <button className='buttonLogin'>Iniciar Sesión</button>
        </form>
      </animated.div>
    </div>
  );
}

export default Login;
