import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NuevosPacientes from "./pages/Pacientes/NuevosPacientes";
import EditarPacientes from "./pages/Pacientes/EditarPacientes";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ListaPacientes from "./pages/Pacientes/ListaPacientes";
import ListaInstituciones from "./pages/Instituciones/Instituciones";
import ListaSedes from "./pages/Sedes/Sedes";
import Citas from "./pages/Citas/Citas";
import FichaFonoaudiologia from "./pages/Fichas/FichaFonoaudiologia";
import FichaPsicologiaClinica from "./pages/Fichas/FichaPsicologiaClinica";
import FichaPsicologiaEducativa from "./pages/Fichas/FichaPsicologiaEducativa";
import HistoriaClinica from "./pages/Fichas/HistoriaClinica";
import NotFound from "./pages/OtherPages/NotFound";
import EditarEspecialistas from "./pages/Especialistas/EditarEspecialitas";
import ListaEspecialistas from "./pages/Especialistas/ListaEspecialistas";
import AsignacionesEspecialistas from "./pages/Especialistas/AsignacionesEspecialistas";
import NuevosEspecialistas from "./pages/Especialistas/NuevosEspecialistas";
import Wais from "./pages/Repositorio/Wais";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PermissionRoute from "./components/auth/PermissionRoute";
import ListaPasantes from "./pages/Pasantes/ListaPasantes";
import NuevosPasantes from "./pages/Pasantes/NuevosPasantes";
import EditarPasantes from "./pages/Pasantes/EditarPasantes";
import GamePlayer from "./pages/Repositorio/GamePlayer";
import Tests from "./pages/Repositorio/Tests";
import JuegosList from "./pages/Repositorio/JuegosList";
import SubirRecursos from "./pages/Repositorio/SubirRecursos";
import ListaEspecialidades from "./pages/Especialidades/ListaEspecialidades";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Protected Dashboard Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index path="/" element={<Home />} />

                {/* Pacientes */}
                <Route
                  element={
                    <PermissionRoute requiredPermission="PERM_PACIENTES" />
                  }
                >
                  <Route path="pacientes" element={<ListaPacientes />} />
                  <Route path="pacientes/nuevo" element={<NuevosPacientes />} />
                  <Route
                    path="pacientes/editar/:id"
                    element={<EditarPacientes />}
                  />
                  <Route path="citas" element={<Citas />} />
                </Route>

                {/* Especialistas (Restricted by Permission) */}
                <Route
                  element={
                    <PermissionRoute requiredPermission="PERM_ESPECIALISTAS" />
                  }
                >
                  <Route
                    path="especialistas"
                    element={<ListaEspecialistas />}
                  />
                  <Route
                    path="especialistas/nuevo"
                    element={<NuevosEspecialistas />}
                  />
                  <Route
                    path="especialistas/editar/:id"
                    element={<EditarEspecialistas />}
                  />
                </Route>

                <Route
                  element={
                    <PermissionRoute requiredPermission="PERM_ASIGNACIONES" />
                  }
                >
                  <Route
                    path="asignaciones"
                    element={<AsignacionesEspecialistas />}
                  />
                </Route>

                {/* Pasantes (Restricted by Permission) */}
                <Route
                  element={
                    <PermissionRoute requiredPermission="PERM_PASANTES" />
                  }
                >
                  <Route path="pasantes" element={<ListaPasantes />} />
                  <Route path="pasantes/nuevo" element={<NuevosPasantes />} />
                  <Route
                    path="pasantes/editar/:id"
                    element={<EditarPasantes />}
                  />
                </Route>

                {/* Instituciones (Restricted by Permission) */}
                <Route
                  element={
                    <PermissionRoute requiredPermission="PERM_INSTITUCIONES_EDUCATIVAS" />
                  }
                >
                  <Route
                    path="instituciones"
                    element={<ListaInstituciones />}
                  />
                </Route>

                {/* Sedes (Restricted by Permission) */}
                <Route
                  element={<PermissionRoute requiredPermission="PERM_SEDES" />}
                >
                  <Route path="sedes" element={<ListaSedes />} />
                </Route>

                {/* Especialidades (Restricted by Permission) */}
                <Route
                  element={<PermissionRoute requiredPermission="PERM_ESPECIALIDADES" />}
                >
                  <Route path="especialidades" element={<ListaEspecialidades />} />
                </Route>

                {/* Fichas */}
                <Route
                  path="fonoaudiologia"
                  element={<FichaFonoaudiologia />}
                />
                <Route
                  path="psicologia-clinica"
                  element={<FichaPsicologiaClinica />}
                />
                <Route
                  path="psicologia-educativa"
                  element={<FichaPsicologiaEducativa />}
                />
                <Route path="historia-clinica" element={<HistoriaClinica />} />

                {/* Wais */}
                <Route path="wais" element={<Wais />} />

                {/* Juegos */}
                <Route
                  element={
                    <PermissionRoute requiredPermission="PERM_RECURSOS" />
                  }
                >
                  <Route path="juegos" element={<JuegosList />} />
                  <Route path="juegos/:id" element={<GamePlayer />} />
                  <Route path="tests" element={<Tests />} />
                  <Route path="subir-recursos" element={<SubirRecursos />} />
                </Route>
              </Route>
            </Route>

            {/* Public Auth Layout */}
            <Route path="signin" element={<SignIn />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
