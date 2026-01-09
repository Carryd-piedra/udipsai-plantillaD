import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { especialistasService } from "../../../services/especialistas";

interface Especialista {
  cedula: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  especialidad: number;
  esPasante: boolean;
  especialistaEstado: boolean;
}

export default function EspecialistasTable() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEspecialistas = async () => {
      try {
        const data = await especialistasService.listarActivos();
        setEspecialistas(data);
      } catch (error) {
        console.error("Error fetching especialistas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEspecialistas();
  }, []);

  const getEstadoBadge = (estado: boolean) => {
    return estado === true ? 'success' : 'error';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando especialistas...
        </p>
      </div>
    );
  }

  return (
    <div>
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
                Apellidos
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
                Estado
              </TableCell>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody>
            {especialistas.map((especialista) => (
              <TableRow key={especialista.cedula}>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {especialista.cedula}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {especialista.primerNombre}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {especialista.primerApellido}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {especialista.especialidad}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  <Badge
                    size="sm"
                    color={getEstadoBadge(especialista.especialistaEstado)}
                  >
                    {especialista.especialistaEstado === true ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
