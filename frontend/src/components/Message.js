export default function Message({ mensaje, miId }) {

    const esMio =
        mensaje.id_usuario === miId;

    return (
        <div
            className={
                esMio
                    ? "message-row message-row-mine"
                    : "message-row message-row-other"
            }
        >

            <div
                className={
                    esMio
                        ? "message-bubble message-mine"
                        : "message-bubble message-other"
                }
            >

                <p>
                    {mensaje.contenido}
                </p>

            </div>

        </div>
    );
}