export default function ContactosPage() {


	// GET es el método por defecto
	fetch('http://localhost:4000//chats/:id_usuario')
		.then(response => response.json())
		.then(data => console.log(data));

	return (
		<>

		</>
	)
}