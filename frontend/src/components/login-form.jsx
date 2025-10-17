"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "./ui/floatinglabel";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_URL = "http://localhost:8080";

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Login realizado com sucesso!");
        const setor = data.usuario?.setor;
        setTimeout(() => {
          if (setor === "gerente") router.push("/gerente/dashboard");
          else if (setor === "matriz") router.push("/matriz/dashboard");
          else router.push("/pdv/dashboard");
        }, 1000);
      } else {
        setErro(data.error || "Credenciais inválidas");
        toast.error(data.error || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErro("Erro na requisição. Verifique sua conexão.");
      toast.error("Erro na requisição. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover={false} theme="light" />

      <div className="w-1/2 bg-gradient-to-r from-teal-300 to-red-300">
      <div className="container flex justify-end items-center">
        <h2 className="bg-white w-50 p-4 rounded-l-full font-bold text-center">LOGIN</h2>
      </div>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center p-10">
        <Image src="/logo.png" width={400} height={200} alt="Logo Drogaria Anchieta" />

        <form onSubmit={login} className="w-full max-w-md mt-8 space-y-6">
          <FloatingInput
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FloatingInput
            id="senha"
            type="password"
            label="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />


          <Button type="submit" variant="verde" size = "lg"className="w-full mt-4" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
