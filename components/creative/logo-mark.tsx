/** Provisional Swift Market mark for the preview: two sheared layers on a Warm Red tile. */
export function LogoMark({ className }: Readonly<{ className?: string }>) {
  return (
    <svg className={className} viewBox="0 0 28 28" width="28" height="28" aria-hidden="true" focusable="false">
      <rect width="28" height="28" rx="8" fill="var(--brand-warm-red)" />
      <path d="M9.5 7.5h11l-2.2 5h-11zM9.7 15.5h11l-2.2 5h-11z" fill="var(--brand-outer-space)" />
    </svg>
  );
}
