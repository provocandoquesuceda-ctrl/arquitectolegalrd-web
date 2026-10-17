import OpenAI from "openai";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const systemInstructions = `Eres un asistente de apoyo jurídico para la República Dominicana. Responde en español con estructura clara. Distingue hechos aportados, información general y análisis preliminar. No inventes leyes, artículos, sentencias, citas ni enlaces. Si no puedes verificar una fuente primaria, dilo expresamente y solicita comprobación en fuentes oficiales dominicanas. Expón incertidumbres, jurisdicción y posibles plazos relevantes; no te presentes como abogado del usuario ni afirmes que la respuesta sustituye una revisión profesional.`;

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return { response: NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 }) };
  return { supabase, userId };
}

export async function GET() {
  let auth;
  try {
    auth = await authenticatedClient();
  } catch {
    return NextResponse.json({ error: "Supabase no está configurado." }, { status: 503 });
  }
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("consultations")
    .select("id, question, answer, created_at")
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: "No se pudo recuperar el historial." }, { status: 500 });
  return NextResponse.json({ consultations: data ?? [] });
}

export async function POST(request: NextRequest) {
  let auth;
  try {
    auth = await authenticatedClient();
  } catch {
    return NextResponse.json({ error: "Supabase no está configurado." }, { status: 503 });
  }
  if ("response" in auth) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo debe ser JSON válido." }, { status: 400 });
  }
  const question = typeof body === "object" && body !== null && "question" in body && typeof body.question === "string"
    ? body.question.trim()
    : "";
  if (question.length < 10 || question.length > 8000) {
    return NextResponse.json({ error: "La consulta debe tener entre 10 y 8000 caracteres." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OpenAI no está configurado en este entorno." }, { status: 503 });

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: systemInstructions,
      input: question,
    });
    const answer = completion.output_text?.trim();
    if (!answer) return NextResponse.json({ error: "El modelo no devolvió una respuesta utilizable." }, { status: 502 });

    const { data, error } = await auth.supabase
      .from("consultations")
      .insert({ user_id: auth.userId, question, answer, model: "gpt-4.1-mini" })
      .select("id, question, answer, created_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "La respuesta se generó, pero no se pudo guardar en el historial." }, { status: 500 });
    }
    return NextResponse.json({ consultation: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo completar la consulta. Inténtalo de nuevo." }, { status: 502 });
  }
}
