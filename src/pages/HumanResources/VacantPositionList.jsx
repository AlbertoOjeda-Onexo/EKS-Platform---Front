import api from "../../api";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Dropdown, Menu, Button } from "antd";
import { useNavigate } from "react-router-dom";
import ModalInfo from "../../components/ModalInfo";
import "../../styles/HumanResources/VacantPosition.css";
import DetalleVacante from "../../components/DetalleVacante";

export default function VacantePage() {
  const navigate = useNavigate();
  const [vacantes, setVacantes] = useState([]);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [vacanteDetail, setVacanteDetail] = useState([]);

  const fetchVacantes = async () => {
    try {
      const res = await api.get("/humanResources/vacant_position/");
      setVacantes(res.data);
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

  const renderAcciones = (vacante) => {
    const menu = (
      <Menu
        onClick={({ key }) => {
          if (key === "ver") handleViewDetail(vacante);          
          if (key === "eliminar") handleDelete(vacante.idVacantPosition);
        }}
        items={[
          { label: "Ver", key: "ver" },          
          { label: "Eliminar", key: "eliminar", danger: true }
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
        <button onClick={handleNew}>Agregar Vacante</button>
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
    </>
  );
}
