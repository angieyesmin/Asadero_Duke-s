import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Flame,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  Home,
  ShoppingBasket,
  ClipboardList,
  Users,
  Wallet,
  BarChart3,
  Grid2X2,
  ChefHat,
  Package,
  Check,
  CheckCheck,
} from "lucide-react";

import { useAuth, type Role } from "../../context/AuthContext";

// ======================================================
// TIPOS DE NOTIFICACIONES
// ======================================================

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  status: string;
  createdAt: string;
};

// ======================================================
// MENÚ DE NAVEGACIÓN
// ======================================================

const menus: Record<
  Role,
  {
    label: string;
    to: string;
    icon: typeof Home;
  }[]
> = {
  admin: [
    { label: "Inicio", to: "/admin", icon: Home },
    { label: "Pedidos", to: "/admin/pedidos", icon: ClipboardList },
    { label: "Productos", to: "/admin/productos", icon: Package },
    { label: "Categorías", to: "/admin/categorias", icon: Grid2X2 },
    { label: "Usuarios", to: "/admin/usuarios", icon: Users },
    { label: "Corte de caja", to: "/admin/corte-caja", icon: Wallet },
    { label: "Reportes", to: "/admin/reportes", icon: BarChart3 },
  ],

  mesero: [
    { label: "Inicio", to: "/mesero", icon: Home },
    {
      label: "Nuevo pedido",
      to: "/mesero/nuevo-pedido",
      icon: ShoppingBasket,
    },
    {
      label: "Mis pedidos",
      to: "/mesero/mis-pedidos",
      icon: ClipboardList,
    },
    { label: "Cobrar pedido", to: "/mesero/cobrar", icon: Wallet },
  ],

  cocina: [
    { label: "Inicio", to: "/cocina", icon: Home },
    { label: "Pedidos", to: "/cocina/pedidos", icon: ChefHat },
  ],
};

// ======================================================
// NOMBRES DE LOS ROLES
// ======================================================

const roleLabels: Record<Role, string> = {
  admin: "Administrador",
  mesero: "Mesero",
  cocina: "Cocina",
};

// ======================================================
// LEER PEDIDOS GUARDADOS
// ======================================================

function readOrders(): any[] {
  try {
    const saved = localStorage.getItem("dukes-orders");

    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }

    return [];
  } catch {
    return [];
  }
}

// ======================================================
// GENERAR NOTIFICACIONES SEGÚN LOS PEDIDOS
// ======================================================

function getOrderNotifications(): NotificationItem[] {
  const orders = readOrders();

  return orders
    .filter(
      (order) =>
        order.status === "Pendiente" ||
        order.status === "En preparación" ||
        order.status === "Listo",
    )
    .map((order) => ({
      id: Number(order.id),
      title: `Pedido #${order.id}`,
      message: `Estado actual: ${order.status}`,
      status: order.status,
      createdAt: order.createdAt || "",
    }))
    .sort((a, b) => b.id - a.id);
}

// ======================================================
// COMPONENTE PRINCIPAL
// ======================================================

