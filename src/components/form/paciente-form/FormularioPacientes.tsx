import ComponentCard from "../../common/ComponentCard";
import DatePicker from "../../form/date-picker";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import Label from "../../form/Label";
import Select from "../../form/Select";
import Switch from "../../form/switch/Switch";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { pacientesService } from "../../../services/pacientes";
import Button from "../../ui/button/Button";
import { institucionesService, sedesService } from "../../../services";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/useModal";
import { InstitucionModal } from "../../modals/InstitucionModal";
import { Plus } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function FormularioPacientes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { permissions } = useAuth();

  const [formData, setFormData] = useState({
    cedula: "",
    nombresApellidos: "",
    fechaNacimiento: new Date().toISOString().split("T")[0],
    fotoUrl: "",
    ciudad: "",
    domicilio: "",
    numeroTelefono: "",
    numeroCelular: "",
    institucionEducativaId: 0,
    sedeId: 0,
    jornada: "",
    nivelEducativo: "",
    anioEducacion: "",
    perteneceInclusion: false,
    tieneDiscapacidad: false,
    perteneceAProyecto: false,
    proyecto: "",
    portadorCarnet: false,
    diagnostico: "",
    motivoConsulta: "",
    observaciones: "",
    tipoDiscapacidad: "",
    detalleDiscapacidad: "",
    porcentajeDiscapacidad: 0,
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fichaCompromisoFile, setFichaCompromisoFile] = useState<File | null>(
    null,
  );
  const [fichaDeteccionFile, setFichaDeteccionFile] = useState<File | null>(
    null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingFichas, setExistingFichas] = useState({
    compromiso: false,
    deteccion: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    isOpen: isInstitucionModalOpen,
    openModal: openInstitucionModal,
    closeModal: closeInstitucionModal,
  } = useModal();

  useEffect(() => {
    if (isEditing) {
      const fetchPaciente = async () => {
        try {
          setLoading(true);
          const data = await pacientesService.obtenerPorId(id);

          setFormData({
            ...data,
            institucionEducativaId: data.institucionEducativa?.id || 0,
            sedeId: data.sede?.id || 0,
          });

          if (data.documentos) {
            const compromiso = data.documentos.some(
              (d: any) => d.nombre === "Ficha Compromiso",
            );
            const deteccion = data.documentos.some(
              (d: any) => d.nombre === "Ficha Detección",
            );
            setExistingFichas({ compromiso, deteccion });
          }

          if (data.fotoUrl) {
            const fotoUrl = await pacientesService.obtenerFoto(data.fotoUrl);
            setPreviewUrl(fotoUrl);
          }
        } catch (error) {
          console.error("Error fetching patient:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPaciente();
    }
    getInstituciones();
    getSedes();
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string | number) => {
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (name: string, dates: Date[]) => {
    setFormData((prev) => ({ ...prev, [name]: dates[0].toISOString() }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.nombresApellidos.trim()) {
      newErrors.nombresApellidos = "El nombre completo es obligatorio";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor, complete los campos obligatorios");
      return;
    }

    try {
      setLoading(true);
      const { fotoUrl, ...rest } = formData;
      const payload = {
        ...rest,
        documentos: undefined,
        fechaNacimiento: rest.fechaNacimiento.split("T")[0],
        institucionEducativaId: Number(rest.institucionEducativaId),
        sedeId: Number(rest.sedeId),
      };
      if (isEditing) {
        await pacientesService.actualizar(
          id,
          payload,
          selectedFile || undefined,
          fichaCompromisoFile || undefined,
          fichaDeteccionFile || undefined,
        );
        toast.success("Paciente actualizado exitosamente");
      } else {
        await pacientesService.crear(
          payload,
          selectedFile || undefined,
          fichaCompromisoFile || undefined,
          fichaDeteccionFile || undefined,
        );
        toast.success("Paciente creado exitosamente");
      }
      navigate("/pacientes");
    } catch (error) {
      toast.error("Error al guardar el paciente");
      console.error("Error saving patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInstitucion = async (institucion: any) => {
    try {
      const response = await institucionesService.crear(institucion);
      toast.success("Institución creada correctamente");
      await getInstituciones();
      if (response && response.id) {
        setFormData((prev) => ({
          ...prev,
          institucionEducativaId: response.id,
        }));
      }
      closeInstitucionModal();
    } catch (error) {
      toast.error("Error al guardar la institución");
      console.error("Error saving institucion:", error);
    }
  };

  const optionsDiscapacidad = [
    { value: "intelectual", label: "Intelectual" },
    { value: "fisica", label: "Física" },
    { value: "auditiva", label: "Auditiva" },
    { value: "visual", label: "Visual" },
    { value: "psicosocial", label: "Psicosocial" },
    { value: "lenguaje", label: "Lenguaje" },
    { value: "multiple", label: "Múltiple" },
    { value: "otros", label: "Otros" },
  ];

  const getSedes = async () => {
    try {
      const data = await sedesService.listarActivos(0, 100);
      const sedesData = data?.content || [];
      setSedes(sedesData);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const [sedes, setSedes] = useState([{ id: "0", nombre: "" }]);

  const optionsSede = sedes.map((sede) => ({
    value: String(sede.id),
    label: sede.nombre,
  }));

  const getInstituciones = async () => {
    try {
      const data = await institucionesService.listarActivos(0, 100);
      const institucionesData = data?.content || [];
      setInstituciones(institucionesData);
    } catch (error) {
      console.error("Error fetching institutions:", error);
    }
  };

  const [instituciones, setInstituciones] = useState([
    {
      id: "0",
      nombre: "",
    },
  ]);

  const optionsInstituciones = instituciones.map((institucion) => ({
    value: String(institucion.id),
    label: institucion.nombre,
  }));

  const optionsJornada = [
    { value: "1", label: "Matutina" },
    { value: "2", label: "Vespertina" },
  ];
  const optionsNivelEducativo = [
    { value: "inicial", label: "Inicial" },
    { value: "preparatoria", label: "Preparatoria" },
    { value: "basica-elemental", label: "Básica Elemental" },
    { value: "basica-media", label: "Básica Media" },
    { value: "basica-superior", label: "Básica Superior" },
    { value: "bachillerato", label: "Bachillerato" },
    { value: "no-escolarizado", label: "No Escolarizado" },
  ];
  const optionsAñoEducativo = (nivelEducativo: string) => {
    switch (nivelEducativo) {
      case "inicial":
        return [
          { value: "inicial 1", label: "Inicial 1" },
          { value: "inicial 2", label: "Inicial 2" },
        ];
      case "preparatoria":
        return [{ value: "primero", label: "Primero" }];
      case "basica-elemental":
        return [
          { value: "segundo", label: "Segundo" },
          { value: "tercero", label: "Tercero" },
          { value: "cuarto", label: "Cuarto" },
        ];
      case "basica-media":
        return [
          { value: "quinto", label: "Quinto" },
          { value: "sexto", label: "Sexto" },
          { value: "séptimo", label: "Séptimo" },
        ];
      case "basica-superior":
        return [
          { value: "octavo", label: "Octavo" },
          { value: "noveno", label: "Noveno" },
          { value: "decimo", label: "Décimo" },
        ];
      case "bachillerato":
        return [
          {
            value: "primero de bachillerato",
            label: "Primero de bachillerato",
          },
          {
            value: "segundo de bachillerato",
            label: "Segundo de bachillerato",
          },
          {
            value: "tercero de bachillerato",
            label: "Tercero de bachillerato",
          },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando datos del paciente...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ComponentCard title="Datos personales del paciente">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="foto">Foto del Paciente</Label>
              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="mt-2 h-20 w-20 object-cover rounded-full"
                />
              )}
            </div>
            <div>
              <Label htmlFor="fichaCompromiso">
                Ficha de Compromiso (PDF)
                {existingFichas.compromiso && (
                  <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    Documento cargado
                  </span>
                )}
              </Label>
              <input
                id="fichaCompromiso"
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFichaCompromisoFile(e.target.files?.[0] || null)
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
            <div>
              <Label htmlFor="fichaDeteccion">
                Ficha de Detección (PDF)
                {existingFichas.deteccion && (
                  <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    Documento cargado
                  </span>
                )}
              </Label>
              <input
                id="fichaDeteccion"
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFichaDeteccionFile(e.target.files?.[0] || null)
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
            <div>
              <Label htmlFor="nombresApellidos">Nombre Completo</Label>
              <Input
                id="nombresApellidos"
                type="text"
                placeholder="Ingrese el nombre completo"
                value={formData.nombresApellidos}
                onChange={handleChange}
                error={!!errors.nombresApellidos}
                hint={errors.nombresApellidos}
              />
            </div>
            <div>
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                type="text"
                placeholder="Ingrese la cédula"
                value={formData.cedula}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <DatePicker
                id="fechaNacimiento"
                placeholder="Seleccione la fecha de nacimiento"
                onChange={(dates) => handleDateChange("fechaNacimiento", dates)}
                defaultDate={formData.fechaNacimiento}
              />
            </div>
            <div>
              <Label htmlFor="domicilio">Domicilio</Label>
              <Input
                id="domicilio"
                type="text"
                placeholder="Ingrese el domicilio"
                value={formData.domicilio}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                type="text"
                placeholder="Ingrese la ciudad"
                value={formData.ciudad}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="sedeId">Sede</Label>
              <Select
                options={optionsSede}
                placeholder="Seleccione una sede"
                onChange={(value) => handleSelectChange("sedeId", value)}
                value={String(formData.sedeId || "")}
              />
            </div>
            <div>
              <Label htmlFor="numeroTelefono">Teléfono Convencional</Label>
              <Input
                id="numeroTelefono"
                type="text"
                placeholder="Ingrese el teléfono convencional"
                value={formData.numeroTelefono}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="numeroCelular">Teléfono Celular</Label>
              <Input
                id="numeroCelular"
                type="text"
                placeholder="Ingrese el teléfono celular"
                value={formData.numeroCelular}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <br />
      <ComponentCard title="Datos de discapacidad">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="flex items-center">
              <Switch
                label="¿Presenta discapacidad?"
                defaultChecked={formData.tieneDiscapacidad || false}
                onChange={(checked) =>
                  handleSwitchChange("tieneDiscapacidad", checked)
                }
              />
            </div>
            {formData.tieneDiscapacidad && (
              <>
                <div>
                  <Switch
                    label="¿Porta carnet de discapacidad?"
                    defaultChecked={formData.portadorCarnet || false}
                    onChange={(checked) =>
                      handleSwitchChange("portadorCarnet", checked)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="tipoDiscapacidad">Tipo de Discapacidad</Label>
                  <Select
                    options={optionsDiscapacidad}
                    placeholder="Selecciona el tipo de discapacidad"
                    onChange={(value) =>
                      handleSelectChange("tipoDiscapacidad", value)
                    }
                    value={formData.tipoDiscapacidad || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="detalleDiscapacidad">
                    Detalles de la Discapacidad
                  </Label>
                  <Input
                    id="detalleDiscapacidad"
                    type="text"
                    placeholder="Ingrese detalles adicionales"
                    value={formData.detalleDiscapacidad}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="porcentajeDiscapacidad">
                    Porcentaje de Discapacidad
                  </Label>
                  <Input
                    id="porcentajeDiscapacidad"
                    type="number"
                    placeholder="Ingrese el porcentaje de discapacidad"
                    value={formData.porcentajeDiscapacidad}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="diagnostico">Diagnóstico</Label>
              <Input
                id="diagnostico"
                type="text"
                placeholder="Ingrese el diagnóstico"
                value={formData.diagnostico}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <br />
      <ComponentCard title="Información educativa y Proyecto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="institucionEducativaId">
                Institución Educativa
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    options={optionsInstituciones}
                    placeholder="Seleccione la institución educativa"
                    onChange={(value) =>
                      handleSelectChange("institucionEducativaId", value)
                    }
                    value={String(formData.institucionEducativaId || "")}
                  />
                </div>
                {permissions.includes(
                  "PERM_INSTITUCIONES_EDUCATIVAS_CREAR",
                ) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openInstitucionModal}
                    title="Agregar nueva institución"
                    className="hover:bg-red-500 hover:text-white"
                  >
                    <Plus size={18} />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="jornada">Jornada</Label>
              <Select
                options={optionsJornada}
                placeholder="Seleccione la jornada"
                onChange={(value) => handleSelectChange("jornada", value)}
                value={String(formData.jornada || "")}
              />
            </div>
            <div>
              <Label htmlFor="nivelEducativo">Nivel Educativo</Label>
              <Select
                options={optionsNivelEducativo}
                placeholder="Seleccione el nivel educativo"
                onChange={(value) =>
                  handleSelectChange("nivelEducativo", value)
                }
                value={formData.nivelEducativo || ""}
              />
            </div>
            {formData.nivelEducativo !== "no-escolarizado" &&
              formData.nivelEducativo !== "" && (
                <div>
                  <Label htmlFor="anioEducacion">Año Educativo</Label>
                  <Select
                    options={optionsAñoEducativo(formData.nivelEducativo)}
                    placeholder="Seleccione el año educativo"
                    onChange={(value) =>
                      handleSelectChange("anioEducacion", value)
                    }
                    value={formData.anioEducacion || ""}
                  />
                </div>
              )}
            <div>
              <Switch
                label="Pertenencia a programa de inclusión"
                defaultChecked={formData.perteneceInclusion || false}
                onChange={(checked) =>
                  handleSwitchChange("perteneceInclusion", checked)
                }
              />
            </div>
            <div>
              <Switch
                label="Pertenece a Proyecto"
                defaultChecked={formData.perteneceAProyecto || false}
                onChange={(checked) =>
                  handleSwitchChange("perteneceAProyecto", checked)
                }
              />
            </div>
            {formData.perteneceAProyecto && (
              <div>
                <Label htmlFor="proyecto">Proyecto</Label>
                <Input
                  id="proyecto"
                  type="text"
                  placeholder="Ingrese el proyecto"
                  value={formData.proyecto}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>
      </ComponentCard>
      <br />
      <ComponentCard title="Información adicional">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="motivoConsulta">Motivo de consulta</Label>
              <TextArea
                value={formData.motivoConsulta}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, motivoConsulta: value }))
                }
                rows={2}
                placeholder="Ingrese el motivo de consulta"
              />
            </div>
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <TextArea
                value={formData.observaciones}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, observaciones: value }))
                }
                rows={2}
                placeholder="Ingrese las observaciones"
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/pacientes")}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          {loading ? "Guardando..." : "Guardar Paciente"}
        </Button>
      </div>
      <InstitucionModal
        isOpen={isInstitucionModalOpen}
        onClose={closeInstitucionModal}
        onSave={handleSaveInstitucion}
        title="Nueva Institución"
      />
    </div>
  );
}
