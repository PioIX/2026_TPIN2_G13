"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../components/Input";
import Button from "../../components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const initialForm = {
    nombre: "",
    email: "",
    password: "",
    imagen: "",
};

export default function LoginPage() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        setForm((currentForm) => ({
            ...currentForm,
            [event.target.name]: event.target.value,
        }));
        setError("");
    }

    function changeMode(registering) {
        setIsRegistering(registering);
        setForm(initialForm);
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        const endpoint = isRegistering ? "/register" : "/login";
        const body = isRegistering
            ? form
            : { email: form.email, password: form.password };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No se pudo completar la operación");
            }

            const usuario = data.usuario || {
                nombre: form.nombre,
                email: form.email,
                imagen: form.imagen,
            };
            localStorage.setItem("usuario", JSON.stringify(usuario));
            router.push("/");
        } catch (requestError) {
            setError(requestError.message || "No se pudo conectar con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-aside">
                <p className="eyebrow">Conexiones que importan</p>
                <h1>Tu conversación empieza acá.</h1>
                <p className="aside-copy">
                    Ingresá a tu espacio de ChatApp y mantené tus conversaciones cerca.
                </p>
            </section>

            <section className="auth-panel" aria-labelledby="auth-title">
                <div className="auth-heading">
                    <span className="brand-mark" aria-hidden="true">C</span>
                    <div>
                        <p className="brand-name">ChatApp</p>
                        <p className="brand-caption">Mensajería simple, humana</p>
                    </div>
                </div>

                <div className="auth-title-row">
                    <div>
                        <p className="eyebrow">Bienvenido</p>
                        <h2 id="auth-title">{isRegistering ? "Creá tu cuenta" : "Iniciá sesión"}</h2>
                    </div>
                    <span className="status-dot" aria-label="Servicio disponible" />
                </div>

                <div className="auth-tabs" role="tablist" aria-label="Tipo de acceso">
                    <button
                        className={!isRegistering ? "active" : ""}
                        onClick={() => changeMode(false)}
                        role="tab"
                        aria-selected={!isRegistering}
                        type="button"
                    >
                        Login
                    </button>
                    <button
                        className={isRegistering ? "active" : ""}
                        onClick={() => changeMode(true)}
                        role="tab"
                        aria-selected={isRegistering}
                        type="button"
                    >
                        Registrarse
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isRegistering && (
                        <Input
                            label="Username"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                        />
                    )}
                    <Input
                        label="Mail"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="nombre@ejemplo.com"
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />
                    {isRegistering && (
                        <Input
                            label="Foto del contacto"
                            name="imagen"
                            value={form.imagen}
                            onChange={handleChange}
                            placeholder="URL de tu foto (opcional)"
                            required={false}
                        />
                    )}

                    {error && <p className="form-error" role="alert">{error}</p>}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Procesando..." : isRegistering ? "Crear cuenta" : "Ingresar"}
                    </Button>
                </form>

                <p className="auth-footer">
                    {isRegistering ? "¿Ya tenés una cuenta?" : "¿Todavía no tenés cuenta?"}{" "}
                    <button type="button" onClick={() => changeMode(!isRegistering)}>
                        {isRegistering ? "Iniciá sesión" : "Registrate"}
                    </button>
                </p>
            </section>
        </main>
    );
}