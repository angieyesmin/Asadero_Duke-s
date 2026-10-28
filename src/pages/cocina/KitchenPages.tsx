import { useState } from "react";
import {
  ChefHat,
  Clock3,
  CheckCircle2,
  Flame,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  Button,
  PageTitle,
  StatusBadge,
} from "../../components/ui/Primitives";

import {
  initialOrders,
  type Order,
} from "../../data/demo";

// ======================================================
// LEER Y GUARDAR PEDIDOS
// ======================================================

function readOrders(): Order[] {
  return (
    JSON.parse(localStorage.getItem("dukes-orders") || "null") ||
    initialOrders
  );
}

function saveOrders(orders: Order[]) {
  localStorage.setItem("dukes-orders", JSON.stringify(orders));
}

// ======================================================
// PANEL PRINCIPAL DE COCINA
// ======================================================

export function KitchenDashboard() {
  const orders = readOrders();

  return (
    <>
      <PageTitle
        title="Panel de cocina"
        subtitle="Resumen de pedidos y actividad de preparación."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Modo demostración
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Pendientes",
            value: orders.filter(
              (o) => o.status === "Pendiente",
            ).length,
            icon: Clock3,
            color: "text-red-700 bg-red-50",
          },
          {
            label: "En preparación",
            value: orders.filter(
              (o) => o.status === "En preparación",
            ).length,
            icon: Flame,
            color: "text-orange-700 bg-orange-50",
          },
          {
            label: "Pedidos listos",
            value: orders.filter(
              (o) => o.status === "Listo",
            ).length,
            icon: CheckCircle2,
            color: "text-emerald-700 bg-emerald-50",
          },
          {
            label: "Total de pedidos",
            value: orders.length,
            icon: PackageCheck,
            color: "text-violet-700 bg-violet-50",
          },
        ].map((s) => {
          const Icon = s.icon;

          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                {s.label}

                <span className={`rounded-xl p-3 ${s.color}`}>
                  <Icon size={20} />
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold">
                {s.value}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {(
          ["Pendiente", "En preparación", "Listo"] as const
        ).map((status) => (
          <Card key={status} className="overflow-hidden">
            <div
              className={`flex items-center justify-between p-4 ${
                status === "Pendiente"
                  ? "bg-red-700"
                  : status === "En preparación"
                    ? "bg-orange-600"
                    : "bg-emerald-700"
              } text-white`}
            >
              <h2 className="font-bold">{status}</h2>

              <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                {
                  orders.filter(
                    (o) => o.status === status,
                  ).length
                }
              </span>
            </div>

            <div className="space-y-3 p-3">
              {orders
                .filter((o) => o.status === status)
                .map((o) => (
                  <div
                    key={o.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-lg font-bold">
                          Pedido #{o.id}
                        </p>

                        <p className="text-xs text-slate-500">
                          Pedido para llevar · {o.createdAt}
                        </p>
                      </div>

                      <StatusBadge status={o.status} />
                    </div>

                    <div className="my-3 space-y-2 border-y py-3">
                      {o.items.map((i) => (
                        <div
                          key={i.productId}
                          className="flex justify-between gap-2 text-sm"
                        >
                          <span>{i.name}</span>
                          <b>×{i.qty}</b>
                        </div>
                      ))}
                    </div>

                    {o.note && (
                      <p className="mb-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                        Observaciones: {o.note}
                      </p>
                    )}

                    <p className="text-xs text-slate-400">
                      Mesero: {o.waiter}
                    </p>
                  </div>
                ))}

              {orders.filter(
                (o) => o.status === status,
              ).length === 0 && (
                <p className="p-5 text-center text-sm text-slate-400">
                  No hay pedidos en esta etapa.
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

// ======================================================
// PEDIDOS DE COCINA
// ======================================================

export function KitchenOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(readOrders);
  const [notice, setNotice] = useState("");

  const update = (
    id: number,
    status: Order["status"],
  ) => {
    const next = orders.map((o) =>
      o.id === id ? { ...o, status } : o,
    );

    setOrders(next);
    saveOrders(next);

    setNotice(`Pedido #${id}: ${status}.`);
  };

  const stages: {
    title: string;
    status: Order["status"];
    next?: Order["status"];
    color: string;
    button?: string;
  }[] = [
    {
      title: "Pendientes",
      status: "Pendiente",
      next: "En preparación",
      color: "bg-red-700",
      button: "Comenzar preparación",
    },
    {
      title: "En preparación",
      status: "En preparación",
      next: "Listo",
      color: "bg-orange-600",
      button: "Marcar como listo",
    },
    {
      title: "Listos",
      status: "Listo",
      next: "Entregado",
      color: "bg-emerald-700",
      button: "Confirmar entrega",
    },
  ];

  return (
    <>
      <PageTitle
        title="Pedidos de cocina"
        subtitle="Actualiza el estado de preparación de cada pedido."
        action={
          <Button
            variant="secondary"
            onClick={() => {
              setOrders(readOrders());
              setNotice(
                "Lista actualizada desde los datos del navegador.",
              );
            }}
          >
            <RefreshCw size={16} />
            Actualizar
          </Button>
        }
      />

      {notice && (
        <p role="status" aria-live="polite" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          {notice}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        {stages.map((stage) => (
          <Card
            key={stage.status}
            className="overflow-hidden"
          >
            <div
              className={`${stage.color} flex items-center justify-between p-4 text-white`}
            >
              <h2 className="font-bold">{stage.title}</h2>

              <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                {
                  orders.filter(
                    (o) => o.status === stage.status,
                  ).length
                }
              </span>
            </div>

            <div className="space-y-3 p-3">
              {orders
                .filter(
                  (o) => o.status === stage.status,
                )
                .map((o) => (
                  <Card key={o.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold">
                          Pedido #{o.id}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Pedido para llevar · {o.createdAt}
                        </p>
                      </div>

                      <ChefHat className="text-slate-400" />
                    </div>

                    <div className="my-4 space-y-3 border-y py-3">
                      {o.items.map((i) => (
                        <div
                          key={i.productId}
                          className="flex justify-between gap-3 text-sm"
                        >
                          <span>{i.name}</span>

                          <span className="font-bold">
                            × {i.qty}
                          </span>
                        </div>
                      ))}
                    </div>

                    {o.note && (
                      <p className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                        Observaciones: {o.note}
                      </p>
                    )}

                    <p className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                      <Clock3 size={14} />
                      Recibido a las {o.createdAt}
                    </p>

                    {stage.next && (
                      <Button
                        className="w-full"
                        variant={
                          stage.status === "Listo"
                            ? "success"
                            : "primary"
                        }
                        onClick={() =>
                          update(o.id, stage.next!)
                        }
                      >
                        {stage.button}
                      </Button>
                    )}
                  </Card>
                ))}

              {orders.filter(
                (o) => o.status === stage.status,
              ).length === 0 && (
                <div className="p-8 text-center text-sm text-slate-400">
                  No hay pedidos aquí.
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}