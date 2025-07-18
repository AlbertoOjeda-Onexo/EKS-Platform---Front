import { Descriptions, Divider, Tag } from "antd";
import "../../styles/Components/DetalleCandidato.css";

export default function DetalleCandidato({ candidato }) {
  if (!candidato) return null;

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
        <Descriptions.Item label="Nombre">
          {candidato.name}
        </Descriptions.Item>
        <Descriptions.Item label="Apellidos">
          {candidato.firstSurName + ' ' + candidato.secondSurName}
        </Descriptions.Item>
        <Descriptions.Item label="Vacante">
          {candidato.vacantPositionTitle}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          <Tag color="blue">{candidato.status}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider>Campos personalizados</Divider>

      <div className="campos-personalizados-scroll">
        <Descriptions bordered size="small" column={1}>
          {candidato.dynamic_values?.map((campo) => (
            <Descriptions.Item key={campo.fieldID} label={campo.fieldName}>
              {renderValor(campo.value)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>
    </div>
  );
}