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
import { sedesService } from "../../../services/sedes";
import { institucionesService } from "../../../services/instituciones";
import Label from "../../form/Label";
import Select from "../../form/Select";
import Input from "../../form/input/InputField";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<PacienteParams>({});
  const [tempFilters, setTempFilters] = useState<PacienteParams>({});
  const [sedes, setSedes] = useState<any[]>([]);
  const [instituciones, setInstituciones] = useState<any[]>([]);

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

  const fetchPacientes = async (
    page = currentPage,
    search = searchTerm,
    currentFilters = filters
  ) => {
    try {
      setLoading(true);
      const params: PacienteParams = {
        ...currentFilters,
        page,
        size: pageSize,
        search: search || undefined,
        sort: "id,desc",
      };

      console.log("Fetching patients with params:", params);
      const response = await pacientesService.listar(params);
      console.log("Pacientes Response:", response);

      if (response?.content && Array.isArray(response.content)) {
        setPacientes(response.content);
        setTotalPages(response.totalPages);
      } else if (Array.isArray(response)) {
        setPacientes(response);
        setTotalPages(1);
      } else {
        console.warn("Unexpected response format:", response);
        setPacientes([]);
      }
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      toast.error("Error al cargar la lista de pacientes");
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [sedesData, institucionesData] = await Promise.all([
          sedesService.listar(),
          institucionesService.listar(),
        ]);
        setSedes(sedesData || []);
        setInstituciones(institucionesData || []);
      } catch (error) {
        console.error("Error al cargar datos de filtros:", error);
      }
    };
    loadFilterData();
  }, []);

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
    fetchPacientes(0, term, filters);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(0);
    fetchPacientes(0, searchTerm, tempFilters);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    setFilters({});
    setCurrentPage(0);
    fetchPacientes(0, searchTerm, {});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = () => {
    console.log("Exporting data...");
    // Implement export logic here
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando pacientes...
        </p>
      </div>
    );
  }

  return (
    <div>
      <TableActionHeader
        title="Lista de pacientes"
        onSearchClick={handleSearch}
        onNew={() => navigate("/pacientes/nuevo")}
        newButtonText="Agregar"
        onExport={handleExport}
        onFilterApply={handleApplyFilters}
        onFilterClear={handleClearFilters}
        filterContent={
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 text-xs">Sede</Label>
              <Select
                options={sedes.map((s) => ({
                  value: s.id.toString(),
                  label: s.nombre,
                }))}
                placeholder="Todas las sedes"
                value={tempFilters.sedeId?.toString() || ""}
                onChange={(val) =>
                  setTempFilters({
                    ...tempFilters,
                    sedeId: val ? parseInt(val) : undefined,
                  })
                }
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Institución Educativa</Label>
              <Select
                options={instituciones.map((i) => ({
                  value: i.id.toString(),
                  label: i.nombre,
                }))}
                placeholder="Todas las instituciones"
                value={tempFilters.institucionEducativaId?.toString() || ""}
                onChange={(val) =>
                  setTempFilters({
                    ...tempFilters,
                    institucionEducativaId: val ? parseInt(val) : undefined,
                  })
                }
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Estado</Label>
              <Select
                options={[
                  { value: "true", label: "Activo" },
                  { value: "false", label: "Inactivo" },
                ]}
                placeholder="Todos"
                value={
                  tempFilters.activo === undefined
                    ? ""
                    : tempFilters.activo.toString()
                }
                onChange={(val) =>
                  setTempFilters({
                    ...tempFilters,
                    activo: val === "" ? undefined : val === "true",
                  })
                }
                className="h-9 text-xs"
              />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Ciudad</Label>
              <Input
                placeholder="Ej: Quito"
                value={tempFilters.ciudad || ""}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, ciudad: e.target.value })
                }
                className="h-9 text-xs"
              />
            </div>
          </div>
        }
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
                  Celular
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
                      {paciente.numeroCelular}
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
