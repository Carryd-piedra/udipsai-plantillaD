import { lazy, ReactNode } from "react";
import { RouteObject } from "react-router";
import PermissionRoute from "../components/auth/PermissionRoute";
import JuegosList from "../pages/Repositorio/JuegosList";
import GamePlayer from "../pages/Repositorio/GamePlayer";
import Tests from "../pages/Repositorio/Tests";
import Wais from "../pages/Repositorio/Wais";
import SubirRecursos from "../pages/Repositorio/SubirRecursos";

// Lazy-loaded components
const Home = lazy(() => import("../pages/Dashboard/Home"));
const ListaPacientes = lazy(() => import("../pages/Pacientes/ListaPacientes"));
const NuevosPacientes = lazy(() => import("../pages/Pacientes/NuevosPacientes"));
const EditarPacientes = lazy(() => import("../pages/Pacientes/EditarPacientes"));
const ListaInstituciones = lazy(() => import("../pages/Instituciones/Instituciones"));
const ListaSedes = lazy(() => import("../pages/Sedes/Sedes"));
const Citas = lazy(() => import("../pages/Citas/Citas"));
const ListaEspecialistas = lazy(() => import("../pages/Especialistas/ListaEspecialistas"));
const NuevosEspecialistas = lazy(() => import("../pages/Especialistas/NuevosEspecialistas"));
const EditarEspecialistas = lazy(() => import("../pages/Especialistas/EditarEspecialitas"));
const AsignacionesEspecialistas = lazy(() => import("../pages/Especialistas/AsignacionesEspecialistas"));
const ListaPasantes = lazy(() => import("../pages/Pasantes/ListaPasantes"));
const NuevosPasantes = lazy(() => import("../pages/Pasantes/NuevosPasantes"));
const EditarPasantes = lazy(() => import("../pages/Pasantes/EditarPasantes"));
const ListaEspecialidades = lazy(() => import("../pages/Especialidades/ListaEspecialidades"));

// Fichas
// Fichas
const ListaFichasUnificadas = lazy(() => import("../pages/Fichas/ListaFichasUnificadas"));

// Sub-components kept for Edit/New pages which might still be specific
const NuevaFonoaudiologia = lazy(() => import("../pages/Fichas/Fonoaudiologia/NuevaFonoaudiologia"));
const EditarFonoaudiologia = lazy(() => import("../pages/Fichas/Fonoaudiologia/EditarFonoaudiologia"));
const NuevaPsicologiaClinica = lazy(() => import("../pages/Fichas/PsicologiaClinica/NuevaPsicologiaClinica"));
const EditarPsicologiaClinica = lazy(() => import("../pages/Fichas/PsicologiaClinica/EditarPsicologiaClinica"));
const NuevaPsicologiaEducativa = lazy(() => import("../pages/Fichas/PsicologiaEducativa/NuevaPsicologiaEducativa"));
const EditarPsicologiaEducativa = lazy(() => import("../pages/Fichas/PsicologiaEducativa/EditarPsicologiaEducativa"));
const NuevaHistoriaClinica = lazy(() => import("../pages/Fichas/HistoriaClinica/NuevaHistoriaClinica"));
const EditarHistoriaClinica = lazy(() => import("../pages/Fichas/HistoriaClinica/EditarHistoriaClinica"));

// ...

// Helper to wrap with permission
const protectedRoute = (permission: string, element: ReactNode, children?: RouteObject[]): RouteObject => ({
  element: <PermissionRoute requiredPermission={permission} />,
  children: [
    { index: true, element },
    ...(children || [])
  ]
});

