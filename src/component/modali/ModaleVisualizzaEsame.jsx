import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModaleVisualizzaEsame = ({ show, pdfUrl, onClose }) => {
  return (
    <Modal size="lg" show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Anteprima PDF</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Visualizzatore PDF"
            style={{ border: "none" }}
          />
        )}
      </Modal.Body>
      
    </Modal>
  );
};

export default ModaleVisualizzaEsame;