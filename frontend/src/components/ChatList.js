"use client";

import { useRouter } from "next/navigation";
import ChatItem from "./ChatItem";

export default function ChatList({ chats }) {

    const router = useRouter();

    function abrirChat(chat) {
        router.push(`/chat/${chat.id_chat}`);
    }

    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <div>
                    <span className="chat-list-eyebrow">MENSAJES</span>
                    <h2>Mis chats</h2>
                </div>

                <span className="chat-count">
                    {chats.length}
                </span>
            </div>

            <div className="chat-list-items">

                {chats.length === 0 ? (
                    <div className="empty-chats">
                        <div className="empty-chats-icon">💬</div>
                        <h3>No tenés chats todavía</h3>
                        <p>Creá una conversación para empezar a hablar.</p>
                    </div>
                ) : (

                    chats.map((chat) => (
                        <ChatItem
                            key={chat.id_chat}
                            chat={chat}
                            onClick={() => abrirChat(chat)}
                        />
                    ))

                )}

            </div>
        </div>
    );
}