import api from "../../api";
import Swal from "sweetalert2";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../styles/HumanResources/Candidate.css";
import { Dropdown, Menu, Button, Tag } from "antd";
import { useUserStore } from "../../store/userStore";
import LoadingAI from "../../components/system/LoadingAI";
import ModalInfo from "../../components/HumanResources/ModalInfo";
import DetalleLesson from "../../components/Training/DetalleClase";

export default function LessonPage() {
  const navigate = useNavigate();
  const { permissions } = useUserStore();    
  const [clases, setClases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [classDetail, setClassDetail] = useState([]);  

  const fetchLessons = async () => {
    try {
      const res = await api.get("/training/lesson/");
      setClases(res.data);
    } catch (err) {
      console.error("Error al cargar las clases", err);
    }
  };

  const handleNew = () => navigate("/clases/new");

  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: "¿Eliminar clase?",
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
        await api.delete(`/training/lesson/${id}/delete/`);        
        Swal.fire({
            title: 'Clase eliinada.',
            text: 'La clase fue eliminada exitosamente.',
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
        fetchLessons();
      }
    }
  };

  const handleViewDetail = async (lesson) => {
    setOpenModalInfo(true);
    setClassDetail(lesson);
  };

  const handleApprove = async (id) => {
    const result = await Swal.fire({
        title: "¿Aprobar clase?",
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
        await api.patch(`/training/lesson/${id}/approve/`);        
        Swal.fire({
            title: 'Clase aprobada.',
            text: 'La clase ha sido aprobada y se encuentra lista para ser asignada.',
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
        fetchLessons();
      }
    }
  };

  const renderAcciones = (lesson) => {
    const menu = (
      <Menu
        onClick={({ key }) => {
          if (key === "ver") handleViewDetail(lesson);                    
          if (key === 'aprobar') handleApprove(lesson.idLesson);          
          if (key === "eliminar") handleDelete(lesson.idLesson);
        }}
        items={[
          { label: "Ver", key: "ver" },           
          permissions.includes('aprobar_clase') && lesson.status !== 'aprobada' && { label: "Aprobar", key: "aprobar" },                  
          permissions.includes('eliminar_clase') && { label: "Eliminar", key: "eliminar", danger: true }
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
    fetchLessons();
  }, []);

  return (
    <>    
    <div className="candidate-container">
      <div className="candidate-header">
        <h1 className="header-title">Clases</h1>
        {permissions.includes('crear_clase') && <button onClick={handleNew}>Agregar Clase</button>}
      </div>
      <table className="candidates-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>   
            <th>Duración</th>            
            <th>Status</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clases?.map((clase, index) => (
            <tr key={index}>
              <td>{clase.idLesson}</td>
              <td>{clase.title}</td>
              <td>{clase.description}</td>
              <td>{clase.duration}</td>
              <td>
                <span className={`status-badge ${clase.status.toLowerCase()}`}>
                  {clase.status}                  
                </span>                
              </td>
              <td>{renderAcciones(clase)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ModalInfo open={openModalInfo} onClose={() => setOpenModalInfo(false)} title={classDetail.title}>
      <DetalleLesson lesson={classDetail} />
    </ModalInfo>
    {isLoading && <LoadingAI/>}
    </>
  );
}
