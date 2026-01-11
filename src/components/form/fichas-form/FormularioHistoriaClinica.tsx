
import { useState, useEffect, useRef } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Label from "../Label";
import DatosFamiliaresForm from "./sections/HistoriaClinica.tsx/DatosFamiliaresForm";
import HistoriaPrenatalForm from "./sections/HistoriaClinica.tsx/HistoriaPrenatalForm";
import HistoriaNatalForm from "./sections/HistoriaClinica.tsx/HistoriaNatalForm";
import HistoriaPostnatalForm from "./sections/HistoriaClinica.tsx/HistoriaPostnatalForm";
import DesarrolloMotorForm from "./sections/HistoriaClinica.tsx/DesarrolloMotorForm";
import AlimentacionForm from "./sections/HistoriaClinica.tsx/AlimentacionForm";
import AntecedentesMedicosForm from "./sections/HistoriaClinica.tsx/AntecedentesMedicosForm";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { fichasService } from "../../../services/fichas";
import { pacientesService } from "../../../services/pacientes";
import Input from "../../form/input/InputField";

export interface HistoriaClinicaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  datosFamiliares: {
    procedenciaPadre: string;
    procedenciaMadre: string;
    edadMadreAlNacimiento: string;
    edadPadreAlNacimiento: string;
    consanguinidad: boolean;
  };
  historiaPrenatal: {
    embarazoNumero: number;
    controlesEco: boolean;
    hijosVivos: number;
    segSemestreAborto: boolean;
    segSemestreAmenaza: boolean;
    alimentacion: boolean;
    ingestaMedicamentos: boolean;
  };
  historiaNatal: {
    parto: string;
    llantoAlNacer: string;
    colorPielNacimiento: string;
    cordonOmbilical: string;
    presenciaIctericia: string;
    transfucionSangre: string;
  };
  historiaPostnatal: {
    convulsiones: boolean;
    medicacion: boolean;
  };
  desarrolloMotor: {
    sostuvoLaCabeza: number;
    seSentoSolo: number;
    seParoSolo: number;
    caminoSolo: number;
    inicioGateo: number;
    tipoGateo: string;
    edadesSonrisaSocial: number;
    edadesBalbuceo: number;
    edadesPrimerasFrases: number;
  };
  alimentacion: {
    tomoSeno: boolean;
    edadDesteteTomoSeno: number;
    tomoBiberon: boolean;
    edadDesteteTomoBiberon: number;
    edadInicioComidaSolida: number;
    habitosAlimenticiosActuales: string;
    edadDejoPanial: number;
    edadControlEsfinferesDiurno: number;
    edadControlEsfinferesNocturno: number;
    seVisteSolo: boolean;
  };
  antecedentesMedicos: {
    alergias: string;
    enfermedadesVirales: string;
    hospitalizacionesQuirurgicasYCausas: string;
    accidentesYSecuelas: string;
    tomaMedicacionActualmente: string;
    examenesComplementariosRealizados: string;
    antecedentesPatologicosFamiliares: string;
    vacunacionC: string;
  };
}

export const initialHistoriaClinicaState: HistoriaClinicaState = {
  pacienteId: 0,
  activo: true,
  datosFamiliares: {
    procedenciaPadre: "",
    procedenciaMadre: "",
    edadMadreAlNacimiento: "",
    edadPadreAlNacimiento: "",
    consanguinidad: false,
  },
  historiaPrenatal: {
    embarazoNumero: 1,
    controlesEco: false,
    hijosVivos: 1,
    segSemestreAborto: false,
    segSemestreAmenaza: false,
    alimentacion: false,
    ingestaMedicamentos: false,
  },
  historiaNatal: {
    parto: "NORMAL",
    llantoAlNacer: "INMEDIATO",
    colorPielNacimiento: "NORMOCROMICO",
    cordonOmbilical: "OTRO",
    presenciaIctericia: "NO",
    transfucionSangre: "NO",
  },
  historiaPostnatal: {
    convulsiones: false,
    medicacion: false,
  },
  desarrolloMotor: {
    sostuvoLaCabeza: 0,
    seSentoSolo: 0,
    seParoSolo: 0,
    caminoSolo: 0,
    inicioGateo: 0,
    tipoGateo: "",
    edadesSonrisaSocial: 0,
    edadesBalbuceo: 0,
    edadesPrimerasFrases: 0,
  },
  alimentacion: {
    tomoSeno: false,
    edadDesteteTomoSeno: 0,
    tomoBiberon: false,
    edadDesteteTomoBiberon: 0,
    edadInicioComidaSolida: 0,
    habitosAlimenticiosActuales: "",
    edadDejoPanial: 0,
    edadControlEsfinferesDiurno: 0,
    edadControlEsfinferesNocturno: 0,
    seVisteSolo: false,
  },
  antecedentesMedicos: {
    alergias: "",
    enfermedadesVirales: "",
    hospitalizacionesQuirurgicasYCausas: "",
    accidentesYSecuelas: "",
    tomaMedicacionActualmente: "",
    examenesComplementariosRealizados: "",
    antecedentesPatologicosFamiliares: "",
    vacunacionC: "",
  },
};

