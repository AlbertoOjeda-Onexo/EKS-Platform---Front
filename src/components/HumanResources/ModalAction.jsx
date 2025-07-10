import { Modal, Button } from "antd";
import "../../styles/Components/ModalAction.css";

export default function ModalAction({ open, onClose, title, children }) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="modal-basico"      
      width={700}
    >
      <div className="modal-header">
        <h2>{title}</h2>
      </div>

      <div className="modal-body">
        {children}
      </div>

      <div className="modal-footer">
        <Button onClick={onClose} className="modal-accept-button">
          Aceptar
        </Button>
        <Button onClick={onClose} className="modal-action-button">
          Guardar
        </Button>
      </div>
    </Modal>
  );
}
