-- 
CREATE TABLE UsuariosChat (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    imagen VARCHAR(255)
);

CREATE TABLE Chats (
    id_chat INT AUTO_INCREMENT PRIMARY KEY,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    nombre VARCHAR(100) NOT NULL,
    foto VARCHAR(255)
);

ALTER TABLE Chats
ADD COLUMN nombre VARCHAR(100) NOT NULL,
ADD COLUMN foto VARCHAR(255);

CREATE TABLE ChatUsuarios (
    id_chat INT,
    id_usuario INT,

    PRIMARY KEY (id_chat, id_usuario),

    FOREIGN KEY (id_chat) REFERENCES Chats(id_chat),
    FOREIGN KEY (id_usuario) REFERENCES UsuariosChat(id_usuario)
);

CREATE TABLE Mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_chat INT NOT NULL,
    id_usuario INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_chat) REFERENCES Chats(id_chat),
    FOREIGN KEY (id_usuario) REFERENCES UsuariosChat(id_usuario)
);

select *
FROM UsuariosChat;

INSERT INTO UsuariosChat (nombre, email, password, imagen)
VALUES
('Juanma', 'juanma@gmail.com', '123456', 'juanma.jpg'),
('Tini', 'tini@gmail.com', '123456', 'tini.jpg');