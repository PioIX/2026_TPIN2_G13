"use client"

import Input from "./components/Input"
import Button from "./components/Button"
import { useState } from "react"

export default function RegistroPage() {

    const [valInputUser, setValInputUser] = useState("")
    const [valInputMail, setValInputMail] = useState("")
    const [valInputContraseña, setValInputContraseña] = useState("")
    const [valInputFoto, setValInputFoto] = useState("")

    function leerValInputUser(event) {
        setValInputUser(event.target.value)
        console.log("ESTE INPUT DICE: " + event.target.value)
    }

    function leerValInputMail(event) {
        setValInputMail(event.target.value)
        console.log("ESTE INPUT DICE: " + event.target.value)
    }

    function leerValContraseña(event) {
        setValInputContraseña(event.target.value)
        console.log("ESTE INPUT DICE: " + event.target.value)
    }

    function leerValInputFoto(event) {
        setValInputFoto(event.target.value)
    }

    //
    const registrarse = () => {
    const respuesta = { //se crea un objeto con los datos del nuevo estudiante
        nombre: valInputUser,
        email: valInputMail,
        password: valInputContraseña,
        imagen: valInputFoto 
    };
    fetch('http://localhost:4000/register', { //se hace la peticion al backend para crear un nuevo estudiante
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(respuesta)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Registro creado:', data); //se muestra en consola la respuesta del backend
        });
};



    return (
        <>
            <h1>PAGINA DE REGISTRO</h1>

            <h2>Esta es la pagina de registro. Ingresa tus datos</h2>

            <Input
                text="Usuario"
                ph="Escribir el usuario"
                value={valInputUser}
                onChange={leerValInputUser}
            ></Input>

            <Input
                type="email"
                text="Mail"
                ph="Escribir el mail"
                value={valInputMail}
                onChange={leerValInputMail}
            ></Input>

            <Input
                type="password"
                text="Contraseña"
                ph="Escribir la contraseña"
                value={valInputContraseña}
                onChange={leerValContraseña}
            ></Input>

            <Input
                text="Foto"
                ph="Ingresar foto"
                value={valInputFoto}
                onChange={leerValInputFoto}
            ></Input>

            <Button
                text="Registrarse"
                onClick={registrarse}
            ></Button>
        </>
    )
}