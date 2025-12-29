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

export default function FormularioPacientes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { fotoUrl, ...rest } = formData;
      const payload = {
        ...rest,
        fechaNacimiento: rest.fechaNacimiento.split("T")[0],
        institucionEducativaId: Number(rest.institucionEducativaId),
        sedeId: Number(rest.sedeId),
      };
      if (isEditing) {
        await pacientesService.actualizar(id, payload);
        toast.success("Paciente actualizado exitosamente");
      } else {
        await pacientesService.crear(payload);
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
      const data = await sedesService.listar();
      setSedes(data);
    } catch (error) {
      console.error("Error fetching sedes:", error);
    }
  };

  const [sedes, setSedes] = useState([{ id: "0", nombre: "" }]);

  const optionsSede = sedes.map((sede) => ({
    value: sede.id,
    label: sede.nombre,
  }));

  const getInstituciones = async () => {
    try {
      const data = await institucionesService.listar();
      setInstituciones(data);
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
    value: institucion.id,
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
  const optionsAñoEducativo = [
    { value: "primero", label: "Primero" },
    { value: "segundo", label: "Segundo" },
    { value: "tercero", label: "Tercero" },
  ];

  if (loading && isEditing && !formData.nombresApellidos) {
    return <div>Cargando datos del paciente...</div>;
  }

  return (
    <div>
      <ComponentCard title="Datos personales del paciente">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="nombresApellidos">Nombre Completo</Label>
              <Input
                id="nombresApellidos"
                type="text"
                placeholder="Ingrese el nombre completo"
                value={formData.nombresApellidos}
                onChange={handleChange}
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
                defaultValue={String(formData.sedeId || "")}
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
            <div>
              <Switch
                label="¿Presenta discapacidad?"
                defaultChecked={formData.tieneDiscapacidad || false}
                onChange={(checked) =>
                  handleSwitchChange("tieneDiscapacidad", checked)
                }
              />
            </div>
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
                defaultValue={formData.tipoDiscapacidad || ""}
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
              <Select
                options={optionsInstituciones}
                placeholder="Seleccione la institución educativa"
                onChange={(value) =>
                  handleSelectChange("institucionEducativaId", value)
                }
                defaultValue={String(formData.institucionEducativaId || "")}
              />
            </div>
            <div>
              <Label htmlFor="jornada">Jornada</Label>
              <Select
                options={optionsJornada}
                placeholder="Seleccione la jornada"
                onChange={(value) => handleSelectChange("jornada", value)}
                defaultValue={String(formData.jornada || "")}
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
                defaultValue={formData.nivelEducativo || ""}
              />
            </div>
            <div>
              <Label htmlFor="anioEducacion">Año Educativo</Label>
              <Select
                options={optionsAñoEducativo}
                placeholder="Seleccione el año educativo"
                onChange={(value) => handleSelectChange("anioEducacion", value)}
                defaultValue={formData.anioEducacion || ""}
              />
            </div>
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
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/pacientes")}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Paciente"}
        </Button>
      </div>
    </div>
  );
}
