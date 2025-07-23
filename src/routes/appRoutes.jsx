import { authRoutes } from "./authRoutes";
import { humanResourcesRoutes } from "./humanResourcesRoutes";
import UnauthorizedPage from "../pages/system/UnauthorizedPage";
import { trainingRoutes } from "./trainingRoutes";

export const appRoutes = [
  ...authRoutes,
  ...humanResourcesRoutes,
  ...trainingRoutes,
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*", 
    element: humanResourcesRoutes[0].element, 
  },
];
