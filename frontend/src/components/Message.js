export default function Message({ mensaje, miId }) {

    const esMio = mensaje.id_usuario === miId;

    return (
        <div className={esMio ? "mensaje-mio" : "mensaje-otro"}>

            <p>
                {mensaje.contenido}
            </p>

        </div>
    );
}