export default function FormularioHistoriaClinica() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState<HistoriaClinicaState>(initialHistoriaClinicaState);
    const [genogramaFile, setGenogramaFile] = useState<File | null>(null);
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
        const data = await fichasService.obtenerHistoriaClinica(fichaId);
        if (data) {
            setFormData(data);
        } else {
            toast.error("No se encontró la ficha");
            navigate("/historia-clinica");
        }
        } catch (error) {
        console.error("Error loading ficha:", error);
        toast.error("Error al cargar la ficha");
        navigate("/historia-clinica");
        } finally {
        setLoading(false);
        }
    };

    const handleNestedChange = (
        section: keyof HistoriaClinicaState,
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
        await fichasService.actualizarHistoriaClinica(Number(id), formData);
        toast.success("Ficha actualizada exitosamente");
      } else {
        await fichasService.crearHistoriaClinica(formData, genogramaFile || undefined);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/historia-clinica");
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
                <Button variant="outline" onClick={() => navigate("/historia-clinica")}>
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

      <ComponentCard title="Datos Familiares">
        <DatosFamiliaresForm
          data={formData.datosFamiliares}
          onChange={(field, val) =>
            handleNestedChange("datosFamiliares", field, val)
          }
        />
      </ComponentCard>

      <ComponentCard title="Historia Prenatal">
        <HistoriaPrenatalForm
          data={formData.historiaPrenatal}
          onChange={(field, val) =>
            handleNestedChange("historiaPrenatal", field, val)
          }
        />
      </ComponentCard>

      <ComponentCard title="Historia Natal">
        <HistoriaNatalForm
          data={formData.historiaNatal}
          onChange={(field, val) =>
            handleNestedChange("historiaNatal", field, val)
          }
        />
      </ComponentCard>

      <ComponentCard title="Historia Postnatal">
        <HistoriaPostnatalForm
          data={formData.historiaPostnatal}
          onChange={(field, val) =>
            handleNestedChange("historiaPostnatal", field, val)
          }
        />
      </ComponentCard>

      <ComponentCard title="Desarrollo Motor">
        <DesarrolloMotorForm
          data={formData.desarrolloMotor}
          onChange={(field, val) =>
            handleNestedChange("desarrolloMotor", field, val)
          }
        />
      </ComponentCard>

      <ComponentCard title="Alimentación y Hábitos">
        <AlimentacionForm
          data={formData.alimentacion}
          onChange={(field, val) =>
            handleNestedChange("alimentacion", field, val)
          }
        />
      </ComponentCard>

      <ComponentCard title="Antecedentes Médicos">
        <AntecedentesMedicosForm
          data={formData.antecedentesMedicos}
          onChange={(field, val) =>
            handleNestedChange("antecedentesMedicos", field, val)
          }
        />
      </ComponentCard>

      <ComponentCard title="Genograma">
        <div className="space-y-2">
          <Label>Archivo de Genograma (Imagen/PDF)</Label>
          <input
            type="file"
            onChange={(e) => setGenogramaFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500"
          />
        </div>
      </ComponentCard>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/historia-clinica")}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : isEdit ? "Actualizar Ficha" : "Guardar Ficha"}
        </Button>
      </div>
    </div>
  );
}
