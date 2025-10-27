import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { VehicleDetailPage } from "./pages/VehicleDetailPage";
import { DashBoard } from "./pages/dashboard";
import { SellVeicle } from "./pages/SellVeicle";
import { Assinar } from "./pages/assinaturas";
import { Catalogo } from "./pages/catalogo";
import { NotFound } from "./pages/notFound";
import { InformacoesEmpresa } from "./pages/InformacoesEmpresa"
import { DicasDeSeguranca } from "./pages/dicasSeguranca";


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
      path: "/vender",
      element: <SellVeicle />
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
      path: "/imformacoesEmpresa",
      element: <InformacoesEmpresa />
     },
     {
      path: "dicas",
      element:<DicasDeSeguranca />
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