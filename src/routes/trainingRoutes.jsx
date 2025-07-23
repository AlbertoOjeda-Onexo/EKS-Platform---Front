import PrivateLayout from "../layouts/PrivateLayout";
import LessonPage from "../pages/Training/LessonList";
import CrearLessonPage from "../pages/Training/LessonNew";
import ProtectedRoute from "../components/system/ProtectedRoute";
import CamposPersonalizadosPage from "../pages/Training/CustomFields";

export const trainingRoutes = [
  {
    path: "/customFields/training",
    element: (
      <ProtectedRoute requiredPermission="ver_campos_dinamicos">
        <PrivateLayout>
          <CamposPersonalizadosPage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/clases/",
    element: (
      <ProtectedRoute requiredPermission="ver_clases">
        <PrivateLayout>
          <LessonPage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/clases/new",
    element: (
      <ProtectedRoute requiredPermission="crear_clase">
        <PrivateLayout>
          <CrearLessonPage />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  }
];
