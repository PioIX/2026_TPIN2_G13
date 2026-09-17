const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const sessionMiddleware = session({
  secret: "supersarasa",
  resave: false,
  saveUninitialized: false,
});
app.use(sessionMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Servidor NodeJS corriendo en http://localhost:${PORT}/`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

const mysql = require("./modulos/mysql");

//CONEXION SOCKET

io.on("connection", (socket) => { // Se ejecuta cuando un cliente se conecta

  const req = socket.request;

  // ENTRAR A UNA SALA
  socket.on("joinRoom", (data) => {

    // Si ya estaba en otra sala, sale de esa sala
    if (req.session.room != undefined && req.session.room.length > 0) {
      socket.leave(req.session.room);
    }

    // Guardamos la sala actual
    req.session.room = data.room;

    // Entramos a la nueva sala
    socket.join(req.session.room);

    console.log("Usuario entró a la sala:", req.session.room);

    // Avisamos a los usuarios de la sala
    io.to(req.session.room).emit("chat-messages", {
      user: req.session.usuario,
      room: req.session.room
    });
  });


  // ENVIAR MENSAJE
  socket.on("sendMessage", async (data, id_usuario) => {

    try {
      // Obtenemos el chat actual
      const id_chat = req.data.room;

      // Obtenemos el usuario de la sesión
      const id_usuario = req.data.usuario.id_usuario;

      // Obtenemos el contenido enviado
      const contenido = data.contenido;

      // Guardamos el mensaje en la base de datos
      await mysql.realizarQuery(
        `INSERT INTO Mensajes (id_chat, id_usuario, contenido)
         VALUES (${id_chat}, ${id_usuario}, '${contenido}')`
      );

      // Mandamos el mensaje a todos los usuarios de esa sala
      io.to(req.session.room).emit("newMessage", {
        id_chat: id_chat,
        id_usuario: id_usuario,
        contenido: contenido
      });

    } catch (error) {

      console.error("Error al enviar mensaje:", error);

    }
  });


  // DESCONECTARSE
  socket.on("disconnect", () => {

    console.log("Usuario desconectado");

  });

});
app.post("/register", async (req, res) => {     //ANDA
  try {
    // Obtenemos los datos enviados por el frontend
    const { nombre, email, password, imagen } = req.body;

    // Verificamos que los datos obligatorios estén completos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: "Faltan datos obligatorios"
      });
    }

    // Comprobamos si ya existe un usuario con ese email
    const usuarioExistente = await mysql.realizarQuery(
      `SELECT * FROM UsuariosChat WHERE email = '${email}'`
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({
        error: "El email ya está registrado"
      });
    }

    // Insertamos el nuevo usuario
    await mysql.realizarQuery(
      `INSERT INTO UsuariosChat (nombre, email, password, imagen)
             VALUES ('${nombre}', '${email}', '${password}', '${imagen || ""}')`
    );

    // Respondemos que el registro fue exitoso
    res.status(200).json({
      mensaje: "Usuario registrado correctamente"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al registrar el usuario"
    });
  }
});


app.post("/login", async (req, res) => {        //ANDA
  try {
    // Obtenemos los datos enviados por el frontend
    const { email, password } = req.body;

    // Verificamos que se hayan enviado los datos
    if (!email || !password) {
      return res.status(400).json({
        error: "Faltan datos"
      });
    }

    // Buscamos el usuario por su email
    const usuarios = await mysql.realizarQuery(
      `SELECT * 
      FROM UsuariosChat 
      WHERE email = '${email}'`);

    // Si no existe ningún usuario con ese email
    if (usuarios.length === 0) {
      return res.status(401).json({
        error: "Email o contraseña incorrectos"
      });
    }

    const usuario = usuarios[0];

    // Comprobamos la contraseña
    if (usuario.password !== password) {
      return res.status(401).json({
        error: "Email o contraseña incorrectos"
      });
    }

    // Guardamos el usuario en la sesión
    req.session.usuario = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      imagen: usuario.imagen
    };

    // Devolvemos los datos del usuario
    res.status(200).json({
      mensaje: "Login correcto",
      usuario: req.session.usuario
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al iniciar sesión"
    });
  }
});


