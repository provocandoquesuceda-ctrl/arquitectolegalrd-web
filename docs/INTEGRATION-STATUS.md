# Integración del MVP — estado verificable

Rama: `feat/arquitectolegalrd-mvp-foundation`

## Código preparado
- Cliente Supabase SSR con cookies en `lib/supabase/server.ts`.
- `proxy.ts` refresca/verifica claims de sesión; rutas privadas vuelven a verificar identidad en servidor.
- Acciones de registro, inicio y cierre de sesión; callback para confirmar correo.
- Área privada con formulario de consulta e historial.
- OpenAI se invoca solo desde `app/api/consultations/route.ts`; la clave no usa prefijo público.
- Migración SQL con RLS y políticas de propiedad por `auth.uid()`.
- El historial se consulta y escribe con el cliente Supabase ligado a la sesión, no con una clave privilegiada.
- `vercel.json` declara framework Next.js y salida `.next`.

## Evidencia de compilación
- Vercel deployment `dpl_FN5gdBRzk2jpMRvkjzqLQYmfvNAQ`, commit `69960d6bc16e1b833714afaa54a0ebbd843bd281`: estado `READY`.
- Sus logs registran `next build` compilado con éxito, fase TypeScript finalizada y despliegue completado.
- El commit actual `5a8bed2ebcb65b116913d8399778389b494ff139` incluye una corrección adicional de URL canónica para la confirmación de correo y está `QUEUED`; por tanto, el build del HEAD actual todavía no está confirmado.
- No se ha completado una prueba interactiva de navegador ni un recorrido real de registro/login/consulta.

## Bloqueos externos pendientes
- El único proyecto Supabase visible figura como `INACTIVE`. No se reactivó ni se creó otro proyecto.
- La consulta de variables del proyecto Vercel `arquitectolegalrd-web` no devolvió variables configuradas.
- La preview anterior falló por configuración de salida estática `public`; el archivo `vercel.json` corrigió la configuración de compilación para el commit que quedó `READY`. Falta comprobar el HEAD más reciente.

## Requisitos para cerrar el gate de integración
1. Confirmar/reactivar el proyecto Supabase adecuado o aprobar uno nuevo si hace falta.
2. Aplicar la migración `supabase/migrations/202610170001_create_consultations.sql` al proyecto correcto.
3. Configurar URL, publishable key y URL canónica de Supabase/sitio, además de `OPENAI_API_KEY`, en el entorno Preview de Vercel. No compartir secretos por chat.
4. Verificar build del HEAD actual y probar registro, confirmación de correo, login, consulta, guardado y aislamiento del historial entre dos usuarios.

## Criterio de seguridad
Nunca utilizar una clave service-role/secret en el navegador. No autorizar solo con `getSession()`; usar claims verificados. No marcar como operativo hasta conservar evidencia reproducible de pruebas.
