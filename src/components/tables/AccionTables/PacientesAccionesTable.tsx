import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { Pen, Trash, Info, FileText } from "lucide-react";

import Badge from "../../ui/badge/Badge";
import { toast } from "react-toastify";
import { PacienteParams, pacientesService } from "../../../services/pacientes";
import Button from "../../ui/button/Button";
import { useModal } from "../../../hooks/useModal";
import { DeleteModal } from "../../ui/modal/DeleteModal";
import { PatientDetailsModal } from "../../modals/PacienteDetalleModal";
import { PatientFichasModal } from "../../modals/PatientFichasModal";
import { TableActionHeader } from "../../common/TableActionHeader";
import { Pagination } from "../../ui/Pagination";

interface Paciente {
  id: number;
  nombresApellidos: string;
  cedula: string;
  fechaNacimiento: string;
  fechaApertura: string;
  activo: boolean;
  ciudad: string;
  domicilio: string;
  numeroTelefono: string;
  numeroCelular: string;
  institucionEducativa: { id: number; nombre: string };
  sede: { id: number; nombre: string };
  motivoConsulta: string;
  observaciones: string;
}

export default function PacientesAccionesTable() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null
  );

  // Pagination and Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const {
    isOpen: isDetailsModalOpen,
    openModal: openDetailsModal,
    closeModal: closeDetailsModal,
  } = useModal();

  const {
    isOpen: isFichasModalOpen,
    openModal: openFichasModal,
    closeModal: closeFichasModal,
  } = useModal();

  const fetchPacientes = async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true);
      const params: PacienteParams = {
        page,
        size: pageSize,
        search: search || undefined,
        sort: "id,desc",
      };
      const response = await pacientesService.listar(params);
      setPacientes(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      toast.error("Error al cargar la lista de pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, [currentPage]);

  const handleEdit = (id: number) => {
    navigate(`/pacientes/editar/${id}`);
  };

  const handleDeleteClick = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (selectedPaciente) {
      try {
        await pacientesService.eliminar(selectedPaciente.id);
        toast.success("Paciente eliminado correctamente");
        await fetchPacientes();
        closeDeleteModal();
        setSelectedPaciente(null);
      } catch (error) {
        toast.error("Error al eliminar el paciente");
        console.error("Error al eliminar paciente:", error);
      }
    }
  };

  const handleDetailsClick = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    openDetailsModal();
  };

  const handleFichasClick = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    openFichasModal();
  };

  const getEstadoBadge = (estado: boolean) => {
    return estado ? "success" : "error";
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
    fetchPacientes(0, term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = () => {
    console.log("Exporting data...");
    // Implement export logic here
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <TableActionHeader
        title="Lista de pacientes"
        onSearchClick={handleSearch}
        onNew={() => navigate("/pacientes/nuevo")}
        newButtonText="Agregar"
        onExport={handleExport}
      />
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Número de ficha
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Nombre del paciente
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Cédula
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Teléfono
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Sede
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Estado
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            {/* Table Body */}
            <TableBody>
              {Array.isArray(pacientes) && pacientes.length > 0 ? (
                pacientes.map((paciente) => (
                  <TableRow
                    key={paciente.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                  >
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {paciente.id}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {paciente.nombresApellidos}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {paciente.cedula}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {paciente.numeroTelefono}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      {paciente.sede.nombre}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <Badge size="sm" color={getEstadoBadge(paciente.activo)}>
                        {paciente.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDetailsClick(paciente)}
                          className="hover:bg-white hover:text-blue-600 p-2 text-center text-dark dark:text-white-400 dark:hover:text-blue-600"
                          title="Detalles"
                        >
                          <Info size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFichasClick(paciente)}
                          className="hover:bg-white hover:text-green-600 p-2 text-center text-dark dark:text-white-400 dark:hover:text-green-600"
                          title="Fichas"
                        >
                          <FileText size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(paciente.id)}
                          className="hover:bg-white hover:text-yellow-600 p-2 text-center text-dark dark:text-white-400 dark:hover:text-yellow-600"
                          title="Editar"
                        >
                          <Pen size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(paciente)}
                          className="hover:bg-red-500 hover:text-white p-2 text-center text-red-600 dark:text-red-400 dark:hover:text-red-400"
                          title="Eliminar"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="col-span-7 px-5 py-10 text-center text-theme-md text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-gray-400 dark:text-gray-600">
                        <Info size={30} strokeWidth={1} />
                      </span>
                      <p>No se encontraron pacientes registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Eliminar Paciente"
          description={`¿Estás seguro de que deseas eliminar al paciente ${selectedPaciente?.nombresApellidos}? Esta acción no se puede deshacer.`}
        />

        <PatientDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          paciente={selectedPaciente}
        />

        <PatientFichasModal
          isOpen={isFichasModalOpen}
          onClose={closeFichasModal}
          paciente={selectedPaciente}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
