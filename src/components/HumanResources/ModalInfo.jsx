import { Modal, Button } from "antd";
import "../../styles/Components/ModalInfo.css";

export default function ModalInfo({ open, onClose, title, children }) {
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
        <Button onClick={onClose} className="modal-accept-button" style={{backgroundColor: '#2859d3'}}>
          Aceptar
        </Button>
      </div>
    </Modal>
  );
}
