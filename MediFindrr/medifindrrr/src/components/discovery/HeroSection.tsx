import React, { ReactNode } from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  children,
  footer,
}: HeroSectionProps) {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-blue-50 via-sky-50 to-white px-6 py-12 shadow-sm sm:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          {subtitle}
        </p>

        {children ? <div className="mx-auto mt-8 max-w-2xl">{children}</div> : null}
        {footer ? <div className="mt-8">{footer}</div> : null}
      </div>
    </section>
  );
}