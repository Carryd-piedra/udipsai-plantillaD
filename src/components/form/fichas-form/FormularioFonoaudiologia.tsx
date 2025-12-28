import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import { fichasService } from "../../../services/fichas";
import { toast } from "react-toastify";
import Button from "../../ui/button/Button";
import { useNavigate } from "react-router";

import HablaForm from "./sections/Fonoaudiologia/HablaForm";
import AudicionForm from "./sections/Fonoaudiologia/AudicionForm";
import FonacionForm from "./sections/Fonoaudiologia/FonacionForm";
import HistoriaAuditivaForm from "./sections/Fonoaudiologia/HistoriaAuditivaForm";
import VestibularForm from "./sections/Fonoaudiologia/VestibularForm";
import OtoscopiaForm from "./sections/Fonoaudiologia/OtoscopiaForm";

interface FormularioFonoaudiologiaProps {
  pacienteId: string | null;
}

interface FonoaudiologiaState {
  pacienteId: number;
  activo: boolean;
  habla: any;
  audicion: any;
  fonacion: any;
  historiaAuditiva: any;
  vestibular: any;
  otoscopia: any;
}

const initialState: FonoaudiologiaState = {
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

export default function FormularioFonoaudiologia({ pacienteId }: FormularioFonoaudiologiaProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FonoaudiologiaState>({
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
      setLoading(true);
      const data = await fichasService.obtenerFonoaudiologia(id);
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        pacienteId: Number(pacienteId),
        activo: formData.activo,
        habla: formData.habla,
        audicion: formData.audicion,
        fonacion: formData.fonacion,
        historiaAuditiva: formData.historiaAuditiva,
        vestibular: formData.vestibular,
        otoscopia: formData.otoscopia,
      };

      await fichasService.crearFonoaudiologia(payload);
      toast.success(isEdit ? "Ficha actualizada exitosamente" : "Ficha creada exitosamente");
      navigate("/pacientes");
    } catch (error) {
      toast.error("Error al guardar la ficha");
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
