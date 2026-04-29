import React from 'react';
import AlertBanner from '../shared/AlertBanner';

type Severity = 'safe' | 'warning' | 'danger';

interface InteractionResultCardProps {
  severity: Severity;
  medicines: string[];
  summary: string;
  effect?: string;
  recommendation?: string;
}

export default function InteractionResultCard({
  severity,
  medicines,
  summary,
  effect,
  recommendation,
}: InteractionResultCardProps) {
  const tone = severity === 'safe' ? 'success' : severity === 'warning' ? 'warning' : 'danger';
  const title =
    severity === 'safe'
      ? 'No interaction was found in this demo database. This does not confirm medical safety. Please consult a qualified healthcare professional.'
      : severity === 'warning'
      ? 'Possible interaction detected'
      : 'Major interaction detected';

  return (
    <div className="space-y-4">
      <AlertBanner tone={tone} title={title} message={summary} />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {medicines.map((medicine, index) => (
            <React.Fragment key={medicine}>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {medicine}
              </span>
              {index < medicines.length - 1 ? (
                <span className="text-slate-400">+</span>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        {effect ? (
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-800">Interaction Effect</p>
            <p className="mt-1 text-sm text-slate-600">{effect}</p>
          </div>
        ) : null}

        {recommendation ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Recommendation</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{recommendation}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}