"use client";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useState } from "react";
import ChatList from "@/components/ChatList";

export default function Page() {

    const [chats, setChats] = useState([]);
    const [emailNuevoChat, setEmailNuevoChat] = useState("");
    const [usuario, setUsuario] = useState(null);


    function leerEmailNuevoChat(event) {
        setEmailNuevoChat(event.target.value)
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
                return response.json();
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
                    <button onClick={crearChat}>Crear chat</button>
                </div>
            </Popup>

            <ChatList chats={chats} />



        </>
    );
}