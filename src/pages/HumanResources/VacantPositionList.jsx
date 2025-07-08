import api from "../../api";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/HumanResources/VacantPosition.css";

export default function VacantePage() {
    const navigate = useNavigate();
    const [vacantes, setVacantes] = useState([]);

    const fetchVacantes = async () => {
        try {
            const res = await api.get("/humanResources/vacant_position/");
            setVacantes(res.data);
        } catch (err) {
            console.error("Error al cargar las vacantes disponibles", err);
        }
    };

    const handleNew = async () => {
        navigate('/vacantes/new')
    };

    useEffect(() => {
        fetchVacantes();
    }, []);

  return (
    <div className="vacante-container">
        <div className="vacante-header">
            <h1 className="header-title">Vacantes</h1>
            <button onClick={() => handleNew()}>Agregar Vacante</button>
        </div>
        <table className="vacantes-table">
            <thead>
                <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Vencimiento</th>
                <th>Status</th>
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
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}