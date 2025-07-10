import api from "../../api";
import Swal from "sweetalert2";
import { useState } from "react";
import "../../styles/Components/DetalleVacante.css";
import { Descriptions, Divider, Tag, Button, Form, Input, message } from "antd";

export default function DetalleVacanteCheckList({ vacante, fetchVacantes, onChecklistUpdate }) {
  const [form] = Form.useForm();
  const [addingItem, setAddingItem] = useState(false);

  if (!vacante) return null;

  const renderValor = (valor) => {
    if (valor === "true") return <Tag color="green">Sí</Tag>;
    if (valor === "false") return <Tag color="red">No</Tag>;
    return valor;
  };

  const handleAddItem = async () => {
    try {
        const values = await form.validateFields();
        
        const newItem = {
            idVacantPosition: vacante.idVacantPosition,
            title: values.title,
            description: values.description || "" 
        };
        
        const res = await api.post("/humanResources/vacant_position/checklist/", newItem);
        const result = await Swal.fire({
            title: 'Checklist actualizado.',
            text: 'Se ha agregado el elemento al checklist de la vacante.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2859d3',
            showClass: {
                popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
                `
            },
            hideClass: {
                popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
                `
            }
        })                      
        setAddingItem(false);      
    } catch (error) {        
        Swal.fire({
            title: error.response.data.code,
            text: error.response.data.detail,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2859d3',
            showClass: {
                popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
                `
            },
            hideClass: {
                popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
                `
            }
        })
    } finally {
        fetchVacantes();
    }
  };

  return (
    <div>
      <Descriptions
        title="Información general"
        bordered
        size="small"
        column={1}
      >
        <Descriptions.Item label="Título">
          {vacante.title}
        </Descriptions.Item>
        <Descriptions.Item label="Descripción">
          {vacante.description}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Expiración">
          {vacante.expire_date}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          <Tag color="blue">{vacante.status}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider>Checklist</Divider>

      <div className="campos-personalizados-scroll">
        <Descriptions bordered size="small" column={1}>
          {vacante.checklist?.map((campo) => (
            <Descriptions.Item key={campo.id} label={campo.title}>
              {renderValor(campo.description)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>

      {addingItem ? (
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Por favor ingresa un título' }]}
          >
            <Input placeholder="Ej: Verificación de antecedentes" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
          >
            <Input placeholder="Ej: El candidato no debe de contar con antescendetes penales." />
          </Form.Item>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="primary" onClick={handleAddItem}>
              Agregar
            </Button>
            <Button onClick={() => setAddingItem(false)}>
              Cancelar
            </Button>
          </div>
        </Form>
      ) : (
        <Button 
          type="dashed" 
          onClick={() => setAddingItem(true)}
          style={{ marginTop: 16, width: '100%' }}
        >
          + Agregar elemento al checklist
        </Button>
      )}
    </div>
  );
}