# Asadero Duke's — Sistema de gestión de pedidos (prototipo frontend)

> **Equipo 5:** Ramírez Fuentes Valeria Del Carmen - Hernández García Adán Aristeo - González Flores Ricardo - Ferraez Peréz Angela Yesmin_
> **Asignatura:** Aplicaciones Web · Unidad 2 Frontend · Actividad Sumativa 2 (LITIID41)

Prototipo frontend navegable y responsivo, con datos ficticios y estado local. **No** usa backend, API ni base de datos; los datos de demostración se guardan solo en el `localStorage` del navegador.

## Problema
En un asadero con venta de pedidos para llevar, la comunicación entre quien toma el pedido, la cocina y la caja suele hacerse de forma verbal o en notas de papel. Esto puede provocar pedidos que se pierden o se preparan en desorden, dudas sobre el estado de cada pedido, errores al calcular el total o el cambio, y un corte de caja difícil de cuadrar al final del día.

Asadero Duke's propone un sistema web donde cada rol trabaja en su propia interfaz con la información que necesita:
- **Mesero:** registra el pedido con sus productos y observaciones, lo envía a cocina y lo cobra.
- **Cocina:** ve los pedidos pendientes y actualiza su estado (Pendiente, En preparación, Listo y Entregado).
- **Administrador:** consulta los pedidos, administra productos, categorías y usuarios, y revisa el corte de caja y los reportes.

El objetivo de esta etapa es un prototipo frontend navegable y responsivo que demuestre ese flujo con datos ficticios y estado local, sin backend, para validar las pantallas antes de conectar una API y una base de datos.

## Flujo seleccionado
Pedido para llevar: el mesero registra el pedido → cocina lo prepara (Pendiente → En preparación → Listo) → el mesero lo cobra (Pagado) → el administrador lo consulta y hace el corte de caja.

![Diagrama del flujo](docs/flujo-proceso.png)

**Reglas de negocio que cambian la interfaz**
- No se puede iniciar sesión con usuario o contraseña vacíos.
- No se puede enviar un pedido sin productos.
- Cocina avanza el estado en orden: Pendiente → En preparación → Listo → Entregado.
- Un pedido Pagado o Entregado ya no aparece en la lista de cobro.
- En efectivo, el monto recibido debe cubrir el total.

## Flujo del proceso

**Proceso:** Atención de pedidos para llevar en Asadero Duke's.

### Identificación del proceso

![Tabla de identificación del proceso](docs/tabla-1-identificacion.png)

### Roles

![Tabla de roles](docs/tabla-2-roles.png)

### Estados del pedido

![Tabla de estados del pedido](docs/tabla-3-estados.png)

## Interfaces
| Interfaz | Ruta | Usuario | Se conecta con |
|---|---|---|---|
| Acceso (selección de rol) | `/` | Todos | Inicio de sesión |
| Inicio de sesión | `/login/:role` | Todos | Dashboard del rol |
| Dashboard admin | `/admin` | Administrador | Pedidos, productos, categorías, usuarios, corte, reportes |
| Pedidos / Productos / Categorías / Usuarios / Corte de caja / Reportes | `/admin/...` | Administrador | Menú lateral |
| Dashboard mesero | `/mesero` | Mesero | Nuevo pedido, mis pedidos, cobrar |
| Nuevo pedido / Mis pedidos / Cobrar pedido | `/mesero/...` | Mesero | Menú lateral |
| Dashboard cocina | `/cocina` | Cocina | Pedidos |
| Pedidos de cocina | `/cocina/pedidos` | Cocina | Menú lateral |
| Configuración (placeholder) | `/{rol}/configuracion` | Todos | Menú lateral |

## Mapa de navegación
![Mapa de navegación](docs/mapa-navegacion.png)

Versión editable:

```mermaid
flowchart LR
  A[Acceso /] --> L[Login /login/:rol]
  L -->|Volver al inicio| A
  L --> D{Dashboard por rol}
  D --> ADM[/admin y subpáginas/]
  D --> MES[/mesero y subpáginas/]
  D --> COC[/cocina y subpáginas/]
  ADM -->|Cerrar sesión| A
  MES -->|Cerrar sesión| A
  COC -->|Cerrar sesión| A
```

## Capturas
### Bocetos de baja fidelidad
![Login](docs/mockups/01-login.png)
![Dashboard admin](docs/mockups/02-dashboard-admin.png)
![Nuevo pedido](docs/mockups/03-nuevo-pedido.png)
![Pedidos de cocina](docs/mockups/04-pedidos-cocina.png)
![Cobrar pedido](docs/mockups/05-cobrar-pedido.png)

### Capturas del prototipo
| Pantalla | 375 px | 768 px | 1280 px |
|---|---|---|---|
| Login | ![](docs/capturas/login-375.png) | ![](docs/capturas/login-768.png) | ![](docs/capturas/login-1280.png) |
| Dashboard admin | ![](docs/capturas/admin-375.png) | ![](docs/capturas/admin-768.png) | ![](docs/capturas/admin-1280.png) |
| Nuevo pedido | ![](docs/capturas/nuevo-pedido-375.png) | ![](docs/capturas/nuevo-pedido-768.png) | ![](docs/capturas/nuevo-pedido-1280.png) |
| Pedidos de cocina | ![](docs/capturas/cocina-375.png) | ![](docs/capturas/cocina-768.png) | ![](docs/capturas/cocina-1280.png) |
| Cobrar pedido | ![](docs/capturas/cobrar-375.png) | ![](docs/capturas/cobrar-768.png) | ![](docs/capturas/cobrar-1280.png) |

## Tecnologías
React 19, TypeScript, Vite, Tailwind CSS 4, React Router, lucide-react.

## Estructura
```
docs/         flujo-proceso.png, mapa-navegacion.png, mockups/
src/
├── components/   layout/AppShell.tsx, ui/Primitives.tsx
├── context/      AuthContext.tsx (sesión simulada)
├── data/         demo.ts (datos ficticios)
├── pages/        admin/, auth/, mesero/, cocina/
├── App.tsx       rutas
└── index.css     Tailwind y estilos globales
```

## Instalación y ejecución
```bash
git clone <https://github.com/angieyesmin/Asadero_Duke-s.git>
cd Asadero_Duke-s-main
npm install
npm run dev
```
Para compilar: `npm run build`. Acceso de demostración: cualquier usuario y contraseña no vacíos.
