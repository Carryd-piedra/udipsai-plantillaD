import React from "react";
import Label from "../form/Label";

export interface PermissionsState {
  pacientes: boolean;
  pasantes: boolean;
  sedes: boolean;
  especialistas: boolean;
  especialidades: boolean;
  asignaciones: boolean;
  recursos: boolean;
  institucionesEducativas: boolean;
  historiaClinica: boolean;
  fonoAudiologia: boolean;
  psicologiaClinica: boolean;
  psicologiaEducativa: boolean;
}

interface PermisosTableProps {
  permissions: PermissionsState;
  onChange: (key: keyof PermissionsState, value: boolean) => void;
  readOnly?: boolean;
}

const permissionLabels: Record<keyof PermissionsState, string> = {
  pacientes: "Pacientes",
  pasantes: "Pasantes",
  sedes: "Sedes",
  especialistas: "Especialistas",
  especialidades: "Especialidades",
  asignaciones: "Asignaciones",
  recursos: "Recursos",
  institucionesEducativas: "Instituciones Educativas",
  historiaClinica: "Historia Clínica",
  fonoAudiologia: "Fonoaudiología",
  psicologiaClinica: "Psicología Clínica",
  psicologiaEducativa: "Psicología Educativa",
};

export const PermisosTable: React.FC<PermisosTableProps> = ({
  permissions,
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
        Gestión de Permisos
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(permissions) as Array<keyof PermissionsState>).map(
          (key) => (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                permissions[key]
                  ? "border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/10"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <Label
                className="cursor-pointer select-none"
                htmlFor={`perm-${key}`}
              >
                {permissionLabels[key]}
              </Label>
              <div className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  id={`perm-${key}`}
                  className="peer sr-only"
                  checked={permissions[key]}
                  onChange={(e) => onChange(key, e.target.checked)}
                  disabled={readOnly}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-500 peer-checked:after:translate-x-full dark:bg-gray-700 peer-focus:outline-none ring-offset-2 focus:ring-2 ring-brand-500/20"></div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
