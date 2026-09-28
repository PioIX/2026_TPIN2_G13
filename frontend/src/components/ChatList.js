"use client";

import { useState } from "react";
import ChatItem from "./ChatItem";

export default function ChatList({ chats, onSeleccionarChat }) {

    return (
        <div className="chat-list">

            <h2>Mis chats</h2>

            <div className="chat-list-items">

                {chats.map((chat) => (

                    <ChatItem
                        key={chat.id_chat}
                        chat={chat}
                      
                        onClick={() => onSeleccionarChat(chat)}
                    />

                ))}

            </div>

        </div>
    );
}