export const privateRouteObjects: RouteObject[] = [
  { index: true, element: <Home /> },
  
  // Pacientes
  {
    path: "pacientes",
    element: <PermissionRoute requiredPermission="PERM_PACIENTES" />,
    children: [
      { index: true, element: <ListaPacientes /> },
      { path: "nuevo", ...protectedRoute("PERM_PACIENTES_CREAR", <NuevosPacientes />) },
      { path: "editar/:id", ...protectedRoute("PERM_PACIENTES_EDITAR", <EditarPacientes />) },
    ]
  },
  { path: "citas", ...protectedRoute("PERM_PACIENTES", <Citas />) },

  // Especialistas
  {
    path: "especialistas",
    element: <PermissionRoute requiredPermission="PERM_ESPECIALISTAS" />,
    children: [
      { index: true, element: <ListaEspecialistas /> },
      { path: "nuevo", ...protectedRoute("PERM_ESPECIALISTAS_CREAR", <NuevosEspecialistas />) },
      { path: "editar/:id", ...protectedRoute("PERM_ESPECIALISTAS_EDITAR", <EditarEspecialistas />) },
    ]
  },
  { path: "asignaciones", ...protectedRoute("PERM_ASIGNACIONES", <AsignacionesEspecialistas />) },

  // Pasantes
  {
    path: "pasantes",
    element: <PermissionRoute requiredPermission="PERM_PASANTES" />,
    children: [
      { index: true, element: <ListaPasantes /> },
      { path: "nuevo", ...protectedRoute("PERM_PASANTES_CREAR", <NuevosPasantes />) },
      { path: "editar/:id", ...protectedRoute("PERM_PASANTES_EDITAR", <EditarPasantes />) },
    ]
  },

  // Configuración
  { path: "instituciones", ...protectedRoute("PERM_INSTITUCIONES_EDUCATIVAS", <ListaInstituciones />) },
  { path: "sedes", ...protectedRoute("PERM_SEDES", <ListaSedes />) },
  { path: "especialidades", ...protectedRoute("PERM_ESPECIALIDADES", <ListaEspecialidades />) },

  // Fichas
  {
    path: "fonoaudiologia",
    element: <PermissionRoute requiredPermission="PERM_FONOAUDIOLOGIA" />,
    children: [
      { index: true, element: <ListaFichasUnificadas /> },
      { path: "nuevo", ...protectedRoute("PERM_FONOAUDIOLOGIA_CREAR", <NuevaFonoaudiologia />) },
      { path: "editar/:id", ...protectedRoute("PERM_FONOAUDIOLOGIA_EDITAR", <EditarFonoaudiologia />) },
    ]
  },
  {
    path: "psicologia-clinica",
    element: <PermissionRoute requiredPermission="PERM_PSICOLOGIA_CLINICA" />,
    children: [
      { index: true, element: <ListaFichasUnificadas /> },
      { path: "nuevo", ...protectedRoute("PERM_PSICOLOGIA_CLINICA_CREAR", <NuevaPsicologiaClinica />) },
      { path: "editar/:id", ...protectedRoute("PERM_PSICOLOGIA_CLINICA_EDITAR", <EditarPsicologiaClinica />) },
    ]
  },
  {
    path: "psicologia-educativa",
    element: <PermissionRoute requiredPermission="PERM_PSICOLOGIA_EDUCATIVA" />,
    children: [
      { index: true, element: <ListaFichasUnificadas /> },
      { path: "nuevo", ...protectedRoute("PERM_PSICOLOGIA_EDUCATIVA_CREAR", <NuevaPsicologiaEducativa />) },
      { path: "editar/:id", ...protectedRoute("PERM_PSICOLOGIA_EDUCATIVA_EDITAR", <EditarPsicologiaEducativa />) },
    ]
  },
  {
    path: "historia-clinica",
    element: <PermissionRoute requiredPermission="PERM_HISTORIA_CLINICA" />,
    children: [
      { index: true, element: <ListaFichasUnificadas /> },
      { path: "nuevo", ...protectedRoute("PERM_HISTORIA_CLINICA_CREAR", <NuevaHistoriaClinica />) },
      { path: "editar/:id", ...protectedRoute("PERM_HISTORIA_CLINICA_EDITAR", <EditarHistoriaClinica />) },
    ]
  },

  // Recursos
  {
    element: <PermissionRoute requiredPermission="PERM_RECURSOS" />,
    children: [
      { path: "wais", element: <Wais /> },
      { path: "juegos", element: <JuegosList /> },
      { path: "juegos/:id", element: <GamePlayer /> },
      { path: "tests", element: <Tests /> },
      { path: "subir-recursos", ...protectedRoute("PERM_RECURSOS_CREAR", <SubirRecursos />) },
    ]
  }
];
