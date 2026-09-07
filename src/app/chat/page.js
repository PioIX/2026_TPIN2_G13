"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";

export default function ChatPage() {
    const router = useRouter();
    const { socket, isConnected } = useSocket();
    const searchParams = useSearchParams();

    const usuario = searchParams.get("usuario");
    const sala = searchParams.get("sala");

    const [mensaje, setMensaje] = useState("");
    const [conversacion, setConversacion] = useState([]);
    const [nuevaSala, setNuevaSala] = useState("");

    
    useEffect(() => {
        if (!socket || !sala) return;

        setConversacion([]);

        //Unirse a la nueva sala
        socket.emit("joinRoom", { room: sala });

        function recibirMensaje(data) {
            console.log("newMessage:", data);
            setConversacion((mensajesAnteriores) => [...mensajesAnteriores, data]);
        }

        socket.on("newMessage", recibirMensaje);
        
    }, [socket, sala]);

    function mandarMensaje() {

        socket.emit("sendMessage", {
            message: mensaje
        });

        setMensaje("");
    }

    function mandarNuevaSala() {
        if (!nuevaSala.trim()) return;
        router.replace(`/chat?sala=${nuevaSala}&usuario=${usuario}`);
    }

    function leerMensajeInput(event) {
        setMensaje(event.target.value);
    }

    function leerNuevaSalaInput(event) {
        setNuevaSala(event.target.value);
        
    }

    return (
        <>
            <h1>Chat</h1>

            <p>Usuario: {usuario}</p>
            <p>Sala: {sala}</p>

            <div>
                <input
                    type="text"
                    placeholder="Escribí un mensaje"
                    value={mensaje}
                    onChange={leerMensajeInput}
                />
                <button onClick={mandarMensaje}>Enviar</button>
            </div>

            <br />

            <div>
                <input
                    type="text"
                    placeholder="Escribí nueva sala"
                    value={nuevaSala}
                    onChange={leerNuevaSalaInput}
                />
                <button onClick={mandarNuevaSala}>Cambiar de sala</button>
            </div>

            <h2>Conversación</h2>

            {conversacion.map((mensajito, index) => (
                <p key={index}>
                    Sala: {mensajito.room} — Mensaje: {mensajito.message}
                </p>
            ))}
        </>
    );
}