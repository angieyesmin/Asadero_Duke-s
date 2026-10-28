import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth, type Role } from "./context/AuthContext";
import { AppShell } from "./components/layout/AppShell";
import Access from "./pages/auth/Access";
import Login from "./pages/auth/Login";

import {
  AdminDashboard,
  ProductsPage,
  CategoriesPage,
  UsersPage,
  OrdersAdminPage,
  CashCutPage,
  ReportsPage,
} from "./pages/admin/AdminPages";

import {
  WaiterDashboard,
  NewOrderPage,
  MyOrdersPage,
  ChargeOrderPage,
} from "./pages/mesero/WaiterPages";

import {
  KitchenDashboard,
  KitchenOrdersPage,
} from "./pages/cocina/KitchenPages";

function Protected({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={`/login/${role}`} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
}

function Page({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return (
    <Protected role={role}>
      <AppShell role={role}>{children}</AppShell>
    </Protected>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <h1 className="text-2xl font-bold">{title}</h1>

      <p className="mt-2 text-slate-500">
        Esta sección queda preparada para conectarse con el backend.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Acceso y login */}
      <Route path="/" element={<Access />} />

      <Route path="/login/:role" element={<Login />} />

      {/* Panel de administración */}
      <Route
        path="/admin"
        element={
          <Page role="admin">
            <AdminDashboard />
          </Page>
        }
      />

      <Route
        path="/admin/productos"
        element={
          <Page role="admin">
            <ProductsPage />
          </Page>
        }
      />

      <Route
        path="/admin/categorias"
        element={
          <Page role="admin">
            <CategoriesPage />
          </Page>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <Page role="admin">
            <UsersPage />
          </Page>
        }
      />

      <Route
        path="/admin/pedidos"
        element={
          <Page role="admin">
            <OrdersAdminPage />
          </Page>
        }
      />

      <Route
        path="/admin/corte-caja"
        element={
          <Page role="admin">
            <CashCutPage />
          </Page>
        }
      />

      <Route
        path="/admin/reportes"
        element={
          <Page role="admin">
            <ReportsPage />
          </Page>
        }
      />

      <Route
        path="/admin/configuracion"
        element={
          <Page role="admin">
            <Placeholder title="Configuración del sistema" />
          </Page>
        }
      />

      {/* Panel del mesero */}
      <Route
        path="/mesero"
        element={
          <Page role="mesero">
            <WaiterDashboard />
          </Page>
        }
      />

      <Route
        path="/mesero/nuevo-pedido"
        element={
          <Page role="mesero">
            <NewOrderPage />
          </Page>
        }
      />

      <Route
        path="/mesero/mis-pedidos"
        element={
          <Page role="mesero">
            <MyOrdersPage />
          </Page>
        }
      />

      <Route
        path="/mesero/cobrar"
        element={
          <Page role="mesero">
            <ChargeOrderPage />
          </Page>
        }
      />

      <Route
        path="/mesero/configuracion"
        element={
          <Page role="mesero">
            <Placeholder title="Configuración del mesero" />
          </Page>
        }
      />

      {/* Panel de cocina */}
      <Route
        path="/cocina"
        element={
          <Page role="cocina">
            <KitchenDashboard />
          </Page>
        }
      />

      <Route
        path="/cocina/pedidos"
        element={
          <Page role="cocina">
            <KitchenOrdersPage />
          </Page>
        }
      />

      <Route
        path="/cocina/configuracion"
        element={
          <Page role="cocina">
            <Placeholder title="Configuración de cocina" />
          </Page>
        }
      />

      {/* Ruta no encontrada */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}