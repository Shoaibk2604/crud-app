export default function Modal({ title, children, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 animate-[ui-fade-in_160ms_ease-out]"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-[ui-pop_180ms_cubic-bezier(0.2,0.9,0.2,1)]">
        <div className="flex items-center justify-between gap-4 px-4 pt-4">
          <h2 className="m-0 text-lg font-extrabold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-px focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            ✕
          </button>
        </div>
        <div className="px-4 pb-4 pt-3">{children}</div>
      </div>
    </div>
  );
}
