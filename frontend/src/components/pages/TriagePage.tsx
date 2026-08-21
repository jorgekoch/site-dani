import { FormEvent, useState } from "react";
import { submitTriage, TriageSubmission } from "../../api/triageApi";
import { formatWhatsapp } from "../../utils/formatWhatsapp";
import "./TriagePage.css";

const conditions = [
  "Colesterol elevado",
  "Diabético",
  "Hipertenso",
  "Cardiopata",
  "Uso de marcapasso",
  "Tabagista",
  "Trombose Venosa Profunda",
  "Infecções ou doenças de pele",
  "Arritmia, descompensação e/ou insuficiência cardíaca",
  "Gestante",
  "Qualquer tipo de câncer",
  "Insuficiência renal/hepática",
  "Nenhuma informação complementar",
];
const initialForm: TriageSubmission = {
  fullName: "",
  age: 0,
  profession: "",
  whatsapp: "",
  treatmentReason: "INJURY_RECOVERY",
  injuryDescription: "",
  injuryDuration: "",
  medicalReferral: false,
  medicalDiagnosis: "",
  mainComplaint: "",
  painLocation: "",
  painRadiates: false,
  painRadiatesWhere: "",
  painLevel: 1,
  physicalActivity: false,
  physicalActivityType: "",
  sportsInjury: false,
  sportsInjuryDetails: "",
  complementaryExams: false,
  complementaryExamsDetails: "",
  surgery: false,
  surgeryDetails: "",
  metalImplant: false,
  metalImplantLocation: "",
  medication: false,
  medicationDetails: "",
  healthConditions: [],
  additionalHealthInfo: "",
  consentAccepted: false,
};

