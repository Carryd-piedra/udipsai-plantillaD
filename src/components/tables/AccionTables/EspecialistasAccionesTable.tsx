import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Pen, Trash } from "lucide-react";
import Badge from "../../ui/badge/Badge";
import { toast } from "react-toastify";
import { especialistasService } from "../../../services/especialistas";
import Button from "../../ui/button/Button";
import { useModal } from "../../../hooks/useModal";
import { DeleteModal } from "../../ui/modal/DeleteModal";
import { TableActionHeader } from "../../common/TableActionHeader";

interface Especialista {
  id: number;
  cedula: string;
  nombresApellidos: string;
  fotoUrl: string | null;
  especialidad: {
    id: number;
    area: string;
  };
  sede: {
    id: number;
    nombre: string;
  };
  activo: boolean;
}

export default function EspecialistasAccionesTable() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEspecialista, setSelectedEspecialista] =
    useState<Especialista | null>(null);
  const navigate = useNavigate();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const fetchEspecialistas = async () => {
    try {
      setLoading(true);
      const data = await especialistasService.listarActivos();
      setEspecialistas(data);
    } catch (error) {
      console.error("Error fetching especialistas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialistas();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/especialistas/editar/${id}`);
  };

  const handleDeleteClick = (especialista: Especialista) => {
    setSelectedEspecialista(especialista);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (selectedEspecialista) {
      try {
        await especialistasService.eliminar(selectedEspecialista.id);
        toast.success("Especialista eliminado correctamente");
        await fetchEspecialistas();
        closeDeleteModal();
        setSelectedEspecialista(null);
      } catch (error) {
        toast.error("Error al eliminar especialista");
        console.error("Error al eliminar especialista:", error);
      }
    }
  };

  const getEstadoBadge = (estado: boolean) => {
    return estado === true ? "success" : "error";
  };

  const handleSearch = (term: string) => {
    console.log("Searching for:", term);
    // Implement search logic here if needed or filter locally
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <TableActionHeader
        title="Especialistas"
        onSearch={handleSearch}
        onNew={() => navigate("/especialistas/nuevo")}
        newButtonText="Nuevo Especialista"
        onExport={handleExport}
      />
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Cédula
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nombres
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Especialidad
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Sede
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Estado
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody>
            {especialistas.map((especialista) => (
              <TableRow key={especialista.id}>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {especialista.cedula}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {especialista.nombresApellidos}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {especialista.especialidad?.area || "N/A"}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {especialista.sede?.nombre || "N/A"}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  <Badge
                    size="sm"
                    color={getEstadoBadge(especialista.activo)}
                  >
                    {especialista.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(especialista.id)}
                      className="hover:bg-white hover:text-yellow-600 p-2 text-blue-600 dark:text-blue-400"
                      title="Editar"
                    >
                      <Pen size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(especialista)}
                      className="hover:bg-red-500 hover:text-white p-2 text-red-600 dark:text-red-400"
                      title="Eliminar"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar Especialista"
        description={`¿Estás seguro de que deseas eliminar al especialista ${selectedEspecialista?.nombresApellidos}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
