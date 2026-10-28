import { useState } from "react";
import {
  Plus,
  Download,
  Trash2,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  Button,
  PageTitle,
  SearchBox,
  StatusBadge,
} from "../../components/ui/Primitives";

import {
  initialOrders,
  initialUsers,
  money,
  products as seedProducts,
  type Product,
  type Order,
} from "../../data/demo";

export function AdminDashboard() {
  const orders = JSON.parse(
    localStorage.getItem("dukes-orders") || "null",
  ) as Order[] | null;

  const current = orders || initialOrders;

  const total = current.reduce(
    (sum, o) =>
      sum + o.items.reduce((s, i) => s + i.qty * i.price, 0),
    0,
  );

  const stats = [
    {
      label: "Ventas registradas",
      value: money(total),
      icon: DollarSign,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Pedidos del sistema",
      value: String(current.length),
      icon: ShoppingBag,
      color: "bg-orange-100 text-orange-700",
    },
    {
      label: "Usuarios activos",
      value: "12",
      icon: Users,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Productos activos",
      value: String(seedProducts.filter((p) => p.active).length),
      icon: Package,
      color: "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <>
      <PageTitle
        title="Resumen general"
        subtitle="Bienvenido al panel de control de Asadero Duke's."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {s.label}
                </span>

                <span className={`rounded-xl p-3 ${s.color}`}>
                  <Icon size={20} />
                </span>
              </div>

              <div className="mt-3 text-2xl font-bold">
                {s.value}
              </div>

              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-700">
                <TrendingUp size={13} />
                Datos de demostración
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="min-w-0 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Pedidos recientes</h2>
            <span className="text-xs text-slate-500">
              Últimos pedidos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b text-xs text-slate-500">
                <tr>
                  <th className="pb-3">Pedido</th>
                  <th>Tipo de pedido</th>
                  <th>Mesero</th>
                  <th>Estado</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {current.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-4 font-semibold">
                      #{o.id}
                    </td>

                    <td>Para llevar</td>

                    <td>{o.waiter}</td>

                    <td>
                      <StatusBadge status={o.status} />
                    </td>

                    <td className="text-right">
                      {money(
                        o.items.reduce(
                          (s, i) => s + i.qty * i.price,
                          0,
                        ),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold">Accesos rápidos</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              {
                label: "Productos",
                icon: Package,
                to: "/admin/productos",
              },
              {
                label: "Usuarios",
                icon: Users,
                to: "/admin/usuarios",
              },
              {
                label: "Corte de caja",
                icon: DollarSign,
                to: "/admin/corte-caja",
              },
              {
                label: "Pedidos para llevar",
                icon: ShoppingBag,
                to: "/admin/pedidos",
              },
            ].map((a) => {
              const Icon = a.icon;

              return (
                <a
                  key={a.label}
                  href={a.to}
                  className="flex min-h-24 flex-col justify-between rounded-xl border border-slate-200 p-4 hover:border-red-300 hover:bg-red-50"
                >
                  <Icon size={22} className="text-red-800" />
                  <span className="text-sm font-semibold">
                    {a.label}
                  </span>
                </a>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

export function ProductsPage() {
  const [items, setItems] = useState<Product[]>(
    () =>
      JSON.parse(localStorage.getItem("dukes-products") || "null") ||
      seedProducts,
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("100");
  const [category, setCategory] = useState("Carnes");
  const [notice, setNotice] = useState("");

  const save = () => {
    if (!name.trim() || Number(price) <= 0) return;

    const next = [
      ...items,
      {
        id: Date.now(),
        name: name.trim(),
        category,
        price: Number(price),
        image:
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
        active: true,
      },
    ];

    setItems(next);
    localStorage.setItem("dukes-products", JSON.stringify(next));

    setName("");
    setShowForm(false);
    setNotice("Producto agregado correctamente.");
  };

  const toggle = (id: number) => {
    const next = items.map((p) =>
      p.id === id ? { ...p, active: !p.active } : p,
    );

    setItems(next);
    localStorage.setItem("dukes-products", JSON.stringify(next));
  };

  const filtered = items.filter((p) =>
    `${p.name} ${p.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      <PageTitle
        title="Catálogo de productos"
        subtitle="Administra los productos disponibles para los pedidos."
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus size={17} />
            Nuevo producto
          </Button>
        }
      />

      {notice && (
        <p role="status" aria-live="polite" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          {notice}
        </p>
      )}

      {showForm && (
        <Card className="mb-5 p-5">
          <h2 className="mb-4 font-bold">Registrar producto</h2>

          <div className="grid gap-3 md:grid-cols-4">
            <label htmlFor="product-name" className="sr-only">Nombre del producto</label>
            <input
              id="product-name"
              className="rounded-lg border p-3 text-sm"
              placeholder="Nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="product-price" className="sr-only">Precio</label>
            <input
              id="product-price"
              className="rounded-lg border p-3 text-sm"
              type="number"
              min="1"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label htmlFor="product-category" className="sr-only">Categoría</label>
            <select
              id="product-category"
              className="rounded-lg border p-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {[
                "Carnes",
                "Hamburguesas",
                "Tacos",
                "Acompañamientos",
                "Bebidas",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <Button onClick={save}>Guardar producto</Button>
          </div>
        </Card>
      )}

      <div className="mb-5 flex flex-wrap gap-3">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Buscar producto o categoría..."
        />

        <span className="self-center text-sm text-slate-500">
          {filtered.length} productos
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <img
              src={p.image}
              alt={p.name}
              className="h-40 w-full object-cover"
              loading="lazy"
            />

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {p.category}
                  </p>
                </div>

                <StatusBadge status={p.active ? "Activo" : "Inactivo"} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-red-800">
                  {money(p.price)}
                </span>

                <Button
                  variant={p.active ? "danger" : "success"}
                  onClick={() => toggle(p.id)}
                >
                  {p.active ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export function CategoriesPage() {
  const [cats, setCats] = useState(
    () =>
      (JSON.parse(localStorage.getItem("dukes-categories") || "null") as
        | string[]
        | null) || [
        "Carnes",
        "Hamburguesas",
        "Tacos",
        "Acompañamientos",
        "Bebidas",
        "Postres",
      ],
  );

  const [value, setValue] = useState("");

  const add = () => {
    if (value.trim() && !cats.includes(value.trim())) {
      const next = [...cats, value.trim()];

      setCats(next);
      localStorage.setItem("dukes-categories", JSON.stringify(next));
      setValue("");
    }
  };

  return (
    <>
      <PageTitle
        title="Categorías"
        subtitle="Organiza los productos del catálogo."
      />

      <Card className="p-5">
        <div className="mb-5 flex flex-wrap gap-3">
          <label htmlFor="new-category" className="sr-only">Nueva categoría</label>
          <input
            id="new-category"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3"
            placeholder="Nueva categoría..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Button onClick={add}>
            <Plus size={17} />
            Agregar categoría
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <div
              key={c}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-semibold">{c}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Categoría de catálogo
                </p>
              </div>

              <Button
                variant="danger"
                onClick={() => {
                  const next = cats.filter((x) => x !== c);

                  setCats(next);
                  localStorage.setItem(
                    "dukes-categories",
                    JSON.stringify(next),
                  );
                }}
              >
                <Trash2 size={15} />
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export function UsersPage() {
  const [users, setUsers] = useState(
    () =>
      JSON.parse(localStorage.getItem("dukes-users") || "null") ||
      initialUsers,
  );

  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Mesero");

  const add = () => {
    if (!name.trim() || !username.trim()) return;

    const next = [
      ...users,
      {
        id: Date.now(),
        name,
        username,
        role,
        status: "Activo",
      },
    ];

    setUsers(next);
    localStorage.setItem("dukes-users", JSON.stringify(next));

    setName("");
    setUsername("");
    setShow(false);
  };

  const filtered = users.filter(
    (u: { name: string; username: string; role: string }) =>
      `${u.name} ${u.username} ${u.role}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <>
      <PageTitle
        title="Administrar usuarios"
        subtitle="Registra al personal y asigna un rol."
        action={
          <Button onClick={() => setShow(!show)}>
            <Plus size={17} />
            Nuevo usuario
          </Button>
        }
      />

      {show && (
        <Card className="mb-5 p-5">
          <div className="grid gap-3 md:grid-cols-4">
            <label htmlFor="user-name" className="sr-only">Nombre completo</label>
            <input
              id="user-name"
              className="rounded-lg border p-3"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="user-username" className="sr-only">Usuario</label>
            <input
              id="user-username"
              className="rounded-lg border p-3"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="user-role" className="sr-only">Rol</label>
            <select
              id="user-role"
              className="rounded-lg border p-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Administrador</option>
              <option>Mesero</option>
              <option>Cocina</option>
            </select>

            <Button onClick={add}>Guardar usuario</Button>
          </div>
        </Card>
      )}

      <div className="mb-4">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Buscar usuario..."
        />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {["Nombre", "Usuario", "Rol", "Estado", "Acciones"].map(
                (h) => (
                  <th key={h} className="px-5 py-4">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {filtered.map(
              (u: {
                id: number;
                name: string;
                username: string;
                role: string;
                status: string;
              }) => (
                <tr key={u.id} className="border-t">
                  <td className="px-5 py-4 font-semibold">
                    {u.name}
                  </td>

                  <td className="px-5 py-4">{u.username}</td>
                  <td className="px-5 py-4">{u.role}</td>

                  <td className="px-5 py-4">
                    <StatusBadge status={u.status} />
                  </td>

                  <td className="px-5 py-4">
                    <Button
                      variant="danger"
                      onClick={() => {
                        const next = users.filter(
                          (x: { id: number }) => x.id !== u.id,
                        );

                        setUsers(next);
                        localStorage.setItem(
                          "dukes-users",
                          JSON.stringify(next),
                        );
                      }}
                    >
                      <Trash2 size={15} />
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function OrdersAdminPage() {
  const [orders] = useState<Order[]>(
    () =>
      JSON.parse(localStorage.getItem("dukes-orders") || "null") ||
      initialOrders,
  );

  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) =>
    `${o.id} ${o.waiter} ${o.status}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      <PageTitle
        title="Gestión de pedidos"
        subtitle="Consulta los pedidos para llevar y su estado."
      />

      <div className="mb-4">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Buscar por pedido o mesero..."
        />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {[
                "Pedido",
                "Tipo de pedido",
                "Mesero",
                "Hora",
                "Productos",
                "Estado",
                "Total",
              ].map((x) => (
                <th key={x} className="px-4 py-4">
                  {x}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-4 font-bold">
                  #{o.id}
                </td>

                <td className="px-4 py-4">Para llevar</td>

                <td className="px-4 py-4">{o.waiter}</td>

                <td className="px-4 py-4">{o.createdAt}</td>

                <td className="px-4 py-4">
                  {o.items.reduce((s, i) => s + i.qty, 0)}
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={o.status} />
                </td>

                <td className="px-4 py-4">
                  {money(
                    o.items.reduce(
                      (s, i) => s + i.qty * i.price,
                      0,
                    ),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function CashCutPage() {
  const [orders] = useState<Order[]>(
    () =>
      JSON.parse(localStorage.getItem("dukes-orders") || "null") ||
      initialOrders,
  );

  const [opening, setOpening] = useState("500");

  const paid = orders.filter(
    (o) => o.status === "Pagado" || o.paid,
  );

  const total = paid.reduce(
    (s, o) =>
      s + o.items.reduce((t, i) => t + i.qty * i.price, 0),
    0,
  );

  const pending = orders.filter(
    (o) => o.status !== "Pagado" && o.status !== "Entregado",
  );

  return (
    <>
      <PageTitle
        title="Corte de caja"
        subtitle="Resumen de movimientos para el corte de turno."
        action={
          <Button onClick={() => window.print()}>
            <Download size={17} />
            Imprimir corte
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="p-5">
          <label htmlFor="cash-opening" className="text-sm text-slate-500">Fondo inicial</label>

          <input
            id="cash-opening"
            type="number"
            className="mt-3 w-full rounded-xl border p-3 text-2xl font-bold"
            value={opening}
            onChange={(e) => setOpening(e.target.value)}
          />
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Ventas marcadas como pagadas
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-700">
            {money(total)}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Efectivo esperado (fondo + ventas pagadas)
          </p>

          <p className="mt-3 text-2xl font-bold">
            {money(Number(opening || 0) + total)}
          </p>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-bold">Resumen del turno</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Pedidos totales</p>
            <p className="mt-2 text-xl font-bold">
              {orders.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Pedidos pendientes
            </p>
            <p className="mt-2 text-xl font-bold">
              {pending.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Pagos registrados
            </p>
            <p className="mt-2 text-xl font-bold">
              {paid.length}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-amber-700">
          Demostración: este corte usa pedidos guardados en el navegador,
          no movimientos contables verificados.
        </p>
      </Card>
    </>
  );
}

export function ReportsPage() {
  const orders =
    (JSON.parse(localStorage.getItem("dukes-orders") || "null") as
      | Order[]
      | null) || initialOrders;

  const rows = [
    {
      label: "Pedidos registrados",
      value: String(orders.length),
    },
    {
      label: "Pendientes",
      value: String(
        orders.filter((o) => o.status === "Pendiente").length,
      ),
    },
    {
      label: "En preparación",
      value: String(
        orders.filter((o) => o.status === "En preparación").length,
      ),
    },
    {
      label: "Ventas estimadas de pedidos",
      value: money(
        orders.reduce(
          (s, o) =>
            s + o.items.reduce((t, i) => t + i.qty * i.price, 0),
          0,
        ),
      ),
    },
  ];

  return (
    <>
      <PageTitle
        title="Reportes"
        subtitle="Indicadores generales de operación (datos de muestra)."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <Card key={r.label} className="p-6">
            <p className="text-sm text-slate-500">{r.label}</p>
            <p className="mt-3 text-2xl font-bold">{r.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-bold">Actividad reciente</h2>

        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between gap-3 border-b pb-3 last:border-0"
            >
              <div>
                <p className="font-semibold">
                  Pedido #{o.id} · Para llevar
                </p>

                <p className="text-xs text-slate-500">
                  {o.createdAt} · {o.waiter}
                </p>
              </div>

              <StatusBadge status={o.status} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}