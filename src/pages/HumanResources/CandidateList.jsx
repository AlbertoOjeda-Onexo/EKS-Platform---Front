import api from "../../api";
import Swal from "sweetalert2";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import LoadingAI from "../../components/system/LoadingAI";
import { Dropdown, Menu, Button, Tag } from "antd";
import ModalInfo from "../../components/HumanResources/ModalInfo";
import { useUserStore } from "../../store/userStore";
import "../../styles/HumanResources/Candidate.css";
import DetalleCandidato from "../../components/HumanResources/DetalleCandidato";

export default function CandidatoPage() {
  const navigate = useNavigate();
  const { permissions } = useUserStore();
  const [candidatos, setCandidatos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [candidatoDetail, setCandidatoDetail] = useState([]);
  const [openModalInfo, setOpenModalInfo] = useState(false);

  const fetchCandidatos = async () => {
    try {
      const res = await api.get("/humanResources/candidate/");
      setCandidatos(res.data);
    } catch (err) {
      console.error("Error al cargar los candidatos", err);
    }
  };

  const handleNew = () => navigate("/candidatos/new");

  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: "¿Eliminar candidato?",
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
        await api.delete(`/humanResources/candidate/${id}/delete/`);        
        Swal.fire({
            title: 'Candidato eliminado.',
            text: 'El candidato fue eliminado exitosamente.',
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
        fetchCandidatos();
      }
    }
  };

  const handleViewDetail = async (candidato) => {
    setOpenModalInfo(true);
    setCandidatoDetail(candidato);
  };

  const handleApprove = async (id) => {
    const result = await Swal.fire({
        title: "¿Aceptar candidato?",
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
        await api.patch(`/humanResources/candidate/${id}/approve/`);        
        Swal.fire({
            title: 'Candidato aprobado.',
            text: 'El candidato ha sido aprobado y se encuentra disponible para continuar con el proceso.',
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
        fetchCandidatos();
      }
    }
  };

  const renderAcciones = (candidato) => {
    const menu = (
      <Menu
        onClick={({ key }) => {
          if (key === "ver") handleViewDetail(candidato);                    
          if (key === 'aceptar') handleApprove(candidato.idCandidate);
          if (key === "eliminar") handleDelete(candidato.idCandidate);
        }}
        items={[
          { label: "Ver", key: "ver" },           
          permissions.includes('aceptar_candidato') && candidato.status !== 'aprobado' && { label: "Aceptar", key: "aceptar" },          
          permissions.includes('eliminar_candidato') && { label: "Eliminar", key: "eliminar", danger: true }
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
    fetchCandidatos();
  }, []);

  return (
    <>    
    <div className="candidate-container">
      <div className="candidate-header">
        <h1 className="header-title">Candidatos</h1>
        {permissions.includes('crear_candidato') && <button onClick={handleNew}>Agregar Candidato</button>}
      </div>
      <table className="candidates-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Vacante</th>            
            <th>Status</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {candidatos?.map((candidato, index) => (
            <tr key={index}>
              <td>{candidato.idCandidate}</td>
              <td>{candidato.name + ' ' + candidato.firstSurName}</td>
              <td>{candidato.vacantPositionTitle}</td>
              <td>
                <span className={`status-badge ${candidato.status.toLowerCase()}`}>
                  {candidato.status}                  
                </span>                
              </td>
              <td>{renderAcciones(candidato)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ModalInfo open={openModalInfo} onClose={() => setOpenModalInfo(false)} title={candidatoDetail.name + ' ' + candidatoDetail.firstSurName}>
      <DetalleCandidato candidato={candidatoDetail} />
    </ModalInfo>
    {isLoading && <LoadingAI/>}
    </>
  );
}
