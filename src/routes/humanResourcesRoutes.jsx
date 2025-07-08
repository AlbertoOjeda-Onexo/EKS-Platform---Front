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
      <ProtectedRoute>
        <PrivateLayout>
          <CamposPersonalizadosPage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/vacantes/",
    element: (
      <ProtectedRoute>
        <PrivateLayout>
          <VacantPage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/vacantes/new",
    element: (
      <ProtectedRoute>
        <PrivateLayout>
          <CrearVacantePage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
];
