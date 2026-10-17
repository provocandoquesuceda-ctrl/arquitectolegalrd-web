"use client";

import { useCallback, useEffect, useState } from "react";

type Consultation = { id: string; question: string; answer: string; created_at: string };

export default function ConsultationForm() {
  const [question, setQuestion] = useState("");
  const [items, setItems] = useState<Consultation[]>([]);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    const response = await fetch("/api/consultations", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    setItems(payload.consultations ?? []);
  }, []);

  useEffect(() => { void loadHistory(); }, [loadHistory]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setAnswer("");
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "No se pudo procesar la consulta.");
      setAnswer(payload.consultation.answer);
      setQuestion("");
      await loadHistory();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Error inesperado.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="workspace-grid">
      <section className="panel">
        <h2>Nueva consulta</h2>
        <form className="consultation-form" onSubmit={submit}>
          <label htmlFor="question">Describe tu pregunta jurídica</label>
          <textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} minLength={10} maxLength={8000} required rows={7} placeholder="Expón los hechos relevantes, la cuestión jurídica y cualquier plazo importante." />
          <p className="helper-text">No incluyas datos personales innecesarios ni información confidencial de terceros.</p>
          <button className="primary-button" type="submit" disabled={busy}>{busy ? "Procesando…" : "Consultar y guardar"}</button>
        </form>
        {error && <p className="form-message" role="alert">{error}</p>}
        {answer && <article className="answer-card"><h3>Respuesta preliminar</h3><p>{answer}</p><p className="helper-text">Verifica las normas y fuentes aplicables antes de utilizar esta respuesta como criterio profesional.</p></article>}
      </section>
      <section className="panel">
        <h2>Historial privado</h2>
        {items.length === 0 ? <p className="helper-text">Todavía no hay consultas guardadas.</p> : <ol className="history-list">{items.map((item) => <li key={item.id}><p className="history-date">{new Date(item.created_at).toLocaleString("es-DO")}</p><h3>{item.question}</h3><p>{item.answer}</p></li>)}</ol>}
      </section>
    </div>
  );
}
