import { authRoutes } from "./authRoutes";
import { humanResourcesRoutes } from "./humanResourcesRoutes";
import UnauthorizedPage from "../pages/system/UnauthorizedPage";

export const appRoutes = [
  ...authRoutes,
  ...humanResourcesRoutes,
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*", 
    element: humanResourcesRoutes[0].element, 
  },
];
