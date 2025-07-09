import React from "react";
import PrivateLayout from "../layouts/PrivateLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import VacantPage from "../pages/HumanResources/VacantPositionList"
import CrearVacantePage from "../pages/HumanResources/VacantPositionNew";
import CamposPersonalizadosPage from "../pages/HumanResources/CustomFields";

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
