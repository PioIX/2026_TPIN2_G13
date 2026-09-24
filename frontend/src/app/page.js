"use client";

import { useEffect, useState } from "react";
import ChatList from "@/components/ChatList";

export default function Page() {

    const [chats, setChats] = useState([]);

    useEffect(() => {

        fetch("http://localhost:4000/usuario")
            .then(response => response.json())
            .then(usuario => {

                const id_usuario = usuario.id_usuario;

                fetch(`http://localhost:4000/chats/${id_usuario}`)
                    .then(response => response.json())
                    .then(data => {
                        setChats(data);
                    });

            });

    }, []);

    return (
        <>
            <h1>Pio Chat</h1>

            <ChatList chats={chats} />
        </>
    );
}