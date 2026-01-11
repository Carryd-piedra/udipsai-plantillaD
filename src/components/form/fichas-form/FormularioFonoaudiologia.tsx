
import { useState, useEffect, useRef } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { fichasService } from "../../../services/fichas";
import { pacientesService } from "../../../services/pacientes";
import Input from "../../form/input/InputField";

import HablaForm from "./sections/Fonoaudiologia/HablaForm";
import AudicionForm from "./sections/Fonoaudiologia/AudicionForm";
import FonacionForm from "./sections/Fonoaudiologia/FonacionForm";
import HistoriaAuditivaForm from "./sections/Fonoaudiologia/HistoriaAuditivaForm";
import VestibularForm from "./sections/Fonoaudiologia/VestibularForm";
import OtoscopiaForm from "./sections/Fonoaudiologia/OtoscopiaForm";

export interface FonoaudiologiaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  habla: any;
  audicion: any;
  fonacion: any;
  historiaAuditiva: any;
  vestibular: any;
  otoscopia: any;
}

export const initialFonoaudiologiaState: FonoaudiologiaState = {
  pacienteId: 0,
  activo: true,
  habla: {
    dificultadPronunciarPalabras: false,
    seTrabaCuandoHabla: false,
    seEntiendeLoQueDice: false,
    sabeComoLlamanObjetosEntorno: false,
    comprendeLoQueSeLeDice: false,
    reconoceFuenteSonora: false,
    comunicacionPreferentementeForma: "VERBAL",
    trastornoEspecificoPronunciacion: false,
    trastornoLenguajeExpresivo: false,
    afasiaAdquiridaEpilepsia: false,
    otrosTrastornosDesarrolloHabla: false,
    trastornoDesarrolloHablaLenguaje: false,
    trastornoRecepcionLenguaje: false,
    alteracionesHabla: false,
    disfasiaAfasia: false,
    disartriaAnartria: false,
    otrasAlteracionesHabla: false
  },
  audicion: {
    seARealizadoExamenAudiologico: false,
    perdidaAuditivaConductivaNeurosensorial: false,
    hipoacusiaConductivaBilateral: false,
    hipoacusiaConductivaUnilateral: false,
    hipoacusiaNeurosensorialBilateral: false,
    hipoacusiaNeurosensorialUnilateral: false,
    infeccionesOidoFuertes: false,
    cualInfeccionesOidoFuertes: "",
    edadInfeccionesOidoFuertes: 0,
    perdidaAuditiva: false,
    unilateral: false,
    oidoDerecho: false,
    oidoIzquierdo: false,
    bilateral: false,
    gradoPerdida: "SÚBITA",
    permanecia: "TEMPORAL",
    otitis: false,
    tipoOtitis: "MEDIO",
    duracionOtitisInicio: "",
    duracionOtitisFin: "",
    antecedentesFamiliares: false,
    exposisionRuidos: false,
    duracionExposisionRuidosInicio: "",
    duracionExposisionRuidosFin: "",
    ototoxicos: false,
    infecciones: false,
    usoAudifonos: false,
    inicioUsoAudifonos: "",
    finUsoAudifonos: "",
    implanteCoclear: false,
    tratamientoFonoaudiologicoPrevio: false,
    atenidoPerdidaAudicionPasado: false
  },
  fonacion: {
    creeTonoVozEstudianteApropiado: false,
    respiracionNormal: false,
    situacionesAlteraTonoVoz: "",
    desdeCuandoAlteracionesVoz: "",
    tonoDeVoz: "",
    respiracion: "",
    ronca: false,
    juegoVocal: false,
    vocalizacion: false,
    balbuceo: false,
    silabeo: false,
    primerasPalabras: false,
    oracionesDosPalabras: false,
    oracionesTresPalabras: false,
    formacionLinguisticaCompleta: false,
    numeroTotalPalabras: 0
  },
  historiaAuditiva: {
    otalgia: false,
    otalgiaUnilateral: false,
    otalgiaOidoDerecho: false,
    otalgiaOidoIzquierdo: false,
    otalgiaBilateral: false,
    permanenciaOtalgiaContinua: false,
    permanenciaOtalgiaIntermitente: false,
    gradoPermanenciaOtalgia: "MEDIA",
    asociadaOtalgiaInfeccionRespiratoriaAlta: false,
    infeccionRespiratoriaPunzante: false,
    infeccionRespiratoriaPulsatil: false,
    infeccionRespiratoriaProgresivo: false,
    infeccionRespiratoriaOpresivo: false,
    pruriginoso: false,
    aumentaMasticar: false,
    disminuyeConCalorLocal: false,
    aumentaConCalorLocal: false,
    otorrea: false,
    otorreaUnilateral: false,
    otorreaOidoDerecho: false,
    otorreaOidoIzquierdo: false,
    otorreaBilateral: false,
    permanenciaOtorreaContinua: false,
    permanenciaOtorreaIntermitente: false,
    gradoPermanenciaOtorrea: "MEDIA",
    aspectoClaroOtorrea: false,
    aspectoSerosoOtorrea: false,
    aspectoMucosoOtorrea: false,
    aspectoMucopurulentoOtorrea: false,
    aspectoPurulentoOtorrea: false,
    aspectoSanguinolentoOtorrea: false,
    asosiadaOtorreaInfeccionRespiratoriaAlta: false,
    asosiadaotorreaInfeccionAgudaOido: false,
    presentoOtalgia: false,
    presentoOtalgiaBilateral: false,
    presentoOtalgiaOidoDerecho: false,
    presentoOtalgiaOidoIzquierdo: false,
    presentoSensacionOidoTapado: false,
    presentoSensacionOidoTapadoBilateral: false,
    presentoSensacionOidoTapadoOidoDerecho: false,
    presentoSensacionOidoTapadoOidoIzquierdo: false,
    presentoAutofonia: false,
    presentoAutofoniaBilateral: false,
    presentoAutofoniaOidoDerecho: false,
    presentoAutofoniaOidoIzquierdo: false,
    presentoOtorrea: false,
    presentoOtorreaBilateral: false,
    presentoOtorreaOidoDerecho: false,
    presentoOtorreaOidoIzquierdo: false,
    aumentaVolumenTV: false,
    sensacionPercibirTinnitus: false,
    expuestoRuidosFuertes: false,
    dificultadOidVozBaja: false,
    hablaMasFuerteOMasDespacio: false,
    utilizaAyudaAuditiva: false,
    especficarAyudaAuditiva: "",
    percibeSonidoIgualAmbosOidos: false,
    conQueOidoEscuchaMejor: "AMBOS",
    haceCuantoTiempoPresentaSintomasAuditivos: "DÍAS"
  },
  vestibular: {
    faltaEquilibrioCaminar: false,
    mareos: false,
    cuandoMareos: "SIEMPRE",
    vertigo: false
  },
  otoscopia: {
    palpacionPabellonOidoDerecho: "NORMAL",
    palpacionMastoidesOidoDerecho: "NORMAL",
    caeOidoDerecho: "NORMAL",
    obstruccionOidoDerecho: "SI",
    aparienciaMenbranaTimpanicaOidoDerecho: "NORMAL",
    perforacionOidoDerecho: false,
    burbujaOidoDerecho: false,
    coloracionOidoDerecho: "NORMAL",
    palpacionPabellonOidoIzquierdo: "NORMAL",
    palpacionMastoidesOidoIzquierdo: "NORMAL",
    caeOidoIzquierdo: "NORMAL",
    obstruccionOidoIzquierdo: "SI",
    aparienciaMenbranaTimpanicaOidoIzquierdo: "NORMAL",
    perforacionOidoIzquierdo: false,
    burbujaOidoIzquierdo: false,
    coloracionOidoIzquierdo: "NORMAL"
  }
};

