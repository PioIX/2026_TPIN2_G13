
export default function ChatItem({ chat }) {
    // Mostramos la información de un solo chat
    return (
        <div>

            {/* 
                Si el chat tiene una foto, usamos esa.
                Si no tiene, usamos la foto del contacto.
                Si tampoco tiene, mostramos una foto por defecto.
            */}
            <img
                src={chat.foto || chat.imagen_contacto || "/foto-default.jpg"}
                alt="Foto del chat"
            />

            {/*
                Si es un chat individual, mostramos el nombre del contacto.
                Si es un grupo, mostramos el nombre del grupo.
            */}
            <h3>
                {chat.nombre_contacto || chat.nombre}
            </h3>

        </div>
    )
}