export function TriagePage() {
  const [form, setForm] = useState(initialForm),
    [submitting, setSubmitting] = useState(false),
    [success, setSuccess] = useState(false),
    [error, setError] = useState("");
  const update = <K extends keyof TriageSubmission>(
    key: K,
    value: TriageSubmission[K],
  ) => setForm((current) => ({ ...current, [key]: value }));
  const toggle = (value: string) =>
    update(
      "healthConditions",
      value === "Nenhuma informação complementar"
        ? [value]
        : [
            ...form.healthConditions.filter(
              (x) => x !== "Nenhuma informação complementar",
            ),
            ...(form.healthConditions.includes(value) ? [] : [value]),
          ],
    );
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.consentAccepted) {
      setError("É necessário aceitar o consentimento para enviar a ficha.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitTriage(form);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível enviar a ficha.",
      );
    } finally {
      setSubmitting(false);
    }
  }
  if (success)
    return (
      <main className="triage-page">
        <section className="triage-success">
          <span className="triage-eyebrow">Ficha recebida</span>
          <h1>Obrigado por preencher sua avaliação.</h1>
          <p>
            Suas informações foram enviadas com segurança. A equipe irá analisar
            sua ficha e entrar em contato pelo WhatsApp para orientar os
            próximos passos.
          </p>
          <a className="triage-button" href="https://wa.me/5541998837462">
            Falar pelo WhatsApp
          </a>
        </section>
      </main>
    );
  return (
    <main className="triage-page">
      <div className="triage-intro">
        <span className="triage-eyebrow">Ficha de avaliação</span>
        <h1>Vamos entender melhor o que você precisa.</h1>
        <p>
          Esta ficha de avaliação prévia nos ajuda a conhecer sua queixa e
          preparar um atendimento mais rápido e efetivo.
        </p>
        <p>
          <strong>
            Responda com sinceridade e explique em detalhes o que for
            necessário.
          </strong>{" "}
          Se sua dor for muito intensa, entre em contato pelo WhatsApp após
          preencher.
        </p>
      </div>
      <form className="triage-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>1 · Seus dados</legend>
          <div className="triage-grid">
            <label>
              Nome completo *
              <input
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
            </label>
            <label>
              Idade *
              <input
                required
                type="number"
                min="1"
                max="120"
                value={form.age || ""}
                onChange={(e) => update("age", Number(e.target.value))}
              />
            </label>
            <label>
              Profissão *
              <input
                required
                value={form.profession}
                onChange={(e) => update("profession", e.target.value)}
              />
            </label>
            <label>
              Telefone para contato (WhatsApp) *
              <input
                required
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="(41) 99999-9999"
                maxLength={15}
                value={formatWhatsapp(form.whatsapp)}
                onChange={(e) =>
                  update(
                    "whatsapp",
                    e.target.value.replace(/\D/g, "").slice(0, 11),
                  )
                }
              />
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>2 · Sobre sua dor</legend>
          <div className="triage-stack">
            <label>
              Seu atendimento será para *
              <select
                value={form.treatmentReason}
                onChange={(e) =>
                  update(
                    "treatmentReason",
                    e.target.value as TriageSubmission["treatmentReason"],
                  )
                }
              >
                <option value="INJURY_RECOVERY">Recuperação de lesão</option>
                <option value="HEALTH_MAINTENANCE">Manutenção da saúde</option>
              </select>
            </label>
            <label>
              Qual é sua queixa principal ou necessidade? *
              <textarea
                required
                value={form.mainComplaint}
                onChange={(e) => update("mainComplaint", e.target.value)}
              />
            </label>
            <label>
              Qual é o local da dor/procedimento? *
              <input
                required
                value={form.painLocation}
                onChange={(e) => update("painLocation", e.target.value)}
              />
            </label>
            <Question
              label="A dor irradia para outro lugar?"
              value={form.painRadiates ?? false}
              onChange={(v) => update("painRadiates", v)}
            />
            {form.painRadiates && (
              <label>
                Se sim, onde?
                <input
                  value={form.painRadiatesWhere}
                  onChange={(e) => update("painRadiatesWhere", e.target.value)}
                />
              </label>
            )}
            <label>
              Nível da dor: <strong>{form.painLevel}/10</strong>
              <input
                type="range"
                min="1"
                max="10"
                value={form.painLevel}
                onChange={(e) => update("painLevel", Number(e.target.value))}
              />
            </label>
            <label>
              Se é por lesão, conte brevemente como ela aconteceu.
              <textarea
                value={form.injuryDescription}
                onChange={(e) => update("injuryDescription", e.target.value)}
              />
            </label>
            <label>
              Há quanto tempo lida com ela?
              <input
                value={form.injuryDuration}
                onChange={(e) => update("injuryDuration", e.target.value)}
              />
            </label>
            <Question
              label="Tem encaminhamento médico? *"
              value={form.medicalReferral}
              onChange={(v) => update("medicalReferral", v)}
            />
            {form.medicalReferral && (
              <label>
                Qual é o diagnóstico médico?
                <input
                  value={form.medicalDiagnosis}
                  onChange={(e) => update("medicalDiagnosis", e.target.value)}
                />
              </label>
            )}
          </div>
        </fieldset>
        <fieldset>
          <legend>3 · Sua condição atual</legend>
          <div className="triage-stack">
            <Question
              label="Realiza alguma atividade física?"
              value={form.physicalActivity}
              onChange={(v) => update("physicalActivity", v)}
            />
            {form.physicalActivity && (
              <label>
                Se sim, qual?
                <input
                  value={form.physicalActivityType}
                  onChange={(e) =>
                    update("physicalActivityType", e.target.value)
                  }
                />
              </label>
            )}
            <Question
              label="Já teve lesões no esporte?"
              value={form.sportsInjury ?? false}
              onChange={(v) => update("sportsInjury", v)}
            />
            {form.sportsInjury && (
              <label>
                Se sim, quais?
                <textarea
                  value={form.sportsInjuryDetails}
                  onChange={(e) =>
                    update("sportsInjuryDetails", e.target.value)
                  }
                />
              </label>
            )}
            <Question
              label="Já realizou exames complementares?"
              value={form.complementaryExams}
              onChange={(v) => update("complementaryExams", v)}
            />
            {form.complementaryExams && (
              <label>
                Se sim, qual?
                <input
                  value={form.complementaryExamsDetails}
                  onChange={(e) =>
                    update("complementaryExamsDetails", e.target.value)
                  }
                />
              </label>
            )}
            <Question
              label="Fez alguma cirurgia?"
              value={form.surgery}
              onChange={(v) => update("surgery", v)}
            />
            {form.surgery && (
              <label>
                Se sim, qual?
                <input
                  value={form.surgeryDetails}
                  onChange={(e) => update("surgeryDetails", e.target.value)}
                />
              </label>
            )}
            <Question
              label="Usa implante metálico?"
              value={form.metalImplant}
              onChange={(v) => update("metalImplant", v)}
            />
            {form.metalImplant && (
              <label>
                Se sim, onde?
                <input
                  value={form.metalImplantLocation}
                  onChange={(e) =>
                    update("metalImplantLocation", e.target.value)
                  }
                />
              </label>
            )}
            <Question
              label="Faz uso de medicamento?"
              value={form.medication}
              onChange={(v) => update("medication", v)}
            />
            {form.medication && (
              <label>
                Se sim, qual?
                <input
                  value={form.medicationDetails}
                  onChange={(e) => update("medicationDetails", e.target.value)}
                />
              </label>
            )}
          </div>
        </fieldset>
        <fieldset>
          <legend>4 · Informações complementares de saúde</legend>
          <div className="condition-list">
            {conditions.map((condition) => (
              <label key={condition}>
                <input
                  type="checkbox"
                  checked={form.healthConditions.includes(condition)}
                  onChange={() => toggle(condition)}
                />
                {condition}
              </label>
            ))}
          </div>
          <label className="additional-health">
            Outras informações importantes
            <textarea
              value={form.additionalHealthInfo}
              onChange={(e) => update("additionalHealthInfo", e.target.value)}
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>5 · Consentimento</legend>
          <label className="consent">
            <input
              required
              type="checkbox"
              checked={form.consentAccepted}
              onChange={(e) => update("consentAccepted", e.target.checked)}
            />
            Declaro que as informações fornecidas são verdadeiras e autorizo seu
            uso para fins de triagem e preparação do atendimento. *
          </label>
        </fieldset>
        {error && (
          <p className="triage-error" role="alert">
            {error}
          </p>
        )}
        <button className="triage-submit" disabled={submitting}>
          {submitting ? "Enviando ficha…" : "Enviar ficha de avaliação"}
        </button>
      </form>
    </main>
  );
}
function Question({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="triage-choice">
      <span>{label}</span>
      <div>
        <button
          type="button"
          className={value ? "selected" : ""}
          onClick={() => onChange(true)}
        >
          Sim
        </button>
        <button
          type="button"
          className={!value ? "selected" : ""}
          onClick={() => onChange(false)}
        >
          Não
        </button>
      </div>
    </div>
  );
}
