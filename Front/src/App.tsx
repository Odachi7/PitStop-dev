import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { VehicleDetailPage } from "./pages/car";
import { DashBoard } from "./pages/dashboard";
import { SellCar } from "./pages/sellCar";
import { Assinar } from "./pages/assinaturas";
import { SellMotorcycle } from "./pages/sellMotorcycle";
import { Catalogo } from "./pages/catalogo";
import { NotFound } from "./pages/notFound";


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
     {
      path: "/",
      element: <Home />
     },
     {
      path: "/vehicle/:id", 
      element: <VehicleDetailPage />
     },
     {
      path: "/dashboard", 
      element: <DashBoard />
     }, 
     { 
      path: "/vender-carro",
      element: <SellCar />
     },
     {
      path: "/vender-moto",
      element: <SellMotorcycle />
     },
     {
      path: "/assinar",
      element: <Assinar />
     },
     {
      path: "/catalogo",
      element: <Catalogo />
     },
     {
      path: "*",
      element: <NotFound />
     }
    ]
  },
  {
    path: "/login",
    element: <Login />
  }, 
  {
    path: "/register",
    element: <Register/>
  },
])

export { router };