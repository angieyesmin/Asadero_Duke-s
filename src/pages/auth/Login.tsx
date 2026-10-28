import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Flame,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth, type Role } from "../../context/AuthContext";

const roleInfo: Record<
  Role,
  { title: string; color: string; home: string }
> = {
  admin: {
    title: "Administrador",
    color: "bg-red-800 hover:bg-red-900",
    home: "/admin",
  },
  mesero: {
    title: "Mesero",
    color: "bg-orange-600 hover:bg-orange-700",
    home: "/mesero",
  },
  cocina: {
    title: "Cocina",
    color: "bg-emerald-700 hover:bg-emerald-800",
    home: "/cocina",
  },
};

export default function Login() {
  const { role: param } = useParams();
  const role = (param || "admin") as Role;
  const info = roleInfo[role] || roleInfo.admin;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Ingresa tu usuario y contraseña.");
      return;
    }

    setError("");
    login(role, username);
    navigate(info.home);
  };

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-neutral-950">

      {/* PANEL IZQUIERDO: IMAGEN */}
      <section className="relative hidden min-h-screen w-1/2 flex-col justify-between overflow-hidden p-12 text-white lg:flex xl:p-16">

        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1800&q=90"
          alt="Carne asada de Asadero Duke's"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* OSCURECER IMAGEN */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90" />

        {/* MARCA */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 shadow-xl">
            <Flame size={38} />
          </div>

          <div>
            <p className="text-sm font-bold tracking-[0.4em] text-orange-400">
              ASADERO
            </p>

            <h1 className="text-4xl font-black tracking-wide">
              DUKE'S
            </h1>
          </div>
        </div>

        {/* TEXTO INFERIOR */}
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.35em] text-orange-400">
            Sabor que nos une
          </p>

          <h2 className="text-5xl font-black leading-tight xl:text-7xl">
            Buena carne,
            <br />
            <span className="text-orange-500">
              mejores momentos.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">
            Gestiona las operaciones de tu restaurante desde
            un solo lugar. Bienvenido al sistema de Asadero Duke's.
          </p>

          <div className="mt-8 h-1.5 w-24 rounded-full bg-orange-500" />
        </div>

        <p className="relative z-10 text-sm text-white/60">
          © {new Date().getFullYear()} Asadero Duke's. Todos los derechos reservados.
        </p>
      </section>

      {/* PANEL DERECHO: FORMULARIO */}
      <section className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-10 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">

        <div className="w-full max-w-xl">

          {/* REGRESAR */}
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-red-800"
          >
            <ArrowLeft size={19} />
            Volver al inicio
          </Link>

          {/* LOGO EN CELULARES */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-white">
              <Flame size={32} />
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-orange-600">
                ASADERO
              </p>

              <h1 className="text-2xl font-black text-slate-900">
                DUKE'S
              </h1>
            </div>
          </div>

          {/* ENCABEZADO */}
          <div className="mb-10">
            <span className="inline-block rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-800">
              Sistema de restaurante
            </span>

            <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Bienvenido a Duke's
            </h2>

            <p className="mt-4 text-lg leading-7 text-slate-500">
              Inicia sesión para acceder al sistema.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-red-800" />

              <span className="text-base font-bold text-slate-700">
                Acceso de {info.title}
              </span>
            </div>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={submit} className="space-y-7">

            {/* USUARIO */}
            <div>
              <label
                htmlFor="username"
                className="mb-3 block text-base font-semibold text-slate-700"
              >
                Usuario
              </label>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-100">
                <UserRound size={23} className="shrink-0 text-slate-400" />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label
                htmlFor="password"
                className="mb-3 block text-base font-semibold text-slate-700"
              >
                Contraseña
              </label>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-100">
                <LockKeyhole size={23} className="shrink-0 text-slate-400" />

                <input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="shrink-0 text-slate-400 transition hover:text-red-800"
                  aria-label={
                    show ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {show ? <EyeOff size={23} /> : <Eye size={23} />}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {/* BOTÓN */}
            <button
              type="submit"
              className={`w-full rounded-2xl py-5 text-lg font-bold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl ${info.color}`}
            >
              Iniciar sesión
            </button>
          </form>

          {/* PIE */}
          <div className="mt-12 border-t border-slate-100 pt-6">
            <p className="text-center text-sm text-slate-400">
              © {new Date().getFullYear()} Asadero Duke's
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}