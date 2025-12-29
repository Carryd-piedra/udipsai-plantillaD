import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
import Select from "../Select";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { especialistasService } from "../../../services/especialistas";
import { sedesService } from "../../../services";
import Button from "../../ui/button/Button";
import { toast } from "react-toastify";

export default function FormularioEspecialistas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    cedula: "",
    nombresApellidos: "",
    fotoUrl: "",
    contrasenia: "",
    especialidadId: 0,
    sedeId: 0,
    activo: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchEspecialista = async () => {
        try {
          setLoading(true);
          const data = await especialistasService.obtenerPorId(id);

          setFormData({
            cedula: data.cedula,
            nombresApellidos: data.nombresApellidos,
            fotoUrl: data.fotoUrl,
            contrasenia: data.contrasenia,
            especialidadId: data.especialidad?.id || data.especialidadId || 0,
            sedeId: data.sede?.id || data.sedeId || 0,
            activo: data.activo,
          });
        } catch (error) {
          console.error("Error al obtener especialista:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEspecialista();
    }
    getSedes();
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        cedula: formData.cedula,
        nombresApellidos: formData.nombresApellidos,
        contrasenia: formData.contrasenia,
        especialidadId: Number(formData.especialidadId),
        sedeId: Number(formData.sedeId),
        activo: formData.activo,
      };
      if (isEditing) {
        await especialistasService.actualizar(id, payload);
      } else {
        await especialistasService.crear(payload);
      }
      navigate("/especialistas");
    } catch (error) {
      toast.error("Error al guardar especialista");
    } finally {
      setLoading(false);
    }
  };

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

  const optionsEspecialidad = [
    { value: "1", label: "Coordinación" },
    { value: "2", label: "Secretaría" },
    { value: "3", label: "Psicología Educativa" },
    { value: "4", label: "Psicología Clínica" },
    { value: "5", label: "Terapia de Lenguaje y Fonoaudiología" },
    { value: "6", label: "Estimulación Temprana" },
    { value: "7", label: "Recuperación Pedagógica" },
    { value: "8", label: "Odontología" },
  ];

  if (loading && isEditing && !formData.cedula) {
    return <div>Cargando datos del especialista...</div>;
  }

  return (
    <div>
      <ComponentCard title="Datos personales del especialista">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                type="text"
                placeholder="Ingrese el número de cédula/ruc"
                value={formData.cedula}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="nombresApellidos">Nombres y Apellidos</Label>
              <Input
                id="nombresApellidos"
                type="text"
                placeholder="Ingrese el nombre completo"
                value={formData.nombresApellidos}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <br />
      <ComponentCard title="Datos de la especialidad">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="sedeId">Sede</Label>
              <Select
                options={optionsSede}
                placeholder="Seleccione una sede"
                onChange={(value) => handleSelectChange("sedeId", value)}
                className="dark:bg-dark-900"
                defaultValue={String(formData.sedeId || "")}
              />
            </div>
            <div>
              <Label htmlFor="especialidad">Especialidad</Label>
              <Select
                options={optionsEspecialidad}
                placeholder="Seleccione una especialidad"
                onChange={(value) =>
                  handleSelectChange("especialidadId", value)
                }
                className="dark:bg-dark-900"
                defaultValue={String(formData.especialidadId || "")}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <br />
      <ComponentCard title="Autenticación">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="contrasenia">Contraseña</Label>
              <Input
                id="contrasenia"
                type="password"
                placeholder="Ingrese la contraseña"
                value={formData.contrasenia}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/especialistas")}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Especialista"}
        </Button>
      </div>
    </div>
  );
}
