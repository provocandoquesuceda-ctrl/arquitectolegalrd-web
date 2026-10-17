import Link from "next/link";
import { signUp } from "../auth/actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const message = params.error === "config"
    ? "La autenticación aún no está configurada en este entorno."
    : params.error === "validation"
      ? "Introduce un correo válido y una contraseña de al menos 10 caracteres."
      : params.error === "signup"
        ? "No se pudo crear la cuenta. Revisa la configuración de Auth y vuelve a intentarlo."
        : "";
  return (
    <main className="auth-shell">
      <Link className="brand" href="/">ArquitectoLegal<span className="brand-accent">RD</span></Link>
      <section className="auth-card">
        <p className="eyebrow">CUENTA PERSONAL</p>
        <h1>Crea tu cuenta</h1>
        <p>Tu historial se asociará a tu cuenta y quedará protegido por políticas de acceso.</p>
        {message && <p className="form-message" role="alert">{message}</p>}
        <form action={signUp} className="auth-form">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Contraseña (mínimo 10 caracteres)</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required />
          <button className="primary-button" type="submit">Crear cuenta</button>
        </form>
        <p className="auth-switch">¿Ya tienes cuenta? <Link href="/login">Iniciar sesión</Link></p>
      </section>
    </main>
  );
}
