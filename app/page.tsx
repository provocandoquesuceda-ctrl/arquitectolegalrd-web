const capabilities = [
  {
    number: "01",
    title: "Consulta jurídica",
    description:
      "Prepara preguntas jurídicas y recibe orientación estructurada, con límites y fuentes por verificar claramente identificados.",
  },
  {
    number: "02",
    title: "Historial privado",
    description:
      "Consulta tus conversaciones guardadas cuando la autenticación y la persistencia estén integradas y verificadas.",
  },
  {
    number: "03",
    title: "Marco dominicano",
    description:
      "Diseñado para priorizar la legislación y jurisprudencia de la República Dominicana, sin presentar información no verificada como derecho vigente.",
  },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="ArquitectoLegalRD inicio">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>ArquitectoLegal<span className="brand-accent">RD</span></span>
        </a>
        <span className="status-pill"><span className="status-dot" /> Base de MVP en preparación</span>
      </header>

      <section className="hero">
        <p className="eyebrow">TECNOLOGÍA JURÍDICA · REPÚBLICA DOMINICANA</p>
        <h1>Claridad jurídica.<br /><span>Tecnología con criterio.</span></h1>
        <p className="hero-copy">
          Una base de trabajo para organizar consultas jurídicas, desarrollar
          respuestas asistidas por IA y mantener trazabilidad. La información
          generada deberá verificarse antes de tomar decisiones legales.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#capacidades">Explorar la plataforma <span aria-hidden="true">↗</span></a>
          <span className="helper-text">Versión inicial · Funciones en desarrollo</span>
        </div>
        <div className="trust-line">
          <span aria-hidden="true">◇</span> Enfoque dominicano
          <span className="trust-separator">·</span>
          <span aria-hidden="true">◇</span> Privacidad por diseño
          <span className="trust-separator">·</span>
          <span aria-hidden="true">◇</span> Evidencia verificable
        </div>
      </section>

      <section className="capabilities" id="capacidades">
        <div className="section-heading">
          <p className="eyebrow">FUNDACIÓN DEL MVP</p>
          <h2>Una plataforma construida sobre evidencia.</h2>
          <p>Estas son las capacidades objetivo; solo se marcarán como operativas después de integrar y superar sus pruebas.</p>
        </div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <article className="capability-card" key={item.number}>
              <span className="card-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="card-state">Pendiente de integración</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>ArquitectoLegalRD</span>
        <span>Compromiso jurídico, innovación y confianza.</span>
      </footer>
    </main>
  );
}
