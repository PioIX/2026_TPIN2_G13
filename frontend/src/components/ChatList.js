import ChatItem from "./ChatItem"

export default function ChatList({ chats }) {

    return (
        <div>
            <h2>Mis chats</h2>

            {/*
                Recorremos el array de chats.
                Por cada chat creamos un ChatItem.
            */}
            {chats.map((chat) => (
                <ChatItem
                    key={chat.id_chat}
                    chat={chat}
                />
            ))}
        </div>
    )
}