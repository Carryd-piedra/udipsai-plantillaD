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
import { pasantesService } from "../../../services/pasantes";
import Button from "../../ui/button/Button";
import { useModal } from "../../../hooks/useModal";
import { DeleteModal } from "../../ui/modal/DeleteModal";
import { TableActionHeader } from "../../common/TableActionHeader";

interface Pasante {
  id: number;
  cedula: string;
  nombresApellidos: string;
  fotoUrl: string | null;
  inicioPasantia: string;
  finPasantia: string;
  tutor: {
    id: number;
    nombresApellidos: string;
  };
  activo: boolean;
}

export default function PasantesAccionesTable() {
  const [pasantes, setPasantes] = useState<Pasante[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPasante, setSelectedPasante] =
    useState<Pasante | null>(null);
  const navigate = useNavigate();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const fetchPasantes = async () => {
    try {
      setLoading(true);
      const data = await pasantesService.listar();
      setPasantes(data);
    } catch (error) {
      console.error("Error fetching pasantes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasantes();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/pasantes/editar/${id}`);
  };

  const handleDeleteClick = (pasante: Pasante) => {
    setSelectedPasante(pasante);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (selectedPasante) {
      try {
        await pasantesService.eliminar(selectedPasante.id);
        toast.success("Pasante eliminado correctamente");
        await fetchPasantes();
        closeDeleteModal();
        setSelectedPasante(null);
      } catch (error) {
        toast.error("Error al eliminar pasante");
        console.error("Error al eliminar pasante:", error);
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
        title="Pasantes"
        onSearch={handleSearch}
        onNew={() => navigate("/pasantes/nuevo")}
        newButtonText="Nuevo Pasante"
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
                Inicio Pasantía
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Fin Pasantía
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tutor
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
            {pasantes.map((pasante) => (
              <TableRow key={pasante.id}>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {pasante.cedula}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {pasante.nombresApellidos}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {pasante.inicioPasantia || "N/A"}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {pasante.finPasantia || "N/A"}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {pasante.tutor?.nombresApellidos || "N/A"}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  <Badge
                    size="sm"
                    color={getEstadoBadge(pasante.activo)}
                  >
                    {pasante.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(pasante.id)}
                      className="hover:bg-white hover:text-yellow-600 p-2 text-blue-600 dark:text-blue-400"
                      title="Editar"
                    >
                      <Pen size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(pasante)}
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
        title="Eliminar Pasante"
        description={`¿Estás seguro de que deseas eliminar al pasante ${selectedPasante?.nombresApellidos}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
