"use client";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useState } from "react";
import ChatList from "@/components/ChatList";
import Chat from "@/components/Chat";

export default function Page() {

    const [chats, setChats] = useState([]);
    const [emailNuevoChat, setEmailNuevoChat] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [errorNuevoChat, setErrorNuevoChat] = useState("");

    //estados para los grupos
    const [nombreNuevoGrupo, setNombreNuevoGrupo] = useState("");
    const [emailsNuevoGrupo, setEmailsNuevoGrupo] = useState("");
    const [fotoNuevoGrupo, setFotoNuevoGrupo] = useState("");
    const [errorNuevoGrupo, setErrorNuevoGrupo] = useState("");
    const [chatSeleccionado, setChatSeleccionado] = useState(null);


    function leerEmailNuevoChat(event) {
        setEmailNuevoChat(event.target.value)
    }

    function leerNombreNuevoGrupo(event) {
        setNombreNuevoGrupo(event.target.value);
    }

    function leerEmailsNuevoGrupo(event) {
        setEmailsNuevoGrupo(event.target.value);
    }

    function leerFotoNuevoGrupo(event) {
        setFotoNuevoGrupo(event.target.value);
    }

    useEffect(() => {

        fetch("http://localhost:4000/usuario", {
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Usuario no logueado");
                }

                return response.json();
            })
            .then(usuario => {
                setUsuario(usuario)

                return fetch(`http://localhost:4000/chats/${usuario.id_usuario}`, {
                    credentials: "include"
                });
            })
            .then(response => response.json())
            .then(data => {
                console.log("Chats recibidos:", data);
                setChats(data);
            })
            .catch(error => {
                console.log(error);
            });

    }, []);

    const crearChat = () => {

        console.log("ENTRÓ A CREAR CHAT");
        console.log("Usuario:", usuario);
        console.log("Email:", emailNuevoChat);

        const nuevoChat = {
            id_usuario: usuario.id_usuario,
            email: emailNuevoChat,
        };

        fetch("http://localhost:4000/chats/individual", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(nuevoChat)
        })
            .then(response => {
                console.log("Respuesta crear chat:", response.status);

                return response.json().then(data => {       //esto es para poder leer el error que devuelve el backend
                    if (!response.ok) {
                        throw new Error(data.error);        //throw new Error(data.error) para que se vaya al catch y no siga ejecutando el código
                    }

                    return data;
                });
            })
            .then(data => {
                console.log("Chat creado:", data);

                return fetch(`http://localhost:4000/chats/${usuario.id_usuario}`, {
                    credentials: "include"
                });
            })
            .then(response => {
                console.log("Respuesta chats:", response.status);
                return response.json();
            })
            .then(data => {
                console.log("Chats actualizados:", data);
                setChats(data);
            })
            .catch(error => {
                console.log("ERROR:", error);
                setErrorNuevoChat(error.message);           //seteo el error al estado para mostrarlo en el popup
            });


    };

    const crearGrupo = () => {

        if (!usuario) {
            setErrorNuevoGrupo("No se pudo obtener el usuario logueado.");
            return;
        }

        setErrorNuevoGrupo("");

        // Convertimos el texto de mails en un array
        const emails = emailsNuevoGrupo
            .split(",")
            .map(email => email.trim())
            .filter(email => email !== "");

        const nuevoGrupo = {
            id_usuario: usuario.id_usuario,
            emails: emails,
            nombre: nombreNuevoGrupo,
            foto: fotoNuevoGrupo
        };

        fetch("http://localhost:4000/chats/grupal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(nuevoGrupo)
        })
            .then(response => {

                return response.json().then(data => {

                    if (!response.ok) {
                        throw new Error(data.error);
                    }

                    return data;
                });
            })
            .then(data => {

                console.log("Grupo creado:", data);

                return fetch(`http://localhost:4000/chats/${usuario.id_usuario}`, {
                    credentials: "include"
                });
            })
            .then(response => response.json())
            .then(data => {

                console.log("Chats actualizados:", data);

                setChats(data);

                // Limpiamos los campos
                setNombreNuevoGrupo("");
                setEmailsNuevoGrupo("");
                setFotoNuevoGrupo("");
            })
            .catch(error => {

                console.log("ERROR:", error);

                setErrorNuevoGrupo(error.message);
            });
    };

    return (
        <>
            <h1>Chat</h1>

            <Popup
                trigger={<button>Nuevo chat</button>} modal
            >
                <div>
                    <h2>Nuevo chat</h2>

                    <input
                        type="email"
                        placeholder="Email del usuario"
                        value={emailNuevoChat}
                        onChange={leerEmailNuevoChat}
                    />



                    {errorNuevoChat && (
                        <p>{errorNuevoChat}</p>
                    )}

                    <button onClick={crearChat}>Crear chat</button>
                </div>
            </Popup>

            <Popup
                trigger={<button>Nuevo grupo</button>}
                modal
            >
                <div>

                    <h2>Nuevo grupo</h2>

                    <input
                        type="text"
                        placeholder="Nombre del grupo"
                        value={nombreNuevoGrupo}
                        onChange={leerNombreNuevoGrupo}
                    />

                    <textarea
                        placeholder="Emails separados por comas"
                        value={emailsNuevoGrupo}
                        onChange={leerEmailsNuevoGrupo}
                    />

                    <input
                        type="text"
                        placeholder="Foto del grupo"
                        value={fotoNuevoGrupo}
                        onChange={leerFotoNuevoGrupo}
                    />

                    {errorNuevoGrupo && (
                        <p>{errorNuevoGrupo}</p>
                    )}

                    <button onClick={crearGrupo}>
                        Crear grupo
                    </button>

                </div>
            </Popup>

            <ChatList
                chats={chats}
                onSeleccionarChat={setChatSeleccionado}
            />

            <Chat
                chat={chatSeleccionado}
                usuario={usuario}
            />



        </>
    );
}