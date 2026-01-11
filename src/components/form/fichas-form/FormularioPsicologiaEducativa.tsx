
import { useState, useEffect, useRef } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { fichasService } from "../../../services/fichas";
import { pacientesService } from "../../../services/pacientes";
import Input from "../../form/input/InputField";

import HistoriaEscolarForm from "./sections/PsicologiaEducativa.tsx/HistoriaEscolarForm";
import DesarrolloForm from "./sections/PsicologiaEducativa.tsx/DesarrolloForm";
import AdaptacionForm from "./sections/PsicologiaEducativa.tsx/AdaptacionForm";
import EstadoGeneralForm from "./sections/PsicologiaEducativa.tsx/EstadoGeneralForm";

export interface FichaPsicologiaEducativaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  historiaEscolar: {
    asignaturasGustan: string;
    asignaturasDisgustan: string;
    relacionDocentes: string;
    causaRelacionDocentes: string;
    gustaIrInstitucion: boolean;
    causaGustaIrInstitucion: string;
    relacionConGrupo: string;
    causaRelacionConGrupo: string;
    
  };
  desarrollo: {
    cdi: boolean;
    cdiEdad: string;
    inicial1: boolean;
    inicial1Edad: number;
    inicial2: boolean;
    inicial2Edad: number;
    primerEGB: boolean;
    edad1roEGB: number;
    perdidaAnio: boolean;
    gradoCausaPerdidaAnio: string;
    desercionEscolar: boolean;
    gradoCausaDesercionEscolar: string;
    cambioInstitucion: boolean;
    gradoCausaCambioInstitucion: string;
    problemasAprendizaje: boolean;
    problemasAprendizajeEspecificar: string;
  };
  adaptacion: {
    inclusionEducativa: boolean;
    causaInclusionEducativa: string;
    adaptacionesCurriculares: boolean;
    gradoAdaptacion: string;
    especifiqueAsignaturas: string;
    evaluacionPsicologicaUOtrosAnterior: boolean;
    causaEvaluacionPsicologicaUOtrosAnterior: string;
    recibeApoyo: boolean;
    causaLugarTiempoRecibeApoyo: string;
  };
  estadoGeneral: {
    aprovechamientoGeneral: string;
    actividadEscolar: string;
    observaciones: string;
  };
}

export const initialPsicologiaEducativaState: FichaPsicologiaEducativaState = {
  pacienteId: 0,
  activo: true,
  historiaEscolar: {
    asignaturasGustan: "",
    asignaturasDisgustan: "",
    relacionDocentes: "REGULAR",
    causaRelacionDocentes: "",
    gustaIrInstitucion: false,
    causaGustaIrInstitucion: "",
    relacionConGrupo: "REGULAR",
    causaRelacionConGrupo: "",
  },
  desarrollo: {
    cdi: false,
    cdiEdad: "",
    inicial1: false,
    inicial1Edad: 0,
    inicial2: false,
    inicial2Edad: 0,
    primerEGB: false,
    edad1roEGB: 0,
    perdidaAnio: false,
    gradoCausaPerdidaAnio: "",
    desercionEscolar: false,
    gradoCausaDesercionEscolar: "",
    cambioInstitucion: false,
    gradoCausaCambioInstitucion: "",
    problemasAprendizaje: false,
    problemasAprendizajeEspecificar: "",
  },
  adaptacion: {
    inclusionEducativa: false,
    causaInclusionEducativa: "",
    adaptacionesCurriculares: false,
    gradoAdaptacion: "",
    especifiqueAsignaturas: "",
    evaluacionPsicologicaUOtrosAnterior: false,
    causaEvaluacionPsicologicaUOtrosAnterior: "",
    recibeApoyo: false,
    causaLugarTiempoRecibeApoyo: "",
  },
  estadoGeneral: {
    aprovechamientoGeneral: "REGULAR",
    actividadEscolar: "",
    observaciones: "",
  },
};

