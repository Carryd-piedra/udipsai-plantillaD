import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Label from "../Label";
import InformacionGeneralForm from "./sections/HistoriaClinica.tsx/InformacionGeneralForm";
import DatosFamiliaresForm from "./sections/HistoriaClinica.tsx/DatosFamiliaresForm";
import HistoriaPrenatalForm from "./sections/HistoriaClinica.tsx/HistoriaPrenatalForm";
import HistoriaNatalForm from "./sections/HistoriaClinica.tsx/HistoriaNatalForm";
import HistoriaPostnatalForm from "./sections/HistoriaClinica.tsx/HistoriaPostnatalForm";
import DesarrolloMotorForm from "./sections/HistoriaClinica.tsx/DesarrolloMotorForm";
import AlimentacionForm from "./sections/HistoriaClinica.tsx/AlimentacionForm";
import AntecedentesMedicosForm from "./sections/HistoriaClinica.tsx/AntecedentesMedicosForm";
import Switch from "../switch/Switch";
import {
  Baby,
  Activity,
  FileText,
  HeartPulse,
  User,
  Download,
  Plus,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { fichasService } from "../../../services/fichas";
import { pacientesService } from "../../../services/pacientes";
import PatientSelector from "../../common/PatientSelector";

export interface HistoriaClinicaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  fecha: string;
  informacionGeneral: {
    fuenteDeInformacion: string;
    motivoConsulta: string;
    parentesco: string;
    personaQueDeriva: string;
    viveCon: string;
    viveConOtro: string;
    vivenJuntos: boolean;
    otrosCompromisos: string;
    tipoFamilia: string;
    hijosOtrosFamiliaresVivenCasa: string;
    genogramaUrl: string;
  };

  datosFamiliares: {
    nombrePadre: string;
    edadPadre: string;
    ocupacionPadre: string;
    instruccionPadre: string;
    estadoCivilPadre: string;
    lugarResidenciaPadre: string;
    nombreMadre: string;
    edadMadre: string;
    ocupacionMadre: string;
    instruccionMadre: string;
    estadoCivilMadre: string;
    lugarResidenciaMadre: string;
    numeroHermanos: string;
    lugarQueOcupa: string;
    direccionDomiciliaria: string;
  };
  historiaPrenatal: {
    embarazoDeseado: boolean;
    controlEmbarazo: boolean;
    causaControlEmbarazo: string;
    enfermedadesMadre: string;
    consumoMedicamentosToxicos: string;
    presentoAmenazaAborto: boolean;
    mesAmenazaAborto: string;
    causaAmenazaAborto: string;
    estadoEmocional: string;
  };
  historiaNatal: {
    dondeNacio: string;
    ciudadNacimiento: string;
    duracionEmbarazo: string;
    tipoParto: string;
    partoSegunElComienzo: string;
    partoSegunFinalizacion: string;
    lloroAlNacer: boolean;
    pesoAlNacer: string;
    tallaAlNacer: string;
    anoxiaAlNacer: boolean;
    hipoxiaAlNacer: boolean;
    ictericiaAlNacer: boolean;
    cianosisAlNacer: boolean;
    malformacionCongenita: string;
    problemasDeAlimentacion: string;
    complicacionesEnElParto: boolean;
    cualComplicacionParto: string;
    estuvoEnIncubadora: boolean;
    tiempoEnIncubadora: string;
    causaDeIncubadora: string;
  };
  historiaPostnatal: {
    esquemaVacunacionCompleto: boolean;
    convulsiones: boolean;
    medicacion: boolean;
  };
  desarrolloMotor: {
    controlCefalico: string;
    sedestacion: string;
    hipedestacion: string;
    caminaConApoyo: string;
    caminaSolo: string;
    subeEscaleras: string;
    controlEsfinteres: string;
    salta: string;
    corre: string;
    gateo: string;
    prefiereManoIzquierdaDerecha: string;
    caeOPerdeEquilibrioFacilmente: string;
  };
  alimentacion: {
    dejoPechoMaterno: string;
    biberon: string;
    alimentoPorSiSoloCuchara: string;
    edadIntegroDietaFamiliar: string;
  };
  antecedentesMedicos: {
    enfermedadesConTratamiento: string;
    alergias: string;
    intervencionesQuirurgicas: string;
    medicamentosRequeridosOConsumo: string;
    enfermedadesDiscapacidadesFamiliares: string;
    trastornosPsicologicosFamiliares: string;
    problemasAprendizajeFamiliares: string;
  };
}

