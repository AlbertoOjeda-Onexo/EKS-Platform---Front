import { authRoutes } from "./authRoutes";
import { humanResourcesRoutes } from "./humanResourcesRoutes";

export const appRoutes = [
  ...authRoutes,
  ...humanResourcesRoutes,
  {
    path: "*", 
    element: humanResourcesRoutes[0].element, 
  },
];
