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

## Bloqueos externos pendientes
- El proyecto Supabase disponible figura como INACTIVE. No se reactivó ni se creó otro proyecto.
- La consulta de variables del proyecto Vercel `arquitectolegalrd-web` no devolvió variables configuradas.
- Las previews revisadas fallaron por configuración de salida estática `public`; se añadió `vercel.json` para declarar Next.js y `.next`, pero la siguiente preview debe demostrar si prevalece sobre la configuración del dashboard.
- No se ejecutaron build, typecheck, pruebas de navegador ni prueba real de Auth/OpenAI/DB en este entorno.

## Requisitos para cerrar el gate de integración
1. Confirmar/reactivar el proyecto Supabase adecuado o aprobar uno nuevo si hace falta.
2. Aplicar la migración `supabase/migrations/202610170001_create_consultations.sql` al proyecto correcto.
3. Configurar URL y publishable key de Supabase, además de `OPENAI_API_KEY`, en el entorno Preview de Vercel. No compartir secretos por chat.
4. Confirmar que el proyecto Vercel utiliza el framework Next.js y que el build command/output directory no fuerzan un sitio estático.
5. Verificar build, typecheck, registro, confirmación de correo, login, consulta, guardado y aislamiento del historial entre dos usuarios.

## Criterio de seguridad
Nunca utilizar una clave service-role/secret en el navegador. No autorizar solo con `getSession()`; usar claims verificados. No marcar como operativo hasta conservar evidencia reproducible de pruebas.