//LISTADO DE CHATS
app.get("/chats/:id_usuario", async (req, res) => { //ANDA
  try {
    const { id_usuario } = req.params;

    const chats = await mysql.realizarQuery(
      `SELECT 
                Chats.id_chat,
                Chats.nombre,
                Chats.foto,
                Chats.fecha_creacion,
                UsuariosChat.nombre AS nombre_contacto,
                UsuariosChat.imagen AS imagen_contacto
            FROM Chats
            INNER JOIN ChatUsuarios
                ON Chats.id_chat = ChatUsuarios.id_chat
            LEFT JOIN ChatUsuarios AS OtroChatUsuario
                ON Chats.id_chat = OtroChatUsuario.id_chat
                AND OtroChatUsuario.id_usuario != ${id_usuario}
            LEFT JOIN UsuariosChat
                ON OtroChatUsuario.id_usuario = UsuariosChat.id_usuario
            WHERE ChatUsuarios.id_usuario = ${id_usuario}`
    );
    res.status(200).json(chats);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener los chats"
    });
  }
});


//CHAT INDIVIDUAL
app.post("/chats/individual", async (req, res) => { //ANDA
  try {
    const { id_usuario, email } = req.body;

    if (!id_usuario || !email) {
      return res.status(400).json({
        error: "Faltan datos"
      });
    }

    // Buscar al usuario con el email recibido
    const usuarios = await mysql.realizarQuery(
      `SELECT * FROM UsuariosChat 
      WHERE email = '${email}'`
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        error: "No existe un usuario con ese email"
      });
    }

    const otroUsuario = usuarios[0];

    // Crear el chat
    await mysql.realizarQuery(
      `INSERT INTO Chats (nombre, foto)
             VALUES ('Chat individual', '')`
    );

    // Obtener el ID del chat creado
    const nuevoChat = await mysql.realizarQuery(
      `SELECT id_chat 
             FROM Chats 
             ORDER BY id_chat DESC 
             LIMIT 1`
    );

    const id_chat = nuevoChat[0].id_chat;

    // Agregar al usuario que crea el chat
    await mysql.realizarQuery(
      `INSERT INTO ChatUsuarios (id_chat, id_usuario)
             VALUES (${id_chat}, ${id_usuario})`
    );
    // Agregar al otro usuario
    await mysql.realizarQuery(
      `INSERT INTO ChatUsuarios (id_chat, id_usuario)
     VALUES (${id_chat}, ${otroUsuario.id_usuario})`
    );

    res.status(201).json({
      mensaje: "Chat creado correctamente",
      id_chat: id_chat
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al crear el chat"
    });
  }
});



//CHAT GRUPAL
app.post("/chats/grupal", async (req, res) => {  //ANDA
  try {

    const { id_usuario, emails, nombre } = req.body;

    // Verificamos que estén los datos necesarios
    if (!id_usuario || !emails || emails.length === 0 || !nombre) {
      return res.status(400).json({
        error: "Faltan datos"
      });
    }

    // Creamos el chat grupal
    await mysql.realizarQuery(
      `INSERT INTO Chats (nombre, foto)
             VALUES ('${nombre}', '')`
    );

    // Obtenemos el ID del chat recién creado
    const nuevoChat = await mysql.realizarQuery(
      `SELECT id_chat
             FROM Chats
             ORDER BY id_chat DESC
             LIMIT 1`
    );

    const id_chat = nuevoChat[0].id_chat;

    // Agregamos al usuario que creó el grupo
    await mysql.realizarQuery(
      `INSERT INTO ChatUsuarios (id_chat, id_usuario)
             VALUES (${id_chat}, ${id_usuario})`
    );

    // Recorremos todos los emails recibidos
    for (const email of emails) {

      // Buscamos al usuario correspondiente a ese email
      const usuarios = await mysql.realizarQuery(
        `SELECT * FROM UsuariosChat
                 WHERE email = '${email}'`
      );

      // Si encontramos el usuario, lo agregamos al chat
      if (usuarios.length > 0) {

        const usuario = usuarios[0];

        await mysql.realizarQuery(
          `INSERT INTO ChatUsuarios (id_chat, id_usuario)
                     VALUES (${id_chat}, ${usuario.id_usuario})`
        );
      }
    }

    res.status(201).json({
      mensaje: "Chat grupal creado correctamente",
      id_chat: id_chat
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al crear el chat grupal"
    });
  }
});


//HISTORIAL DE MENSAJES
app.get("/chats/:id_chat/mensajes", async (req, res) => { //ANDA
  try {

    const { id_chat } = req.params;

    // Buscamos todos los mensajes de ese chat
    const mensajes = await mysql.realizarQuery(
      `SELECT *
             FROM Mensajes
             WHERE id_chat = ${id_chat}
             ORDER BY fecha_hora ASC`
    );

    res.status(200).json(mensajes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener los mensajes"
    });
  }
});


//FALTARIA TODO LO QUE ES SOCKET
