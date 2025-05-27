import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

function ModaleConferma({ show, onConferma, onClose, messaggio }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const modalEl = modalRef.current;
    if (modalEl && show) {
      const bsModal = new Modal(modalEl);
      bsModal.show();

      const handleHidden = () => {
        onClose();
      };

      modalEl.addEventListener("hidden.bs.modal", handleHidden);

      return () => {
        modalEl.removeEventListener("hidden.bs.modal", handleHidden);
      };
    }
  }, [show, onClose]);

  const handleConferma = () => {
    onConferma();
    const modal = Modal.getInstance(modalRef.current);
    modal.hide();
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={modalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Conferma azione</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
          </div>
          <div className="modal-body">
            <p>{messaggio}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Annulla
            </button>
            <button type="button" className="btn btn-danger" onClick={handleConferma}>
              Conferma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModaleConferma;
