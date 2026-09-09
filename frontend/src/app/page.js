"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InicioPage() {
    const router = useRouter()
    const  [usuario, setUsuario] = useState("")
    const  [sala, setSala] = useState("")

    function leerUsuario(event){
        setUsuario(event.target.value)
    }

    function leerSala(event){
        setSala(event.target.value)
    }

    function mandarData(){
        router.push(`/chat?sala=${sala}&usuario=${usuario}`);
    }

    return(
        <>
            <h1>INGRESO DE DATOS</h1>

            <label>Ingresa tu usuario</label>
            <input type="text" placeholder="user" value={usuario} onChange={leerUsuario}></input>
            <label>Ingresa tu sala</label>
            <input type="text" placeholder="salita" value={sala} onChange={leerSala}></input>
            

            {usuario && sala&&
                <button onClick={mandarData}>Enviar datos</button>
            }

            <Link href="/socket">Ir a socket</Link>


        </>
    )
}