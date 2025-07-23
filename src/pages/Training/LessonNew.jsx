import api from "../../api";
import { Select } from 'antd';
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import "../../styles/Training/Lesson.css";

export default function CrearLessonPage() {
    const navigate = useNavigate();
    const { permissions } = useUserStore();
    const [campos, setCampos] = useState([]);
    const [vacantes, setVacantes] = useState([]);
    const [archivos, setArchivos] = useState({});
    const [valores, setValores] = useState({
        title: "",
        description: "",
        duration: "",        
    });

    const fetchCampos = async () => {
        try {
            const res = await api.get("/training/lesson/custom_fields/");
            setCampos(res.data);
        } catch (err) {
            console.error("Error al cargar campos personalizados", err);
        }
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setValores({
            ...valores,
            [name]: type === "checkbox" ?  checked : value
        });
    };

    const handleFileChange = (campoId, e) => {
        const file = e.target.files[0];
        setArchivos(prev => ({ ...prev, [campoId]: file }));
                
        setValores(prev => ({
            ...prev,
            [campoId]: file ? file.name : ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const camposBasicos = [
            { key: 'title', label: 'Título' },
            { key: 'description', label: 'Descripción' },
            { key: 'duration', label: 'Duración' }
        ];

        const esCampoVacio = (valor, tipo) => {
            if (tipo === 'date') {
                return valor === null || valor === undefined || valor === '';
            }
            return !valor;
        };
        
        for (const campo of camposBasicos) {
            if (esCampoVacio(valores[campo.key], campo.type)) {
                toast.error(`Por favor, ingresa el campo: ${campo.label}`);
                return; 
            }
        }

        for (const campo of campos) {
            if (campo.required && esCampoVacio(valores[campo.name], campo.type)) {
                toast.error(`Campo obligatorio: ${campo.label}`);
                return; 
            }
        }

        const camposArchivoRequeridos = campos.filter(c => c.type === 'file' && c.required);
        for (const campo of camposArchivoRequeridos) {
            if (!archivos[campo.name]) {
                toast.error(`Por favor, adjunta el archivo requerido: ${campo.label}`);
                return;
            }
        }

        try {

            const formData = new FormData();

            // Campos básicos
            formData.append("title", valores.title);
            formData.append("description", valores.description);
            formData.append("duration", valores.duration);
            formData.append("status", "pendiente");

            // Campos dinámicos (no archivos)
            const dynamicFields = [];
            campos.forEach((item) => {
                if (item.type !== 'file') {
                    const rawValue = valores[item.name];
                    const value = item.type === "boolean"
                        ? rawValue === true || rawValue === "true" ? "true" : "false"
                        : rawValue;
                    
                    dynamicFields.push({
                        field: item.idCustomField, 
                        value: value
                    });
                }
            });
            formData.append("valores_dinamicos", JSON.stringify(dynamicFields));
            
            // Archivos y metadatos
            const filesMetadata = [];
            Object.entries(archivos).forEach(([campoName, archivo], index) => {
                const campo = campos.find(c => c.name === campoName);
                if (campo && archivo) {
                    // Usamos un nombre único para cada archivo
                    const fieldName = `file_${campo.idCustomField}`;
                    formData.append(fieldName, archivo);
                    
                    filesMetadata.push({
                        field: campo.idCustomField,
                        filename: archivo.name,
                        fieldName: fieldName  // Guardamos el nombre del campo para referencia
                    });
                }
            });

            formData.append("files_metadata", JSON.stringify(filesMetadata));

            console.log('formData: ', formData);            

            const res = await api.post("/training/lesson/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            const result = await Swal.fire({
                title: 'Clase agregada',
                text: 'La clase fue registrada exitosamente.',
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
            if (result.isConfirmed){
                navigate('/clases');
            }                        
        } catch (error) {    
            console.log('error: ', error);        
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
        }
    };

    const renderCampo = (campo) => {
        if (campo.type === "boolean") {
            return (
                <div style={{display: 'flex', flexDirection: 'column', width: '30%'}}>
                    <label key={campo.idCustomField}>
                        <input
                            type="checkbox"
                            name={campo.name}
                            checked={valores[campo.name] || false}
                            onChange={handleChange}
                        />
                        {campo.label}
                    </label>
                </div>
            );
        }
        
        if (campo.type === "select") {
            const opciones = campo?.options?.split(",").map((op) => op.trim());
            return (
                <div style={{display: 'flex', flexDirection: 'column', width: '30%'}}>
                    <span>{campo.label}</span>
                    <select
                        key={campo.idCustomField}
                        name={campo.name}
                        value={valores[campo.name] || ""}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione {campo.label}</option>
                        {opciones?.map((op, i) => (
                            <option key={i} value={op}>
                                {op}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }
        
        if (campo.type === "file") {
            return (
                <div key={campo.idCustomField} style={{display: 'flex', flexDirection: 'row', width: '30%'}}>                    
                    <div>
                        <span>{campo.label}</span>
                        <input
                            type="file"
                            name={campo.name}
                            onChange={(e) => handleFileChange(campo.name, e)}     
                            accept=".pdf"                              
                        />
                    </div>
                </div>
            );
        }
        
        return (
            <div style={{display: 'flex', flexDirection: 'column', width: '30%'}}>
                <span>{campo.label}</span>
                <input
                    key={campo.idCustomField}
                    name={campo.name}
                    type={campo.type}
                    placeholder={campo.label}
                    value={valores[campo.name] || ""}
                    onChange={handleChange}            
                />
            </div>
        );
    };

    useEffect(() => {
        fetchCampos();        
    }, []);

  return (
    <div className="candidate-container">
      <h2>Agregar Clase</h2>
      <form className="candidate-form" onSubmit={handleSubmit}>
        <div className="form-basicos">
            <input name="title" placeholder="Título" value={valores.title} onChange={handleChange}  />
            <input name="description" placeholder="Descripción" value={valores.description} onChange={handleChange}  />
            <input name="duration" placeholder="Duración" value={valores.duration} onChange={handleChange}  />
        </div>

        <h4>Detalles</h4>
        <div className="form-dinamicos">
        {campos
            .filter(campo => campo.type !== "boolean")
            .map((campo) => renderCampo(campo))}
        {campos
            .filter(campo => campo.type === "boolean")
            .map((campo) => renderCampo(campo))}
        </div>
        <div className="form-button">
           {permissions.includes('crear_clase') && <button type="submit">Guardar Clase</button>}
        </div>        
      </form>
    </div>
  );
}