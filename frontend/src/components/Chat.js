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

        fetch(`http://localhost:4000/chats/${chat.id_chat}/mensajes`, {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {

                console.log("Historial:", data);

                setMensajes(data);

            })
            .catch(error => {

                console.log("Error al cargar mensajes:", error);

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

                setMensajes(mensajesActuales => [
                    ...mensajesActuales,
                    data
                ]);

            }

        }


        socket.on("newMessage", recibirMensaje);


        return () => {

            socket.off("newMessage", recibirMensaje);

        };

    }, [socket, chat]);


    function escribirMensaje(event) {

        setMensajeNuevo(event.target.value);

    }


    function enviarMensaje() {

        if (mensajeNuevo.trim() === "") {
            return;
        }

        socket.emit("sendMessage", {
            message: mensajeNuevo
        });

        setMensajeNuevo("");

    }


    if (!chat) {

        return (
            <div>
                <h2>Seleccioná un chat</h2>
            </div>
        );

    }


    return (
        <div>

            <h2>
                {chat.nombre_contacto || chat.nombre}
            </h2>


            <div>

                {mensajes.map((mensaje, index) => (

                    <Message
                        key={mensaje.id_mensaje || index}
                        mensaje={mensaje}
                        miId={usuario.id_usuario}
                    />

                ))}

            </div>


            <div>

                <input
                    type="text"
                    placeholder="Escribí un mensaje..."
                    value={mensajeNuevo}
                    onChange={escribirMensaje}
                />

                <button onClick={enviarMensaje}>
                    Enviar
                </button>

            </div>

        </div>
    );
}