"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function signIn(formData: FormData) {
  const email = field(formData, "email");
  const password = field(formData, "password");
  if (!email || !password) redirect("/login?error=missing");

  let client;
  try {
    client = await createClient();
  } catch {
    redirect("/login?error=config");
  }

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=credentials");
  redirect("/app");
}

export async function signUp(formData: FormData) {
  const email = field(formData, "email");
  const password = field(formData, "password");
  if (!email || password.length < 10) redirect("/register?error=validation");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) redirect("/register?error=config");

  let client;
  try {
    client = await createClient();
  } catch {
    redirect("/register?error=config");
  }

  let emailRedirectTo: string;
  try {
    emailRedirectTo = new URL("/auth/callback?next=/app", siteUrl).toString();
  } catch {
    redirect("/register?error=config");
  }

  const { error } = await client.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });

  if (error) redirect("/register?error=signup");
  redirect("/login?message=check-email");
}

export async function signOut() {
  const client = await createClient();
  await client.auth.signOut();
  redirect("/login");
}
