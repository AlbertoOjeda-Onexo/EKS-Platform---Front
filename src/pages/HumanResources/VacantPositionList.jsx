import api from "../../api";
import Swal from "sweetalert2";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import LoadingAI from "../../components/system/LoadingAI";
import { Dropdown, Menu, Button, Tag } from "antd";
import ModalInfo from "../../components/HumanResources/ModalInfo";
import ModalAction from "../../components/HumanResources/ModalAction";
import { useUserStore } from "../../store/userStore";
import "../../styles/HumanResources/VacantPosition.css";
import DetalleVacante from "../../components/HumanResources/DetalleVacante";
import DetalleVacanteCheckList from "../../components/HumanResources/DetalleVacanteChecklist";

export default function VacantePage() {
  const navigate = useNavigate();
  const { permissions } = useUserStore();
  const [vacantes, setVacantes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vacanteDetail, setVacanteDetail] = useState([]);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [vacantePublishment, setVacantePublishment] = useState('');  
  const [openModalPublishment, setOpenModalPublishment] = useState(false);  
  const [openModalChecklist, setOpenModalChecklist] = useState(false);

  const fetchVacantes = async () => {
    try {
      const res = await api.get("/humanResources/vacant_position/");
      setVacantes(res.data);
      if (vacanteDetail){
        const updated = res.data.find(vacante => vacante.idVacantPosition === vacanteDetail.idVacantPosition);
        if (updated) setVacanteDetail(updated);
      }
    } catch (err) {
      console.error("Error al cargar las vacantes disponibles", err);
    }
  };

  const handleNew = () => navigate("/vacantes/new");

  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: "¿Eliminar vacante?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
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
        await api.delete(`/humanResources/vacant_position/${id}/delete/`);        
        Swal.fire({
            title: 'Vacante eliminada.',
            text: 'La vacante fue eliminada exitosamente.',
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
      } catch {
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
    }
  };

  const handleViewDetail = async (vacante) => {
    setOpenModalInfo(true);
    setVacanteDetail(vacante);
  };

  const handleApprove = async (id) => {
    const result = await Swal.fire({
        title: "¿Aprobar vacante?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, aprobar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#2859d3",
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
        await api.patch(`/humanResources/vacant_position/${id}/approve/`);        
        Swal.fire({
            title: 'Vacante aprobada.',
            text: 'La vacante ha sido aprobada y ya esta disponible para publicación.',
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
      } catch (error){
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
    }
  };

  const handlePublishVacant = async (vacante) => {
    setIsLoading(true);
    try {
      const generatedDescription = await api.get(`/humanResources/vacant_position/description_generator/${vacante.idVacantPosition}/`);
      console.log('Generated Descrition: ', generatedDescription.data.text);
      setVacanteDetail(vacante);
      setVacantePublishment(generatedDescription.data.text);
      setOpenModalPublishment(true);
    } catch (error){
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
      setIsLoading(false);
    }
  };

  const handleChecklist = async (vacante) => {
    try {      
      setVacanteDetail(vacante);      
      setOpenModalChecklist(true);
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

    }
  };

  const renderAcciones = (vacante) => {
    const menu = (
      <Menu
        onClick={({ key }) => {
          if (key === "ver") handleViewDetail(vacante);          
          if (key === "publicar") handlePublishVacant(vacante);
          if (key === 'aprobar') handleApprove(vacante.idVacantPosition);
          if (key === 'checklist') handleChecklist(vacante);
          if (key === "eliminar") handleDelete(vacante.idVacantPosition);
        }}
        items={[
          { label: "Ver", key: "ver" }, 
          permissions.includes('publicar_vacante') && vacante.status == 'aprobada' && { label: "Publicar", key: "publicar"},           
          permissions.includes('aprobar_vacante') && vacante.status !== 'aprobada' && { label: "Aprobar", key: "aprobar" },        
          permissions.includes('aprobar_vacante') && vacante.status == 'aprobada' && { label: "Checklist", key: "checklist"},  
          permissions.includes('eliminar_vacante') && { label: "Eliminar", key: "eliminar", danger: true }
        ]}
      />
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button className="button-dropdown"> Gestionar </Button>
      </Dropdown>
    );
  };

  useEffect(() => {
    fetchVacantes();
  }, []);

  return (
    <>    
      <div className="vacante-container">
        <div className="vacante-header">
          <h1 className="header-title">Vacantes</h1>
          {permissions.includes('crear_vacante') && <button onClick={handleNew}>Agregar Vacante</button>}
        </div>
        <table className="vacantes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha Vencimiento</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacantes?.map((vacante, index) => (
              <tr key={index}>
                <td>{vacante.title}</td>
                <td>{vacante.description}</td>
                <td>{vacante.expire_date}</td>
                <td>
                  <span className={`status-badge ${vacante.status.toLowerCase()}`}>
                    {vacante.status}                  
                  </span>                
                </td>
                <td>{renderAcciones(vacante)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalInfo open={openModalInfo} onClose={() => setOpenModalInfo(false)} title={vacanteDetail.title}>
        <DetalleVacante vacante={vacanteDetail} />
      </ModalInfo>
      <ModalInfo open={openModalPublishment} onClose={() => setOpenModalPublishment(false)} title={vacanteDetail.title}>
        <div className="modal-content">
          <ReactMarkdown>{vacantePublishment}</ReactMarkdown>
        </div>
      </ModalInfo>
      <ModalInfo open={openModalChecklist} onClose={() => setOpenModalChecklist(false)} title={vacanteDetail.title}>
        <DetalleVacanteCheckList vacante={vacanteDetail} vacantes={vacantes} fetchVacantes={fetchVacantes}/>
      </ModalInfo>     
      {isLoading && <LoadingAI/>}
    </>
  );
}
