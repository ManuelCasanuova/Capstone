import { useState } from "react";
import { useAuth } from "../access/AuthContext";

function ModaleComunicazione({ comunicazione, onClose, onSave }) {
  const { token } = useAuth();
  const [oggetto, setOggetto] = useState(comunicazione?.oggetto || "");
  const [testo, setTesto] = useState(comunicazione?.testo || "");
  const apiUrl = import.meta.env.VITE_API_URL;

  const salva = () => {
    const metodo = comunicazione ? "PUT" : "POST";
    const url = comunicazione
      ? `${apiUrl}/comunicazioni/${comunicazione.id}`
      : `${apiUrl}/comunicazioni`;

    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ oggetto, testo })
    })
      .then(res => res.json())
      .then(data => {
        onSave(data);
        onClose();
      });
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {comunicazione ? "Modifica" : "Nuova"} Comunicazione
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Oggetto</label>
              <input
                className="form-control"
                value={oggetto}
                onChange={e => setOggetto(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Testo</label>
              <textarea
                className="form-control"
                rows={4}
                value={testo}
                onChange={e => setTesto(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Annulla</button>
            <button className="btn btn-primary" onClick={salva}>Salva</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModaleComunicazione;
