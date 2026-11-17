import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "admin" | "mesero" | "cocina";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type LoginResponse = {
  mensaje: string;
  token: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    role: Role;
  };
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (
    role: Role,
    correo: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("dukes-user");

    if (!saved) return null;

    try {
      return JSON.parse(saved) as AuthUser;
    } catch {
      localStorage.removeItem("dukes-user");
      localStorage.removeItem("dukes-token");
      return null;
    }
  });

  const value = useMemo(
    () => ({
      user,

      // INICIAR SESIÓN CON EL BACKEND
      login: async (role: Role, correo: string, password: string) => {
        const response = await fetch(
          "http://localhost:3000/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              correo: correo.trim(),
              password,
              rol: role,
            }),
          },
        );

        const data = (await response.json()) as LoginResponse;

        if (!response.ok) {
          throw new Error(
            data.mensaje || "No fue posible iniciar sesión.",
          );
        }

        const usuario: AuthUser = {
          id: data.usuario.id,
          name: data.usuario.nombre,
          email: data.usuario.correo,
          role: data.usuario.role,
        };

        // GUARDAR SESIÓN
        localStorage.setItem(
          "dukes-user",
          JSON.stringify(usuario),
        );

        localStorage.setItem("dukes-token", data.token);

        setUser(usuario);
      },

      // CERRAR SESIÓN
      logout: () => {
        localStorage.removeItem("dukes-user");
        localStorage.removeItem("dukes-token");
        setUser(null);
      },
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// UTILIZAR AUTENTICACIÓN
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider",
    );
  }

  return context;
}