"use client";
import Button from "../components/Button";
import Input from "../components/Input";
import { useState } from "react";


export default function LoginPage() {
    const [valInputMail, setValInputMail] = useState("")
    const [valInputContraseña, setValInputContraseña] = useState("")

    function leerValInputMail(event) {
        setValInputMail(event.target.value);

    }
    function leerValInputContraseña(event) {
        setValInputContraseña(event.target.value);

    }

    const login = () => {
        const respuesta = { //se crea un objeto con los datos del nuevo estudiante
            email: valInputMail,
            password: valInputContraseña,
        };
        fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(respuesta)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del login:', data); //se muestra en consola la respuesta del backend
            });
    };

    return (
        <>
            <h1>
                Bienvenido! Esta es la pagina de Inicio de Sesion.
            </h1>
            <h2>
                Ingrese sus datos
            </h2>
            <Input
                type="email"
                text="Mail"
                ph="Ingrese el mail"
                onChange={leerValInputMail}
                value={valInputMail} >
            </Input>

            <Input
                type="password"
                text="Contraseña"
                ph="Ingrese la contraseña"
                onChange={leerValInputContraseña}
                value={valInputContraseña} >
            </Input>

            <Button 
            text="Iniciar Sesion"
            onClick={login}>
            </Button>
        </>
    )







}