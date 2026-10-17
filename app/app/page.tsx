import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "../auth/actions";
import ConsultationForm from "../components/consultation-form";

export default async function WorkspacePage() {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/login?error=config");
  }

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) redirect("/login");

  const { data: userData } = await supabase.auth.getUser();

  return (
    <main className="workspace-shell">
      <header className="workspace-topbar">
        <Link className="brand" href="/">ArquitectoLegal<span className="brand-accent">RD</span></Link>
        <form action={signOut}><button className="secondary-button" type="submit">Cerrar sesión</button></form>
      </header>
      <section className="workspace-intro">
        <p className="eyebrow">ESPACIO PRIVADO</p>
        <h1>Consultas jurídicas</h1>
        <p>Sesión iniciada{userData.user?.email ? ` como ${userData.user.email}` : ""}. Las respuestas de IA son apoyo informativo y requieren verificación jurídica.</p>
      </section>
      <ConsultationForm />
    </main>
  );
}
