import { useEffect, useState } from "react";
import "../../styles/Components/DetalleCandidato.css";
import { Descriptions, Divider, Tag, Button, Modal, List } from "antd";
import { DownloadOutlined, FileOutlined, FilePdfOutlined, FileImageOutlined } from '@ant-design/icons';

export default function DetalleCandidato({ candidato }) {
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  if (!candidato) return null;

  const getFileIcon = (filename) => {
    if (!filename) return <FileOutlined />;
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf': return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png': return <FileImageOutlined style={{ color: '#52c41a' }} />;
      default: return <FileOutlined />;
    }
  };

  const renderValor = (campo) => {
    const { value, file } = campo;
    
    if (value === "true") return <Tag color="green">Sí</Tag>;
    if (value === "false") return <Tag color="red">No</Tag>;
    
    if (file) {
      return (
        <Button 
          type="link" 
          icon={getFileIcon(value)} 
          onClick={() => {            
            campo.file = campo.file.split('/').slice(-2).join('/');
            console.log('Este es el archivo: ', campo);                       
            setSelectedFile(campo);
            setFileModalVisible(true);
          }}
        >
          {value}
        </Button>
      );
    }
    
    return value;
  };

  return (
    <div>
      <Descriptions title="Información general" bordered size="small" column={1}>
        <Descriptions.Item label="Nombre">{candidato.name}</Descriptions.Item>
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
              {renderValor(campo)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>

      {/* Modal para visualización de archivos */}
      <Modal
        title={`Documento: ${selectedFile?.fieldName}`}
        visible={fileModalVisible}
        onCancel={() => setFileModalVisible(false)}
        footer={[
          <Button 
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            style={{backgroundColor: '#2859d3'}}
            onClick={() => window.open(
              `${import.meta.env.VITE_API_URL}/user/view_file/${encodeURIComponent(selectedFile.file)}`, 
              '_blank'
            )}
          >
            Descargar
          </Button>,
          <Button key="close" onClick={() => setFileModalVisible(false)}>
            Cerrar
          </Button>
        ]}
        width="80%"
        style={{ top: 20 }}
      >
        {selectedFile && (
          <div style={{ height: '80vh' }}>
            {selectedFile.file?.endsWith('.pdf') ? (
              <iframe
                src={`${import.meta.env.VITE_API_URL}/user/view_file/${encodeURIComponent(selectedFile.file)}`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="Visor de documento"
              />
            ) : (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <img 
                  src={`${import.meta.env.VITE_API_URL}/user/view_file/${encodeURIComponent(selectedFile.file)}`} 
                  alt={selectedFile.fieldName}
                  style={{ maxWidth: '100%', maxHeight: '65vh' }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}