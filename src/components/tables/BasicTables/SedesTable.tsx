import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { sedesService } from "../../../services/sedes";

interface Sedes {
  id: number;
  nombre: string;
  estado: number;
}

export default function SedesTable() {
  const [sedes, setSedes] = useState<Sedes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await sedesService.listarActivos(0, 100);
        const sedesData = data?.content || [];
        setSedes(sedesData);
      } catch (error) {
        console.error("Error fetching sedes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSedes();
  }, []);

  const getEstadoBadge = (estado: number) => {
    return estado === 1 ? "success" : "error";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando sedes...
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
                Id de la sede
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nombre de la sede
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
            {sedes.map((sede) => (
              <TableRow key={sede.id}>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {sede.id}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {sede.nombre}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  <Badge size="sm" color={getEstadoBadge(sede.estado)}>
                    {sede.estado === 1 ? "Activo" : "Inactivo"}
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
