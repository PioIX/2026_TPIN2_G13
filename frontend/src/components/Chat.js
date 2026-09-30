"use client";

import { useEffect, useState } from "react";
import Message from "./Message";
import { useSocket } from "@/hooks/useSocket";

export default function Chat({ chat, usuario }) {

    const [mensajes, setMensajes] = useState([]);
    const [mensajeNuevo, setMensajeNuevo] = useState("");

    const { socket } = useSocket();


    // CARGAR HISTORIAL

    useEffect(() => {

        if (!chat) {
            return;
        }

        fetch(
            `http://localhost:4000/chats/${chat.id_chat}/mensajes`,
            {
                credentials: "include"
            }
        )
        .then(response => response.json())
        .then(data => {

            console.log("Historial:", data);

            setMensajes(data);

        })
        .catch(error => {

            console.log(
                "Error al cargar mensajes:",
                error
            );

        });

}, [chat]);


// ENTRAR A LA SALA

useEffect(() => {

    if (!socket || !chat) {
        return;
    }

    socket.emit("joinRoom", {
        room: chat.id_chat
    });


    function recibirMensaje(data) {

        if (data.id_chat == chat.id_chat) {

            setMensajes(
                mensajesActuales => [
                    ...mensajesActuales,
                    data
                ]
            );

        }

    }


    socket.on(
        "newMessage",
        recibirMensaje
    );


    return () => {

        socket.off(
            "newMessage",
            recibirMensaje
        );

    };

}, [socket, chat]);


function escribirMensaje(event) {

    setMensajeNuevo(
        event.target.value
    );

}


function enviarMensaje() {

    if (
        !socket ||
        mensajeNuevo.trim() === ""
    ) {
        return;
    }


    socket.emit("sendMessage", {
        message: mensajeNuevo
    });


    setMensajeNuevo("");

}


function manejarEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        enviarMensaje();

    }

}


return (
    <div className="chat-content">

        <div className="messages-container">

            {mensajes.length === 0 ? (

                <div className="empty-messages">

                    <div className="empty-message-icon">
                        ✨
                    </div>

                    <h3>
                        Todavía no hay mensajes
                    </h3>

                    <p>
                        Mandá el primer mensaje para comenzar la conversación.
                    </p>

                </div>

            ) : (

                mensajes.map(
                    (mensaje, index) => (

                        <Message
                            key={
                                mensaje.id_mensaje ||
                                index
                            }
                            mensaje={mensaje}
                            miId={usuario.id_usuario}
                        />

                    )
                )

            )}

        </div>


        <div className="message-input-area">

            <div className="message-input-wrapper">

                <input
                    type="text"
                    placeholder="Escribí un mensaje..."
                    value={mensajeNuevo}
                    onChange={escribirMensaje}
                    onKeyDown={manejarEnter}
                />

                <button
                    className="send-message-button"
                    onClick={enviarMensaje}
                    disabled={
                        mensajeNuevo.trim() === ""
                    }
                >
                    ➤
                </button>

            </div>

        </div>

    </div>
);
}