export default function FormularioPsicologiaEducativa() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FichaPsicologiaEducativaState>(initialPsicologiaEducativaState);
  const [loading, setLoading] = useState(false);
  
  // Create Mode state
  const isEdit = !!id;
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadFicha(id);
    }
  }, [id, isEdit]);

  const loadFicha = async (fichaId: string) => {
    try {
      setLoading(true);
      const data = await fichasService.obtenerPsicologiaEducativa(fichaId);
      if (data) {
        setFormData(data);
      } else {
        toast.error("No se encontró la ficha");
        navigate("/psicologia-educativa");
      }
    } catch (error) {
      console.error("Error loading ficha:", error);
      toast.error("Error al cargar la ficha");
      navigate("/psicologia-educativa");
    } finally {
      setLoading(false);
    }
  };


  const handleNestedChange = (
    section: keyof FichaPsicologiaEducativaState,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
    }

    if (value.length > 2) {
        searchTimeoutRef.current = setTimeout(() => {
            searchPatients(value);
        }, 300);
    } else {
        setSearchResults([]);
        setShowResults(false);
    }
  };

  const searchPatients = async (term: string) => {
    try {
        const response = await pacientesService.filtrar({ search: term }, 0, 5);
        setSearchResults(response.content);
        setShowResults(true);
    } catch (error) {
        console.error("Error searching patients", error);
    }
  };

  const selectPatient = (patient: any) => {
      setSelectedPatient(patient);
      setFormData(prev => ({ ...prev, pacienteId: patient.id }));
      setSearchTerm("");
      setShowResults(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (isEdit && id) {
        await fichasService.actualizarPsicologiaEducativa(Number(id), formData);
        toast.success("Ficha actualizada exitosamente");
      } else {
        await fichasService.crearPsicologiaEducativa(formData);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/psicologia-educativa");
    } catch (error: any) {
         if (error.response?.status === 409) {
            toast.error("Este paciente ya tiene una ficha activa.");
        } else {
            toast.error(isEdit ? "Error al actualizar la ficha" : "Error al crear la ficha");
        }
      console.error("Error saving ficha:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando ficha...
        </p>
      </div>
    );
  }

  // Show Patient Selection if New and no patient selected
  if (!isEdit && !selectedPatient) {
      return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Seleccionar Paciente</h2>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Buscar Paciente
                </label>
                <div className="relative w-full max-w-md">
                        <Input
                            type="text"
                            onChange={handleSearchChange}
                            value={searchTerm}
                            placeholder="Buscar por nombre o cédula..."
                            className="w-full"
                        />
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute z-10 w-full bg-white mt-1 border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.map((p) => (
                                    <div 
                                        key={p.id}
                                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                        onClick={() => selectPatient(p)}
                                    >
                                        <div className="font-medium text-slate-800">{p.nombres} {p.apellidos}</div>
                                        <div className="text-xs text-slate-500">{p.cedula}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {showResults && searchResults.length === 0 && (
                            <div className="absolute z-10 w-full bg-white mt-1 border border-slate-200 rounded-md shadow-lg p-3 text-slate-500 text-sm">
                                No se encontraron pacientes
                            </div>
                        )}
                </div>
            </div>
            <div className="flex justify-end">
                <Button variant="outline" onClick={() => navigate("/psicologia-educativa")}>
                     Cancelar
                </Button>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      {!isEdit && selectedPatient && (
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
            <div>
                <span className="font-semibold text-blue-900">Paciente:</span> {selectedPatient.nombres} {selectedPatient.apellidos} ({selectedPatient.cedula})
            </div>
            <button 
                onClick={() => { setSelectedPatient(null); setFormData(prev => ({...prev, pacienteId: 0})); }}
                className="text-sm text-blue-600 hover:underline"
            >
                Cambiar Paciente
            </button>
        </div>
      )}

      <ComponentCard title="Historia Escolar">
        <HistoriaEscolarForm
          data={formData.historiaEscolar}
          onChange={(field, value) =>
            handleNestedChange("historiaEscolar", field, value)
          }
        />
      </ComponentCard>
      <ComponentCard title="Desarrollo">
        <DesarrolloForm
          data={formData.desarrollo}
          onChange={(field, value) =>
            handleNestedChange("desarrollo", field, value)
          }
        />
      </ComponentCard>
      <ComponentCard title="Adaptación">
        <AdaptacionForm
          data={formData.adaptacion}
          onChange={(field, value) =>
            handleNestedChange("adaptacion", field, value)
          }
        />
      </ComponentCard>
      <ComponentCard title="Estado General">
        <EstadoGeneralForm
          data={formData.estadoGeneral}
          onChange={(field, value) =>
            handleNestedChange("estadoGeneral", field, value)
          }
        />
      </ComponentCard>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/psicologia-educativa")}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : isEdit ? "Actualizar Ficha" : "Guardar Ficha"}
        </Button>
      </div>
    </div>
  );
}
