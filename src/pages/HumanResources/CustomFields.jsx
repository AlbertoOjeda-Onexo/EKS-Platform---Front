import api from "../../api";
import Swal from "sweetalert2";
import "../../styles/HumanResources/CustomFields.css";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

const tipoCampoOptions = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "date", label: "Fecha" },
  { value: "boolean", label: "Booleano" },
  { value: "select", label: "Selección" },
];

export default function CamposPersonalizadosPage() {

  const [campos, setCampos] = useState([]);
  const [nuevoCampo, setNuevoCampo] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
    options: "",
  });

  const fetchCampos = async () => {
    try {
      const res = await api.get("/humanResources/custom_fields/");
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
      if (payload.tipo !== "select") delete payload.opciones;
      const res = await api.post("/humanResources/custom_fields/", payload); 
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
        await api.delete(`/humanResources/custom_fields/${id}/delete/`);
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
    fetchCampos();
  }, []);

  return (
    <div className="campos-container">
      <div>
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

      <div>
        <h2>Campos existentes</h2>
        <ul className="campos-lista">
          {campos.map((campo) => (
            <li key={campo.idCustomField}>
              <div>
                <strong className="truncate-label">{campo.label}</strong> ({campo.type}) {campo.required ? "*" : ""}
              </div>
              <button className="icon-button" onClick={() => handleDelete(campo.idCustomField, campo.label)}>
                <FaTrashAlt className="campos-icons" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