export default function FormularioFonoaudiologia() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<FonoaudiologiaState>(initialFonoaudiologiaState);
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
      const data = await fichasService.obtenerFonoaudiologia(fichaId);
      if (data) {
        setFormData(data);
        if (data.pacienteId) {
            // Optionally load patient details if needed for display, 
            // though usually ficha data might contain nested patient info or just ID.
            // For now assuming we just need the form data.
        }
      } else {
        toast.error("No se encontró la ficha");
        navigate("/fonoaudiologia");
      }
    } catch (error) {
      console.error("Error loading ficha:", error);
      toast.error("Error al cargar la ficha");
      navigate("/fonoaudiologia");
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (
    section: keyof FonoaudiologiaState,
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
        await fichasService.actualizarFonoaudiologia(Number(id), formData);
        toast.success("Ficha actualizada exitosamente");
      } else {
        await fichasService.crearFonoaudiologia(formData);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/fonoaudiologia");
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
                <Button variant="outline" onClick={() => navigate("/fonoaudiologia")}>
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

      <ComponentCard title="Habla / Lenguaje">
        <HablaForm
          data={formData.habla}
          onChange={(field, val) => handleNestedChange("habla", field, val)}
        />
      </ComponentCard>

      <ComponentCard title="Audición">
        <AudicionForm
          data={formData.audicion}
          onChange={(field, val) => handleNestedChange("audicion", field, val)}
        />
      </ComponentCard>

      <ComponentCard title="Fonación / Voz">
        <FonacionForm
          data={formData.fonacion}
          onChange={(field, val) => handleNestedChange("fonacion", field, val)}
        />
      </ComponentCard>

      <ComponentCard title="Historia Auditiva">
        <HistoriaAuditivaForm
          data={formData.historiaAuditiva}
          onChange={(field, val) => handleNestedChange("historiaAuditiva", field, val)}
        />
      </ComponentCard>

      <ComponentCard title="Vestibular / Equilibrio">
        <VestibularForm
          data={formData.vestibular}
          onChange={(field, val) => handleNestedChange("vestibular", field, val)}
        />
      </ComponentCard>

      <ComponentCard title="Otoscopia">
        <OtoscopiaForm
          data={formData.otoscopia}
          onChange={(field, val) => handleNestedChange("otoscopia", field, val)}
        />
      </ComponentCard>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/fonoaudiologia")}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : isEdit ? "Actualizar Ficha" : "Guardar Ficha"}
        </Button>
      </div>
    </div>
  );
}
