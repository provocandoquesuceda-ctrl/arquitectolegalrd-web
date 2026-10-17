import Link from "next/link";
import { signIn } from "../auth/actions";

const messages: Record<string, string> = {
  missing: "Introduce tu correo y contraseña.",
  config: "La autenticación aún no está configurada en este entorno.",
  credentials: "No se pudo iniciar sesión. Revisa tus credenciales.",
  callback: "No se pudo completar la verificación del correo.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-shell">
      <Link className="brand" href="/">ArquitectoLegal<span className="brand-accent">RD</span></Link>
      <section className="auth-card">
        <p className="eyebrow">ACCESO SEGURO</p>
        <h1>Inicia sesión</h1>
        <p>Accede a tus consultas y al historial privado.</p>
        {params.error && <p className="form-message" role="alert">{messages[params.error] ?? "No se pudo completar la operación."}</p>}
        {params.message === "check-email" && <p className="form-message">Si la confirmación por correo está activada, revisa tu bandeja para completar el registro.</p>}
        <form action={signIn} className="auth-form">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <button className="primary-button" type="submit">Iniciar sesión</button>
        </form>
        <p className="auth-switch">¿Primera vez aquí? <Link href="/register">Crear cuenta</Link></p>
      </section>
    </main>
  );
}
