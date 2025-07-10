import React from "react";
import PrivateLayout from "../layouts/PrivateLayout";
import ProtectedRoute from "../components/system/ProtectedRoute";
import VacantPage from "../pages/HumanResources/VacantPositionList"
import CrearVacantePage from "../pages/HumanResources/VacantPositionNew";
import CamposPersonalizadosPage from "../pages/HumanResources/CustomFields";
import CandidatoPage from "../pages/HumanResources/CandidateList"
import CrearCandidatoPage from "../pages/HumanResources/CandidateNew";

export const humanResourcesRoutes = [
  {
    path: "/customFields",
    element: (
      <ProtectedRoute requiredPermission="ver_campos_dinamicos">
        <PrivateLayout>
          <CamposPersonalizadosPage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/candidatos/",
    element: (
      <ProtectedRoute requiredPermission="ver_candidatos">
        <PrivateLayout>
          <CandidatoPage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/candidatos/new",
    element: (
      <ProtectedRoute requiredPermission="crear_candidato">
        <PrivateLayout>
          <CrearCandidatoPage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/vacantes/",
    element: (
      <ProtectedRoute requiredPermission="ver_vacantes">
        <PrivateLayout>
          <VacantPage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/vacantes/new",
    element: (
      <ProtectedRoute requiredPermission="crear_vacante">
        <PrivateLayout>
          <CrearVacantePage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
];
