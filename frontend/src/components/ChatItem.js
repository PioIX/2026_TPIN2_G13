export default function ChatItem({ chat, onClick }) {

    return (
        <div
            className="chat-item"
            onClick={onClick}
        >

            <img
                className="chat-item-foto"
                src={
                    chat.foto ||
                    chat.imagen_contacto ||
                    "/foto-default.jpg"
                }
                alt="Foto del chat"
            />

            <div className="chat-item-info">

                <div className="chat-item-top">
                    <h3>
                        {chat.nombre_contacto || chat.nombre}
                    </h3>

                    <span className="chat-arrow">
                        ›
                    </span>
                </div>

                <p>
                    {chat.nombre === "Chat individual"
                        ? "Chat individual"
                        : "Grupo"}
                </p>

            </div>

        </div>
    );
}