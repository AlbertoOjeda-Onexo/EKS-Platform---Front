import api from "../../api";
import { Select } from "antd";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import "../../styles/Training/CustomFields.css";
import { useUserStore } from "../../store/userStore";

const tipoCampoOptions = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "date", label: "Fecha" },
  { value: "boolean", label: "Booleano" },
  { value: "select", label: "Selección" },
  { value: "file", label: 'Documento'}
];

export default function CamposPersonalizadosPage() {
  const [campos, setCampos] = useState([]);
  const [formType, setFormType] = useState('lesson');
  const { permissions } = useUserStore();
  const [nuevoCampo, setNuevoCampo] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
    options: "",
  });

  const fetchCampos = async () => {
    try {
      const res = await api.get(`/training/${formType}/custom_fields/`);
      setCampos(res.data);
    } catch (err) {
      console.error("Error al cargar campos personalizados", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoCampo({
      ...nuevoCampo,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...nuevoCampo };      
      const res = await api.post(`/training/${formType}/custom_fields/`, payload); 
      Swal.fire({
          title: 'Campo creado',
          text: 'El campo fue agregado exitosamente.',
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
        setNuevoCampo({ 
          name: "", 
          label: "", 
          type: "text", 
          required: false, 
          options: "" 
        });
        fetchCampos();        
    }
  };

  const handleDelete = async (id, label) => {    
    const result = await Swal.fire({
      title: 'Eliminar campo',
      html: `¿Está seguro que desea eliminar el campo: <br> <strong>${label}</strong>?`, 
      icon: 'warning',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#2859d3',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',     
      cancelButtonColor: '#c30707',
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
    });

    if (result.isConfirmed) {      
      try {
        await api.delete(`/training/${formType}/custom_fields/${id}/delete/`);
        Swal.fire({
            title: 'Campo eliminado.',
            text: 'El campo fue eliminado exitosamente',
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
        fetchCampos();
      }
    } 
  };

  useEffect(() => {
    if(formType){
      fetchCampos();
    }
  }, [formType]);

  useEffect(() => {
    fetchCampos();
  }, []);

  return (
    <div className="campos-container">
      <div className="campos-header">
        <h1 style={{marginRight: '15px'}}>Formularios de Training: </h1>
        <Select 
          value={formType}
          onChange={setFormType}
          style={{ width: 200 }}
          className="search-select"
          options={[
            { value: "lesson", label: "Clases" },            
          ]}
        />
      </div>
      
      <div className="campos-content">
        {permissions.includes('crear_campo_dinamico') &&
          <div className="campos-form-section" style={{width: '20vw'}}>
            <h2>Campos Personalizados</h2>
            <form className="campo-form" onSubmit={handleSubmit}>
              <input name="name" placeholder="Nombre interno" value={nuevoCampo.name} onChange={handleChange} required />
              <input name="label" placeholder="Etiqueta visible" value={nuevoCampo.label} onChange={handleChange} required />
              <select name="type" value={nuevoCampo.type} onChange={handleChange}>
                {tipoCampoOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {nuevoCampo.type === "select" && (
                <input name="options" placeholder="Opcion1, Opcion2, ..." value={nuevoCampo.options} onChange={handleChange} />
              )}
              <label>
                <input type="checkbox" name="required" checked={nuevoCampo.required} onChange={handleChange} /> Obligatorio
              </label>
              <button type="submit">Crear campo</button>
            </form>
          </div>
        }
        
        <div className="campos-list-section" style={{width: '57vw'}}>
          <h2>Campos existentes</h2>
          <ul className="campos-lista">
            {campos.map((campo) => (
              <li key={campo.idCustomField}>
                <div>
                  <strong className="truncate-label">{campo.label}</strong> ({campo.type}) {campo.required ? "*" : ""}
                </div>
                {permissions.includes('borrar_campo_dinamico') && 
                  <button className="icon-button" onClick={() => handleDelete(campo.idCustomField, campo.label)}>
                    <FaTrashAlt className="campos-icons" />
                  </button>
                }
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
