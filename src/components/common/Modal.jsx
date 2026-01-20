export default function Modal({ title, children, onClose }) {
  return (
    <div role="dialog" aria-modal="true" className="modalOverlay ui-fade-in">
      <div className="modalCard ui-pop">
        <div className="modalHeader">
          <h2 className="modalTitle">{title}</h2>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
