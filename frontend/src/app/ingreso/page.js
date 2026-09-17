
"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

export default function Page() {
    // Estado para decidir si mostramos Login o Registro
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    // Estados del Login
    const [valInputMail, setValInputMail] = useState("");
    const [valInputContraseña, setValInputContraseña] = useState("");

    // Estados del Registro
    const [valInputUser, setValInputUser] = useState("");
    const [valInputFoto, setValInputFoto] = useState("");

    // LOGIN
    function leerValInputMail(event) {
        setValInputMail(event.target.value);
    }

    function leerValInputContraseña(event) {
        setValInputContraseña(event.target.value);
    }

    const login = () => {

        const respuesta = {
            email: valInputMail,
            password: valInputContraseña,
        };

        fetch("http://localhost:4000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(respuesta)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Respuesta del login:", data);
            });
    };


    // REGISTRO
    function leerValInputUser(event) {
        setValInputUser(event.target.value);
    }

    function leerValInputFoto(event) {
        setValInputFoto(event.target.value);
    }

    const registrarse = () => {

        const respuesta = {
            nombre: valInputUser,
            email: valInputMail,
            password: valInputContraseña,
            imagen: valInputFoto
        };

        fetch("http://localhost:4000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(respuesta)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Registro creado:", data);
            });
    };


    return (
        <>
            {!mostrarRegistro ? (

                // =========================
                // LOGIN
                // =========================

                <>
                    <h1>
                        Bienvenido! Esta es la página de Inicio de Sesión.
                    </h1>

                    <h2>
                        Ingrese sus datos
                    </h2>

                    <Input
                        type="email"
                        text="Mail"
                        ph="Ingrese el mail"
                        onChange={leerValInputMail}
                        value={valInputMail}
                    />

                    <Input
                        type="password"
                        text="Contraseña"
                        ph="Ingrese la contraseña"
                        onChange={leerValInputContraseña}
                        value={valInputContraseña}
                    />

                    <Button
                        text="Iniciar Sesión"
                        onClick={login}
                    />

                    <Button
                        text="Registrarse"
                        onClick={() => setMostrarRegistro(true)}
                    />
                </>

            ) : (

                // =========================
                // REGISTRO
                // =========================

                <>
                    <h1>
                        PÁGINA DE REGISTRO
                    </h1>

                    <h2>
                        Esta es la página de registro. Ingresa tus datos
                    </h2>

                    <Input
                        text="Usuario"
                        ph="Escribir el usuario"
                        value={valInputUser}
                        onChange={leerValInputUser}
                    />

                    <Input
                        type="email"
                        text="Mail"
                        ph="Escribir el mail"
                        value={valInputMail}
                        onChange={leerValInputMail}
                    />

                    <Input
                        type="password"
                        text="Contraseña"
                        ph="Escribir la contraseña"
                        value={valInputContraseña}
                        onChange={leerValInputContraseña}
                    />

                    <Input
                        text="Foto"
                        ph="Ingresar foto"
                        value={valInputFoto}
                        onChange={leerValInputFoto}
                    />

                    <Button
                        text="Registrarse"
                        onClick={registrarse}
                    />

                    <Button
                        text="Iniciar Sesión"
                        onClick={() => setMostrarRegistro(false)}
                    />
                </>
            )}
        </>
    );
}
