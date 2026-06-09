# 🏥 LaNostraSalut

Agenda médica familiar compartida. PWA de una sola página para coordinar citas médicas de varios pacientes entre varios familiares, con sincronización en tiempo real vía Supabase.

---

## ¿Qué hace?

- **Agenda compartida** entre todos los familiares con citas de todos los pacientes
- **Filtros por persona** y vista de citas pasadas
- **Vista calendario** mensual con navegación
- **Asignación de acompañante** por cita con un toque ("M'apunto")
- **Notas pre y post visita** por cita
- **Sincronización en tiempo real** — cualquier cambio aparece al instante en todos los dispositivos
- **Sin instalación** — funciona en el navegador del móvil, se puede añadir a pantalla de inicio como app

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | HTML + JS vanilla, una sola página |
| Base de datos | [Supabase](https://supabase.com) (free tier) |
| Hosting | GitHub Pages |
| Fuentes | Bricolage Grotesque + DM Mono (Google Fonts) |

---

## Configuración inicial (solo una vez)

### 1. Supabase — crear la tabla

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el SQL de abajo
3. Copia la **Project URL** y la **Anon Key** (Settings → API)

```sql
create table if not exists appointments (
  id uuid default gen_random_uuid() primary key,
  relative text not null,
  date date not null,
  time text,
  coverage text default 'lameva',
  specialty text, doctor text, center text,
  notes_pre text, companion text,
  status text default 'pendent',
  notes_post text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter publication supabase_realtime add table appointments;
alter table appointments enable row level security;
create policy "open" on appointments
  for all using (true) with check (true);
```

### 2. Editar `index.html`

Al principio del bloque `<script>`, edita las tres constantes:

```javascript
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_KEY = 'eyJh...TU-ANON-KEY';
const SIBLINGS     = ['Nom1', 'Nom2', 'Nom3', 'Nom4', 'Nom5'];
```

### 3. Compartir con la familia

Envía el archivo `index.html` por WhatsApp o email. Cada familiar:
1. Abre el archivo en Chrome
2. Toca su nombre en la pantalla de bienvenida
3. Listo — ya ve todas las citas en tiempo real

Para añadirlo a la pantalla de inicio: Chrome → menú (⋮) → *Añadir a pantalla de inicio*

---

## Estructura del proyecto

```
LaNostraSalut/
├── index.html      # App completa (HTML + CSS + JS en un solo archivo)
├── README.md       # Este archivo
├── .gitignore
└── CHANGELOG.md    # Historial de cambios
```

---

## ⚠️ Seguridad

El archivo `index.html` contiene las credenciales de Supabase hardcodeadas. Esto es intencional para facilitar el acceso sin configuración a los familiares no técnicos.

- La **Anon Key** de Supabase está diseñada para ser cliente-side y es pública por naturaleza
- La seguridad de los datos la provee la política RLS de Supabase (`open for all`)
- **Si usas un repositorio público en GitHub**, las credenciales serán visibles — aceptable para una app familiar con datos médicos no críticos, pero tenlo en cuenta

**Recomendación**: usar repositorio **privado** en GitHub para mayor seguridad.

---

## Desarrollo

Para actualizar la app, edita `index.html` localmente y haz push. GitHub Pages publica los cambios automáticamente en minutos.

```bash
git add index.html
git commit -m "descripción del cambio"
git push
```

---

## Historial

Ver [CHANGELOG.md](CHANGELOG.md)
