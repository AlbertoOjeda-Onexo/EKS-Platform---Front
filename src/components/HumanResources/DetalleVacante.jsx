import { Descriptions, Divider, Tag } from "antd";
import "../../styles/Components/DetalleVacante.css";

export default function DetalleVacante({ vacante }) {
  if (!vacante) return null;

  const renderValor = (valor) => {
    if (valor === "true") return <Tag color="green">Sí</Tag>;
    if (valor === "false") return <Tag color="red">No</Tag>;
    return valor;
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

      <Divider>Campos personalizados</Divider>

      <div className="campos-personalizados-scroll">
        <Descriptions bordered size="small" column={1}>
          {vacante.valores_dinamicos?.map((campo) => (
            <Descriptions.Item key={campo.fieldID} label={campo.fieldName}>
              {renderValor(campo.value)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>
    </div>
  );
}