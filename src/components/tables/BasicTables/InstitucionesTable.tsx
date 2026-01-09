import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { institucionesService } from "../../../services/instituciones";

interface Institucion {
  id: number;
  nombreInstitucion: string;
  direccion: string;
  tipoInstitucion: string;
  institucionEstado: number;
}

export default function InstitucionesTable() {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstituciones = async () => {
      try {
        const data = await institucionesService.listar();
        setInstituciones(data);
      } catch (error) {
        console.error("Error fetching instituciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstituciones();
  }, []);

  const getEstadoBadge = (estado: number) => {
    return estado === 1 ? "success" : "error";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando instituciones...
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
                Id de institución
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nombre de la institución
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Dirección
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tipo de institución
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
            {instituciones.map((institucion) => (
              <TableRow key={institucion.id}>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {institucion.id}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {institucion.nombreInstitucion}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {institucion.direccion}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  {institucion.tipoInstitucion}
                </TableCell>
                <TableCell className="px-5 py-3 text-theme-xs text-gray-700 dark:text-gray-300">
                  <Badge
                    size="sm"
                    color={getEstadoBadge(institucion.institucionEstado)}
                  >
                    {institucion.institucionEstado === 1
                      ? "Activo"
                      : "Inactivo"}
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
