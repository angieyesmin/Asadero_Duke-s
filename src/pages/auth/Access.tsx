import {
  Flame,
  ShieldCheck,
  ConciergeBell,
  ChefHat,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Role } from "../../context/AuthContext";

const options: {
  role: Role;
  title: string;
  detail: string;
  color: string;
  icon: typeof ShieldCheck;
}[] = [
  {
    role: "admin",
    title: "Administrador",
    detail: "Gestiona el sistema completo",
    color: "from-red-700 to-red-900",
    icon: ShieldCheck,
  },
  {
    role: "mesero",
    title: "Mesero",
    detail: "Toma pedidos y cobra",
    color: "from-orange-500 to-orange-700",
    icon: ConciergeBell,
  },
  {
    role: "cocina",
    title: "Cocina",
    detail: "Prepara y actualiza pedidos",
    color: "from-emerald-700 to-emerald-900",
    icon: ChefHat,
  },
];
export default function Access() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-neutral-950 p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="relative flex min-h-[340px] flex-col justify-end overflow-hidden bg-neutral-900 p-8 text-white sm:p-12">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85"
            alt="Carne asada"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-red-950/30" />
          <div className="relative">
            <Flame className="mb-4 text-orange-500" size={52} />
            <p className="text-sm font-bold tracking-[.35em]">ASADERO</p>
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              DUKE'S
            </h1>
            <p className="mt-3 text-sm font-medium tracking-widest text-orange-100">
              BUENA CARNE, MEJORES MOMENTOS
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-800">
            Sistema de restaurante
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Bienvenido a Asadero Duke's
          </h2>
          <p className="mt-3 text-slate-500">
            Selecciona tu tipo de acceso para continuar.
          </p>
          <div className="mt-8 space-y-4">
            {options.map(({ role, title, detail, color, icon: Icon }) => (
              <button
                key={role}
                onClick={() => navigate(`/login/${role}`)}
                className={`flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r ${color} p-4 text-left text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <Icon size={25} />
                </span>
                <span className="flex-1">
                  <span className="block font-bold">{title}</span>
                  <span className="mt-1 block text-xs text-white/80">
                    {detail}
                  </span>
                </span>
                <ArrowRight size={20} />
              </button>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Asadero Duke's
          </p>
        </div>
      </div>
    </div>
  );
}
