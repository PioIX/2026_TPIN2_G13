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

const mysql = require("./modulos/mysql");

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


app.get("/chats/:id_usuario", async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const chats = await mysql.realizarQuery(
      `SELECT Chats.id_chat, Chats.nombre, Chats.foto, Chats.fecha_creacion
      FROM Chats
      INNER JOIN ChatUsuario ON Chats.id_chat = ChatUsuario.id_chat
      WHERE ChatUsuario.id_usuario = ${id_usuario}`
    );

    res.status(200).json(chats);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al obtener los chats"
    });
  }
});


app.post("/chats/individual", async (req, res) => {
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
            `INSERT INTO ChatUsuario (id_chat, id_usuario)
             VALUES (${id_chat}, ${id_usuario})`
        );
        // Agregar al otro usuario
        await mysql.realizarQuery(
            `INSERT INTO ChatUsuario (id_chat, id_usuario)
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