export const initialHistoriaClinicaState: HistoriaClinicaState = {
  pacienteId: 0,
  activo: true,
  fecha: "",
  informacionGeneral: {
    fuenteDeInformacion: "",
    motivoConsulta: "",
    parentesco: "",
    personaQueDeriva: "",
    viveCon: "",
    viveConOtro: "",
    vivenJuntos: false,
    otrosCompromisos: "",
    tipoFamilia: "",
    hijosOtrosFamiliaresVivenCasa: "",
    genogramaUrl: "",
  },

  datosFamiliares: {
    nombrePadre: "",
    edadPadre: "",
    ocupacionPadre: "",
    instruccionPadre: "",
    estadoCivilPadre: "",
    lugarResidenciaPadre: "",
    nombreMadre: "",
    edadMadre: "",
    ocupacionMadre: "",
    instruccionMadre: "",
    estadoCivilMadre: "",
    lugarResidenciaMadre: "",
    numeroHermanos: "",
    lugarQueOcupa: "",
    direccionDomiciliaria: "",
  },
  historiaPrenatal: {
    embarazoDeseado: false,
    controlEmbarazo: false,
    causaControlEmbarazo: "",
    enfermedadesMadre: "",
    consumoMedicamentosToxicos: "",
    presentoAmenazaAborto: false,
    mesAmenazaAborto: "",
    causaAmenazaAborto: "",
    estadoEmocional: "",
  },
  historiaNatal: {
    dondeNacio: "",
    ciudadNacimiento: "",
    duracionEmbarazo: "",
    tipoParto: "",
    partoSegunElComienzo: "",
    partoSegunFinalizacion: "",
    lloroAlNacer: false,
    pesoAlNacer: "",
    tallaAlNacer: "",
    anoxiaAlNacer: false,
    hipoxiaAlNacer: false,
    ictericiaAlNacer: false,
    cianosisAlNacer: false,
    malformacionCongenita: "",
    problemasDeAlimentacion: "",
    complicacionesEnElParto: false,
    cualComplicacionParto: "",
    estuvoEnIncubadora: false,
    tiempoEnIncubadora: "",
    causaDeIncubadora: "",
  },
  historiaPostnatal: {
    esquemaVacunacionCompleto: false,
    convulsiones: false,
    medicacion: false,
  },
  desarrolloMotor: {
    controlCefalico: "",
    sedestacion: "",
    hipedestacion: "",
    caminaConApoyo: "",
    caminaSolo: "",
    subeEscaleras: "",
    controlEsfinteres: "",
    salta: "",
    corre: "",
    gateo: "",
    prefiereManoIzquierdaDerecha: "",
    caeOPerdeEquilibrioFacilmente: "",
  },
  alimentacion: {
    dejoPechoMaterno: "",
    biberon: "",
    alimentoPorSiSoloCuchara: "",
    edadIntegroDietaFamiliar: "",
  },
  antecedentesMedicos: {
    enfermedadesConTratamiento: "",
    alergias: "",
    intervencionesQuirurgicas: "",
    medicamentosRequeridosOConsumo: "",
    enfermedadesDiscapacidadesFamiliares: "",
    trastornosPsicologicosFamiliares: "",
    problemasAprendizajeFamiliares: "",
  },
};

