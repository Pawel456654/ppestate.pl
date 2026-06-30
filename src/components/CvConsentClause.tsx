"use client";

import { useState } from "react";

const CONSENT_TEXT =
  "Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w dokumentach aplikacyjnych przez PP ESTATE Sp. z o.o. z siedzibą we Wrocławiu (Aleja Kasztanowa 3A-5, 53-125 Wrocław) w celu przeprowadzenia procesu rekrutacji na stanowisko, na które aplikuję, zgodnie z rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych (RODO).";

export default function CvConsentClause() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CONSENT_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-8 p-6 sm:p-8 bg-white/80 border border-slate-200/80 rounded-2xl shadow-sm">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
        Klauzula do CV
      </h2>
      <p className="text-slate-600 leading-relaxed mb-4">
        Aby Twoja aplikacja mogła zostać rozpatrzona, umieść w CV poniższą zgodę na
        przetwarzanie danych osobowych. Skopiuj treść i wklej ją w dokumencie.
      </p>

      <div className="relative">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-4 text-sm text-slate-700 leading-relaxed">
          {CONSENT_TEXT}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Skopiowano
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Kopiuj treść
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-500 leading-relaxed">
        Więcej informacji o tym, jak przetwarzamy dane osobowe, znajdziesz w naszej{" "}
        <a href="/polityka-prywatnosci" className="text-primary hover:underline font-medium">
          Polityce Prywatności
        </a>{" "}
        oraz{" "}
        <a href="/rodo" className="text-primary hover:underline font-medium">
          Obowiązku informacyjnym (RODO)
        </a>
        .
      </p>
    </div>
  );
}
