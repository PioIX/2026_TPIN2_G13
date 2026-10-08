"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Chat from "@/components/Chat";

export default function ChatPage() {

    const params = useParams();
    const router = useRouter();

    const [usuario, setUsuario] = useState(null);
    const [chat, setChat] = useState(null);
    const [cargando, setCargando] = useState(true);

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
            .then(usuarioData => {

                setUsuario(usuarioData);

                return fetch(
                    `http://localhost:4000/chats/${usuarioData.id_usuario}`,
                    {
                        credentials: "include"
                    }
                );
            })
            .then(response => response.json())
            .then(chats => {

                const chatEncontrado = chats.find(
                    chat => chat.id_chat == params.id
                );

                setChat(chatEncontrado);
                setCargando(false);
            })
            .catch(error => {

                console.log(error);
                setCargando(false);

            });

    }, [params.id]);


    if (cargando) {
        return (
            <main className="chat-page-loading">
                <div className="loading-spinner"></div>
                <p>Cargando conversación...</p>
            </main>
        );
    }


    if (!chat || !usuario) {
        return (
            <main className="chat-page-loading">

                <div className="not-found-icon">
                    💬
                </div>

                <h2>Chat no encontrado</h2>

                <button
                    className="back-button"
                    onClick={() => router.push("/")}
                >
                    Volver a mis chats
                </button>

            </main>
        );
    }


    return (
        <main className="chat-page">

            <div className="chat-window">

                <div className="chat-window-topbar">

                    <button
                        className="back-chat-button"
                        onClick={() => router.push("/")}
                        title="Volver"
                    >
                        ←
                    </button>

                    <img
                        className="chat-window-avatar"
                        src={
                            chat.foto ||
                            chat.imagen_contacto ||
                            "/foto-default.jpg"
                        }
                        alt="Foto del chat"
                    />

                    <div className="chat-window-info">

                        <h1>
                            {chat.nombre_contacto || chat.nombre}
                        </h1>

                        <span>
                            {chat.nombre === "Chat individual"
                                ? "Conversación privada"
                                : "Grupo"}
                        </span>

                    </div>

                    <div className="chat-online-dot"></div>

                </div>

                <Chat
                    chat={chat}
                    usuario={usuario}
                />

            </div>

        </main>
    );
}