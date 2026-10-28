# Asadero Duke's — Sistema de gestión de pedidos (prototipo frontend)

> **Equipo 5:**: Ramírez Fuentes Valeria Del Carmen - Hernández García Adán Aristeo - González Flores Ricardo - Ferraez Peréz Angela Yesmin_
> **Asignatura:** Aplicaciones Web · Unidad 2 Frontend · Actividad Sumativa 2 (LITIID41)

Prototipo frontend navegable y responsivo, con datos ficticios y estado local. **No** usa backend, API ni base de datos; los datos de demostración se guardan solo en el `localStorage` del navegador.

## Problema
_(PENDIENTE: describir el problema del negocio que resuelve el sistema.)_

## Flujo seleccionado
Pedido para llevar: el mesero registra el pedido → cocina lo prepara (Pendiente → En preparación → Listo) → el mesero lo cobra (Pagado) → el administrador lo consulta y hace el corte de caja.

![Diagrama del flujo](docs/flujo-proceso.png)

**Reglas de negocio que cambian la interfaz**
- No se puede iniciar sesión con usuario o contraseña vacíos.
- No se puede enviar un pedido sin productos.
- Cocina avanza el estado en orden: Pendiente → En preparación → Listo → Entregado.
- Un pedido Pagado o Entregado ya no aparece en la lista de cobro.
- En efectivo, el monto recibido debe cubrir el total.

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
_(PENDIENTE: agregar capturas en `docs/capturas/` a 375, 768 y 1280 px.)_

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
