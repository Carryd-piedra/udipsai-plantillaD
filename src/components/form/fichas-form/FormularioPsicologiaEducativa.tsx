import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import { fichasService } from "../../../services/fichas";
import { toast } from "react-toastify";
import Button from "../../ui/button/Button";
import { useNavigate } from "react-router";
import HistoriaEscolarForm from "./sections/PsicologiaEducativa.tsx/HistoriaEscolarForm";
import DesarrolloForm from "./sections/PsicologiaEducativa.tsx/DesarrolloForm";
import AdaptacionForm from "./sections/PsicologiaEducativa.tsx/AdaptacionForm";
import EstadoGeneralForm from "./sections/PsicologiaEducativa.tsx/EstadoGeneralForm";

interface FormularioPsicologiaEducativaProps {
  pacienteId: string | null;
}

interface FichaPsicologiaEducativaState {
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

const initialState: FichaPsicologiaEducativaState = {
  pacienteId: 0,
  activo: false,
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

export default function FormularioPsicologiaEducativa({
  pacienteId,
}: FormularioPsicologiaEducativaProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FichaPsicologiaEducativaState>({
    ...initialState,
    pacienteId: pacienteId ? Number(pacienteId) : 0,
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (pacienteId) {
      fetchFicha(pacienteId);
    }
  }, [pacienteId]);

  const fetchFicha = async (id: string) => {
    try {
      if (!id) return;
      setLoading(true);
      const data = await fichasService.obtenerPsicologiaEducativa(id);
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        pacienteId: Number(pacienteId),
        activo: formData.activo,
        historiaEscolar: formData.historiaEscolar,
        desarrollo: formData.desarrollo,
        adaptacion: formData.adaptacion,
        estadoGeneral: formData.estadoGeneral,
      };
      await fichasService.crearPsicologiaEducativa(payload);
      toast.success(
        isEdit ? "Ficha de psicologia educativa actualizada exitosamente" : "Ficha de psicologia educativa creada exitosamente"
      );
      navigate("/pacientes");
    } catch (error) {
      toast.error("Error al guardar la ficha de psicologia educativa");
      console.error("Error al guardar la ficha de psicologia educativa:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEdit) {
    return <div className="p-6 text-center text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
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
