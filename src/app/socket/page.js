"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";

export default function SocketPage() {
    const { socket, isConnected } = useSocket();
    const [mensajes, setMensajes] = useState([]);
    const [contador, setContador] = useState(0);

    useEffect(() => {
        if (socket) {
            console.log("Web Socket Conectado");
            socket.on("pingAll", (data) => {
                console.log("PING ALL: ", data);
                setMensajes((mensajesAnteriores) => [...mensajesAnteriores, data]);
            });

            socket.on("respuestaPersonalizada", (data) => {
                console.log("EVENTO CONTADOR ", data);
                setContador(data.contador);
            });

        }
    }, [socket]);

    function pingAll() {
        socket.emit("pingAll", { msg: "Hola desde mi compu" })
    }

    function contadorSuma() {
        socket.emit("eventoPersonalizado")
    }

    return (
        <div>
            {isConnected ? (
                <p>🟢 Conectado al servidor</p>
            ) : (
                <p>🔴 Desconectado</p>
            )}

            <button onClick={pingAll}>Enviar ping a todos</button>

            <button onClick={contadorSuma}>Contar +1</button>

            <div>
                {mensajes.map((mensaje, index) => (
                    <p key={index}>{mensaje.message.msg}</p>
                ))}

            </div>

            <div>
                <p>CONTADOR:{contador}</p>
            </div>

        </div>
    );
}