export default function FormularioHistoriaClinica() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<HistoriaClinicaState>(
    initialHistoriaClinicaState,
  );
  const [genogramaFile, setGenogramaFile] = useState<File | null>(null);
  const [genogramaPreview, setGenogramaPreview] = useState<string | null>(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [loading, setLoading] = useState(false);

  // Section Visibility State
  const [verInformacionGeneral, setVerInformacionGeneral] = useState(true);
  const [verDatosFamiliares, setVerDatosFamiliares] = useState(false);
  const [verHistoriaPrenatal, setVerHistoriaPrenatal] = useState(false);
  const [verHistoriaNatal, setVerHistoriaNatal] = useState(false);
  const [verHistoriaPostnatal, setVerHistoriaPostnatal] = useState(false);
  const [verDesarrolloMotor, setVerDesarrolloMotor] = useState(false);
  const [verAlimentacion, setVerAlimentacion] = useState(false);
  const [verAntecedentesMedicos, setVerAntecedentesMedicos] = useState(false);
  const [verGenograma, setVerGenograma] = useState(false);

  // Group Visibility State
  const [areaNacimiento, setAreaNacimiento] = useState(false);
  const [areaDesarrollo, setAreaDesarrollo] = useState(false);

  // Patient Selection State
  const [selectedPatient, setSelectedPatient] = useState<{
    nombresApellidos: string;
    cedula: string;
  } | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  // Create Mode state
  const isEdit = !!id;
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pacienteIdParam = searchParams.get("pacienteId");
    if (isEdit && id) {
      loadFicha(id);
    } else if (pacienteIdParam) {
      loadPacienteFromUrl(pacienteIdParam);
    } else {
      // New ficha with no URL param -> Show selector
      setShowSelector(true);
    }
  }, [id, isEdit, searchParams]);

  const loadPacienteFromUrl = async (id: string) => {
    try {
      setLoading(true);
      const paciente = await pacientesService.obtenerPorId(id);
      if (paciente) {
        setFormData((prev) => ({ ...prev, pacienteId: paciente.id }));
        setSelectedPatient(paciente);
        setShowSelector(false); // Ensure selector is hidden
      }
    } catch (error) {
      console.error("Error loading patient from URL", error);
      toast.error("Error al cargar datos del paciente asociado");
    } finally {
      setLoading(false);
    }
  };

  const isSectionEmpty = (sectionData: any, initialSectionData: any) => {
    if (!sectionData) return true;

    return Object.keys(initialSectionData).every((key) => {
      const v1 = sectionData[key];
      const v2 = initialSectionData[key];

      // Normalizar null/undefined a "" para comparar con los valores iniciales
      const normalize = (v: any) => (v === null || v === undefined ? "" : v);

      return normalize(v1) === normalize(v2);
    });
  };

  const loadFicha = async (fichaId: string) => {
    try {
      setLoading(true);
      const data = await fichasService.obtenerHistoriaClinica(fichaId);
      if (data) {
        const loadedData = {
          ...data,
          pacienteId: data.pacienteId || data.paciente?.id,
          fecha: data.fecha ? data.fecha : "",
          informacionGeneral:
            data.informacionGeneral ||
            initialHistoriaClinicaState.informacionGeneral,
          datosFamiliares:
            data.datosFamiliares || initialHistoriaClinicaState.datosFamiliares,
          historiaPrenatal:
            data.historiaPrenatal ||
            initialHistoriaClinicaState.historiaPrenatal,
          historiaNatal:
            data.historiaNatal || initialHistoriaClinicaState.historiaNatal,
          historiaPostnatal:
            data.historiaPostnatal ||
            initialHistoriaClinicaState.historiaPostnatal,
          desarrolloMotor:
            data.desarrolloMotor || initialHistoriaClinicaState.desarrolloMotor,
          alimentacion:
            data.alimentacion || initialHistoriaClinicaState.alimentacion,
          antecedentesMedicos:
            data.antecedentesMedicos ||
            initialHistoriaClinicaState.antecedentesMedicos,
        };
        setFormData(loadedData);

        // Auto-open sections with data
        const hasInfoGeneral = !isSectionEmpty(
          data.informacionGeneral,
          initialHistoriaClinicaState.informacionGeneral,
        );
        const hasDatosFam = !isSectionEmpty(
          data.datosFamiliares,
          initialHistoriaClinicaState.datosFamiliares,
        );
        const hasPrenatal = !isSectionEmpty(
          data.historiaPrenatal,
          initialHistoriaClinicaState.historiaPrenatal,
        );
        const hasNatal = !isSectionEmpty(
          data.historiaNatal,
          initialHistoriaClinicaState.historiaNatal,
        );
        const hasPostnatal = !isSectionEmpty(
          data.historiaPostnatal,
          initialHistoriaClinicaState.historiaPostnatal,
        );
        const hasMotor = !isSectionEmpty(
          data.desarrolloMotor,
          initialHistoriaClinicaState.desarrolloMotor,
        );
        const hasAlimentacion = !isSectionEmpty(
          data.alimentacion,
          initialHistoriaClinicaState.alimentacion,
        );
        const hasAntecedentes = !isSectionEmpty(
          data.antecedentesMedicos,
          initialHistoriaClinicaState.antecedentesMedicos,
        );
        const hasGenograma = !!data.informacionGeneral?.genogramaUrl;

        if (hasInfoGeneral) setVerInformacionGeneral(true);
        if (hasDatosFam) setVerDatosFamiliares(true);
        if (hasPrenatal) setVerHistoriaPrenatal(true);
        if (hasNatal) setVerHistoriaNatal(true);
        if (hasPostnatal) setVerHistoriaPostnatal(true);
        if (hasMotor) setVerDesarrolloMotor(true);
        if (hasAlimentacion) setVerAlimentacion(true);
        if (hasAntecedentes) setVerAntecedentesMedicos(true);
        if (hasGenograma) setVerGenograma(true);

        // Auto-open areas
        if (hasPrenatal || hasNatal || hasPostnatal) setAreaNacimiento(true);
        if (hasMotor || hasAlimentacion || hasAntecedentes)
          setAreaDesarrollo(true);

        if (data.paciente) {
          try {
            const paciente = await pacientesService.obtenerPorId(
              data.paciente.id,
            );
            setSelectedPatient(paciente);
          } catch (pError) {
            console.warn("Could not load patient details", pError);
          }
        }
        if (data.informacionGeneral?.genogramaUrl) {
          try {
            const gUrl = await fichasService.obtenerGenograma(
              data.pacienteId || data.paciente?.id,
            );
            setGenogramaPreview(gUrl);
          } catch (gError) {
            console.warn("Could not load genogram preview", gError);
          }
        }
      } else {
        toast.error("No se encontró la ficha");
        navigate("/fichas?tab=historia_clinica");
      }
    } catch (error) {
      console.error("Error loading ficha:", error);
      toast.error("Error al cargar la ficha");
      navigate("/fichas?tab=historia_clinica");
    } finally {
      setLoading(false);
    }
  };

  const handleRootChange = (field: keyof HistoriaClinicaState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (
    section: keyof HistoriaClinicaState,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };

  const handleDescargarGenograma = () => {
    if (genogramaPreview) {
      const link = document.createElement("a");
      link.href = genogramaPreview;
      const fileName = formData.informacionGeneral.genogramaUrl || "genograma";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmit = async () => {
    if (!formData.pacienteId) {
      toast.error("Debe seleccionar un paciente");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        fecha: formData.fecha ? formData.fecha : null,
      };

      if (isEdit && formData.id) {
        await fichasService.actualizarHistoriaClinica(
          formData.id,
          payload,
          genogramaFile || undefined,
        );
        toast.success("Ficha actualizada exitosamente");
      } else if (isEdit && !formData.id) {
        toast.error("Error: No se encontró el ID de la ficha");
        return;
      } else {
        await fichasService.crearHistoriaClinica(
          payload,
          genogramaFile || undefined,
        );
        toast.success("Ficha creada exitosamente");
      }
      navigate("/fichas?tab=historia_clinica");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Este paciente ya tiene una ficha activa.");
      } else {
        toast.error(
          isEdit ? "Error al actualizar la ficha" : "Error al crear la ficha",
        );
      }
      console.error("Error saving ficha:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (paciente: any) => {
    setFormData((prev) => ({ ...prev, pacienteId: paciente.id }));
    setSelectedPatient(paciente);
    setShowSelector(false);
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

  // If selecting patient
  if (showSelector) {
    return (
      <div className="space-y-6">
        <PatientSelector onSelect={handlePatientSelect} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedPatient && (
        <div className="bg-red-50/20 dark:bg-gray-800 p-4 rounded-3xl flex items-center justify-between border-2 border-brand-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-400 dark:bg-gray-500 rounded-full text-white font-bold dark:text-gray-200">
              <User size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">
                {selectedPatient.nombresApellidos}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                CI: {selectedPatient.cedula}
              </p>
            </div>
          </div>
          {!isEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSelector(true)}
            >
              Cambiar Paciente
            </Button>
          )}
        </div>
      )}

      {/* Información General */}
      <ComponentCard
        title="Información General"
        action={
          <Switch
            label=""
            checked={verInformacionGeneral}
            onChange={(val) => setVerInformacionGeneral(val)}
          />
        }
        onHeaderClick={() => setVerInformacionGeneral(!verInformacionGeneral)}
        bodyDisabled={!verInformacionGeneral}
      >
        <InformacionGeneralForm
          fecha={formData.fecha}
          data={formData.informacionGeneral}
          onChange={(field, val) =>
            handleNestedChange("informacionGeneral", field, val)
          }
          onRootChange={handleRootChange as any}
        />
      </ComponentCard>

      {/* Datos Familiares Siempre Visible o con Switch Propio */}
      <ComponentCard
        title="Datos Familiares"
        action={
          <Switch
            label=""
            checked={verDatosFamiliares}
            onChange={(val) => setVerDatosFamiliares(val)}
          />
        }
        onHeaderClick={() => setVerDatosFamiliares(!verDatosFamiliares)}
        bodyDisabled={!verDatosFamiliares}
      >
        <DatosFamiliaresForm
          data={formData.datosFamiliares}
          onChange={(field, val) =>
            handleNestedChange("datosFamiliares", field, val)
          }
        />
      </ComponentCard>

      {/* Selectores de Área Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setAreaNacimiento(!areaNacimiento)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${
            areaNacimiento
              ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
              : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${
                areaNacimiento
                  ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                  : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <Baby size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Antecedentes de Nacimiento
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Prenatal, Natal, Postnatal
              </p>
            </div>
            <div
              className={`ml-auto transition-transform duration-500 ${
                areaNacimiento ? "rotate-180" : ""
              }`}
            >
              <Switch
                label=""
                checked={areaNacimiento}
                onChange={(v) => setAreaNacimiento(v)}
              />
            </div>
          </div>
        </div>

        <div
          onClick={() => setAreaDesarrollo(!areaDesarrollo)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${
            areaDesarrollo
              ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
              : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${
                areaDesarrollo
                  ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                  : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <HeartPulse size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Desarrollo y Salud
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Motor, Alimentación, Médicos
              </p>
            </div>
            <div
              className={`ml-auto transition-transform duration-500 ${
                areaDesarrollo ? "rotate-180" : ""
              }`}
            >
              <Switch
                label=""
                checked={areaDesarrollo}
                onChange={(v) => setAreaDesarrollo(v)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Antecedentes de Nacimiento */}
      {areaNacimiento && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <div className="flex items-center gap-2 px-2">
            <Baby size={18} className="text-brand-500 dark:text-gray-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
              Módulos de Nacimiento
            </span>
          </div>

          <ComponentCard
            title="Historia Prenatal"
            action={
              <Switch
                label=""
                checked={verHistoriaPrenatal}
                onChange={(val) => setVerHistoriaPrenatal(val)}
              />
            }
            onHeaderClick={() => setVerHistoriaPrenatal(!verHistoriaPrenatal)}
            bodyDisabled={!verHistoriaPrenatal}
          >
            <HistoriaPrenatalForm
              data={formData.historiaPrenatal}
              onChange={(field, val) =>
                handleNestedChange("historiaPrenatal", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Historia Natal"
            action={
              <Switch
                label=""
                checked={verHistoriaNatal}
                onChange={(val) => setVerHistoriaNatal(val)}
              />
            }
            onHeaderClick={() => setVerHistoriaNatal(!verHistoriaNatal)}
            bodyDisabled={!verHistoriaNatal}
          >
            <HistoriaNatalForm
              data={formData.historiaNatal}
              onChange={(field, val) =>
                handleNestedChange("historiaNatal", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Historia Postnatal"
            action={
              <Switch
                label=""
                checked={verHistoriaPostnatal}
                onChange={(val) => setVerHistoriaPostnatal(val)}
              />
            }
            onHeaderClick={() => setVerHistoriaPostnatal(!verHistoriaPostnatal)}
            bodyDisabled={!verHistoriaPostnatal}
          >
            <HistoriaPostnatalForm
              data={formData.historiaPostnatal}
              onChange={(field, val) =>
                handleNestedChange("historiaPostnatal", field, val)
              }
            />
          </ComponentCard>
        </div>
      )}

      {/* Desarrollo y Salud */}
      {areaDesarrollo && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-100">
          <div className="flex items-center gap-2 px-2">
            <Activity size={18} className="text-brand-500 dark:text-gray-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
              Módulos de Desarrollo
            </span>
          </div>

          <ComponentCard
            title="Desarrollo Motor"
            action={
              <Switch
                label=""
                checked={verDesarrolloMotor}
                onChange={(val) => setVerDesarrolloMotor(val)}
              />
            }
            onHeaderClick={() => setVerDesarrolloMotor(!verDesarrolloMotor)}
            bodyDisabled={!verDesarrolloMotor}
          >
            <DesarrolloMotorForm
              data={formData.desarrolloMotor}
              onChange={(field, val) =>
                handleNestedChange("desarrolloMotor", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Alimentación y Hábitos"
            action={
              <Switch
                label=""
                checked={verAlimentacion}
                onChange={(val) => setVerAlimentacion(val)}
              />
            }
            onHeaderClick={() => setVerAlimentacion(!verAlimentacion)}
            bodyDisabled={!verAlimentacion}
          >
            <AlimentacionForm
              data={formData.alimentacion}
              onChange={(field, val) =>
                handleNestedChange("alimentacion", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Antecedentes Médicos"
            action={
              <Switch
                label=""
                checked={verAntecedentesMedicos}
                onChange={(val) => setVerAntecedentesMedicos(val)}
              />
            }
            onHeaderClick={() =>
              setVerAntecedentesMedicos(!verAntecedentesMedicos)
            }
            bodyDisabled={!verAntecedentesMedicos}
          >
            <AntecedentesMedicosForm
              data={formData.antecedentesMedicos}
              onChange={(field, val) =>
                handleNestedChange("antecedentesMedicos", field, val)
              }
            />
          </ComponentCard>
        </div>
      )}

      {/* Genograma */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <FileText size={18} className="text-brand-500 dark:text-gray-300" />
          <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
            Documentación Extra
          </span>
        </div>

        <ComponentCard
          title="Genograma"
          action={
            <Switch
              label=""
              checked={verGenograma}
              onChange={(val) => setVerGenograma(val)}
            />
          }
          onHeaderClick={() => setVerGenograma(!verGenograma)}
          bodyDisabled={!verGenograma}
        >
          <div className="space-y-4">
            {(!formData.informacionGeneral.genogramaUrl || showFileInput) && (
              <>
                <Label>Archivo de Genograma (Imagen/PDF)</Label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) =>
                    setGenogramaFile(e.target.files?.[0] || null)
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-gray-800 dark:file:text-gray-300"
                />
                {showFileInput && formData.informacionGeneral.genogramaUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowFileInput(false);
                      setGenogramaFile(null);
                    }}
                  >
                    Cancelar cambio
                  </Button>
                )}
              </>
            )}

            {formData.informacionGeneral.genogramaUrl && !showFileInput && (
              <>
                <div className="flex items-center justify-end mb-3">
                  
                </div>
                {formData.informacionGeneral.genogramaUrl
                  .toLowerCase()
                  .endsWith(".pdf") ? (
                  <div className="flex items-center gap-2 dark:text-brand-400 p-4 border-2 border-dashed rounded-xl dark:border-gray-600">
                    <FileText size={24} />
                    <span className="text-sm font-medium">
                      Documento PDF cargado
                    </span>
                    <div className="flex gap-2 ml-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowFileInput(true)}
                      className="h-8 py-1"
                      title="Cambiar genograma"
                    >
                      <Plus size={14} className="mr-1.5" /> Cambiar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDescargarGenograma}
                      className="h-8 py-1"
                      title="Descargar genograma"
                    >
                      <Download size={14} className="mr-1.5" /> Descargar
                    </Button>
                  </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={genogramaPreview || ""}
                      alt="Genograma"
                      className="max-h-64 rounded-xl shadow-sm border dark:border-gray-700"
                    />
                  </div>
                )}
              </>
            )}
            {genogramaFile && (
              <div className="mt-4 p-4 border-2 border-dashed border-brand-200 rounded-2xl bg-brand-50/30 dark:bg-brand-500/5 items-center flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg text-brand-600 dark:text-brand-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Nuevo archivo seleccionado
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {genogramaFile.name}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGenogramaFile(null)}
                  className="h-8"
                >
                  Remover
                </Button>
              </div>
            )}
          </div>
        </ComponentCard>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/fichas?tab=historia_clinica")}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          {loading
            ? "Guardando..."
            : isEdit
              ? "Actualizar Ficha"
              : "Guardar Ficha"}
        </Button>
      </div>
    </div>
  );
}
