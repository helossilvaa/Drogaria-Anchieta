"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Funcionarios () {

    const [funcionario, setFuncionario] = useState([]);
    

    const router = useRouter();

   const API_URL = 'http://localhost:8080';

    useEffect (() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const decoded = jwtDecode(token);

            if (decoded.setor != 'matriz') {
                router.push('/');
                return; 
            }

            if (decoded.exp > Date.now() / 1000) {
                localStorage.removeItem("token");
                toast.error('Login expirado!');
                setTimeout(() => router.push('/'), 3000);
                return;
            };

            const id = decoded.id;
            fetch(`${API_URL}/usuarios/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => res.json())
                .catch(err => console.error("Erro ao buscar usuário: ", err));

        } catch (error) {
            console.error("Token inválido:", error);
            localStorage.removeItem("token");
            router.push("/login");
        }
    })


    return (
        <>

        </>
    );
}