export function AppShell({
  children,
  role,
}: {
  children: ReactNode;
  role: Role;
}) {
  const [open, setOpen] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    getOrderNotifications,
  );

  const [readNotificationIds, setReadNotificationIds] = useState<number[]>(
    () => {
      try {
        return JSON.parse(
          localStorage.getItem("dukes-read-notifications") || "[]",
        );
      } catch {
        return [];
      }
    },
  );

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = menus[role];

  // ======================================================
  // ACTUALIZAR NOTIFICACIONES
  // ======================================================

  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(getOrderNotifications());
    };

    // Comprobar cambios periódicamente.
    const interval = window.setInterval(updateNotifications, 3000);

    // Actualizar al volver a la pestaña.
    window.addEventListener("focus", updateNotifications);

    // Escuchar cambios de localStorage realizados desde otra pestaña.
    window.addEventListener("storage", updateNotifications);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", updateNotifications);
      window.removeEventListener("storage", updateNotifications);
    };
  }, []);

  // ======================================================
  // MARCAR NOTIFICACIÓN COMO LEÍDA
  // ======================================================

  const markAsRead = (id: number) => {
    setReadNotificationIds((previous) => {
      const updated = previous.includes(id) ? previous : [...previous, id];

      localStorage.setItem(
        "dukes-read-notifications",
        JSON.stringify(updated),
      );

      return updated;
    });
  };

  // ======================================================
  // MARCAR TODAS COMO LEÍDAS
  // ======================================================

  const markAllAsRead = () => {
    const allIds = notifications.map((notification) => notification.id);

    setReadNotificationIds((previous) => {
      const updated = [...new Set([...previous, ...allIds])];

      localStorage.setItem(
        "dukes-read-notifications",
        JSON.stringify(updated),
      );

      return updated;
    });
  };

  // ======================================================
  // NOTIFICACIONES NO LEÍDAS
  // ======================================================

  const unreadCount = notifications.filter(
    (notification) => !readNotificationIds.includes(notification.id),
  ).length;

  // ======================================================
  // CERRAR SESIÓN
  // ======================================================

  const exit = () => {
    logout();
    navigate("/");
  };

  // ======================================================
  // INTERFAZ
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-100">
      {/* FONDO DEL MENÚ MÓVIL */}

      {open && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* MENÚ LATERAL */}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-neutral-950 text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGOTIPO */}

        <div className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-900">
            <Flame size={29} className="text-orange-400" />
          </div>

          <div>
            <div className="text-xs font-bold tracking-[.25em]">
              ASADERO
            </div>

            <div className="text-2xl font-black leading-6">DUKE'S</div>

            <div className="mt-1 text-[8px] tracking-wide text-slate-400">
              BUENA CARNE, MEJORES MOMENTOS
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* ROL DEL USUARIO */}

        <div className="px-4 pt-6 text-xs font-semibold uppercase tracking-widest text-slate-500">
          {roleLabels[role]}
        </div>

        {/* NAVEGACIÓN */}

        <nav className="mt-3 flex-1 space-y-1 px-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === `/${role === "admin" ? "admin" : role}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-red-800 text-white shadow-lg shadow-red-950/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* CONFIGURACIÓN Y CIERRE DE SESIÓN */}

        <div className="space-y-1 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => navigate(`/${role}/configuracion`)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/10"
          >
            <Settings size={18} />
            Configuración
          </button>

          <button
            type="button"
            onClick={exit}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/10"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}

      <div className="min-h-screen lg:pl-64">
        {/* BARRA SUPERIOR */}

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between bg-gradient-to-r from-red-950 to-red-900 px-4 text-white shadow-md sm:px-7">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-lg font-bold">{roleLabels[role]}</h1>

              <p className="hidden text-xs text-red-100 sm:block">
                {role === "admin"
                  ? "Control general del restaurante"
                  : role === "mesero"
                    ? "Toma de pedidos y atención a clientes"
                    : "Preparación y seguimiento de pedidos"}
              </p>
            </div>
          </div>

          {/* USUARIO Y NOTIFICACIONES */}

          <div className="flex items-center gap-4">
            {/* BOTÓN DE LA CAMPANA */}

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((previous) => !previous)}
                className={`relative rounded-full p-2 transition ${
                  notificationsOpen
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
                title="Notificaciones"
                aria-label={`Notificaciones. ${unreadCount} sin leer`}
                aria-expanded={notificationsOpen}
              >
                <Bell size={22} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-400 px-1 text-[10px] font-bold text-red-950">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {/* PANEL DE NOTIFICACIONES */}

              {notificationsOpen && (
                <>
                  {/* Cerrar al pulsar fuera del panel */}

                  <button
                    type="button"
                    aria-label="Cerrar notificaciones"
                    onClick={() => setNotificationsOpen(false)}
                    className="fixed inset-0 z-30 cursor-default"
                  />

                  <div className="absolute right-0 top-12 z-40 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl">
                    {/* ENCABEZADO */}

                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
                      <div>
                        <h2 className="font-bold">Notificaciones</h2>
                        <p className="mt-1 text-xs text-slate-500">
                          {unreadCount === 0
                            ? "Todo está al día"
                            : `Tienes ${unreadCount} sin leer`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="flex items-center gap-1 text-xs font-semibold text-red-800 hover:text-red-600"
                      >
                        <CheckCheck size={15} />
                        Leer todas
                      </button>
                    </div>

                    {/* LISTA */}

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell
                            size={30}
                            className="mx-auto mb-3 text-slate-300"
                          />

                          <p className="font-medium text-slate-600">
                            No tienes notificaciones
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Los nuevos pedidos aparecerán aquí.
                          </p>
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const isRead = readNotificationIds.includes(
                            notification.id,
                          );

                          return (
                            <div
                              key={notification.id}
                              className={`border-b border-slate-100 p-4 transition ${
                                isRead
                                  ? "bg-white"
                                  : "bg-red-50/70"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                    notification.status === "Listo"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : notification.status === "En preparación"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  <Bell size={17} />
                                </span>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-bold">
                                      {notification.title}
                                    </p>

                                    {!isRead && (
                                      <span className="h-2 w-2 shrink-0 rounded-full bg-red-600" />
                                    )}
                                  </div>

                                  <p className="mt-1 text-xs text-slate-600">
                                    {notification.message}
                                  </p>

                                  <p className="mt-1 text-[11px] text-slate-400">
                                    Pedido para llevar
                                    {notification.createdAt
                                      ? ` · ${notification.createdAt}`
                                      : ""}
                                  </p>

                                  {!isRead && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        markAsRead(notification.id)
                                      }
                                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-red-800 hover:text-red-600"
                                    >
                                      <Check size={14} />
                                      Marcar como leída
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* PIE */}

                    <div className="border-t border-slate-100 bg-slate-50 p-3">
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationsOpen(false);

                          if (role === "admin") {
                            navigate("/admin/pedidos");
                          } else if (role === "mesero") {
                            navigate("/mesero/mis-pedidos");
                          } else {
                            navigate("/cocina/pedidos");
                          }
                        }}
                        className="w-full rounded-xl bg-red-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        Ver pedidos
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* USUARIO */}

            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white text-red-950 sm:flex">
              <span className="font-bold">
                {(user?.name || roleLabels[role])
                  .slice(0, 1)
                  .toUpperCase()}
              </span>
            </div>

            <div className="hidden sm:block">
              <div className="text-sm font-semibold">
                {user?.name || roleLabels[role]}
              </div>

              <div className="text-xs text-red-100">
                {roleLabels[role]}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO DE CADA PÁGINA */}

        <main className="p-4 sm:p-7">{children}</main>

        {/* PIE DE PÁGINA */}

        <footer className="px-7 pb-5 text-center text-xs text-slate-400">
          Asadero Duke's · Sistema de gestión · Datos de demostración
        </footer>
      </div>
    </div>
  );
}