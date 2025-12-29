import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import { fichasService } from "../../../services/fichas";
import { toast } from "react-toastify";
import Button from "../../ui/button/Button";
import Label from "../Label";
import DatosFamiliaresForm from "./sections/HistoriaClinica.tsx/DatosFamiliaresForm";
import HistoriaPrenatalForm from "./sections/HistoriaClinica.tsx/HistoriaPrenatalForm";
import HistoriaNatalForm from "./sections/HistoriaClinica.tsx/HistoriaNatalForm";
import HistoriaPostnatalForm from "./sections/HistoriaClinica.tsx/HistoriaPostnatalForm";
import DesarrolloMotorForm from "./sections/HistoriaClinica.tsx/DesarrolloMotorForm";
import AlimentacionForm from "./sections/HistoriaClinica.tsx/AlimentacionForm";
import AntecedentesMedicosForm from "./sections/HistoriaClinica.tsx/AntecedentesMedicosForm";
import { useNavigate, useSearchParams } from "react-router";

interface FormularioHistoriaClinicaProps {
  pacienteId: string | null;
}

interface FichaMedicaState {
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

const initialState: FichaMedicaState = {
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

export default function FormularioHistoriaClinica({
  pacienteId,
}: FormularioHistoriaClinicaProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  const [formData, setFormData] = useState<FichaMedicaState>({
    ...initialState,
    pacienteId: pacienteId ? Number(pacienteId) : 0,
  });
  const [genogramaFile, setGenogramaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (pacienteId && mode === "editar") {
      fetchFicha(pacienteId);
    }
  }, [pacienteId, mode]);

  const fetchFicha = async (id: string) => {
    try {
      if (!id) return;
      setLoading(true);
      const data = await fichasService.obtenerFichaMedica(id);
      if (data) {
        setFormData(data);
        setIsEdit(true);
      }
    } catch (error) {
      console.log("No existing ficha found or error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (
    section: keyof FichaMedicaState,
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        pacienteId: Number(pacienteId),
        activo: formData.activo,
        datosFamiliares: formData.datosFamiliares,
        historiaPrenatal: formData.historiaPrenatal,
        historiaNatal: formData.historiaNatal,
        historiaPostnatal: formData.historiaPostnatal,
        desarrolloMotor: formData.desarrolloMotor,
        alimentacion: formData.alimentacion,
        antecedentesMedicos: formData.antecedentesMedicos,
      };
      await fichasService.crearFichaMedica(payload, genogramaFile || undefined);
      toast.success(
        isEdit ? "Ficha médica actualizada" : "Ficha médica creada exitosamente"
      );
      navigate("/pacientes");
    } catch (error) {
      toast.error("Error al guardar la ficha médica");
      console.error("Error saving ficha:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEdit) {
    return <div className="p-6 text-center text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
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
        <Button variant="outline" onClick={() => navigate("/pacientes")}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Ficha"}
        </Button>
      </div>
    </div>
  );
}
