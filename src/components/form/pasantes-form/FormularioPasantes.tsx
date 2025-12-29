import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
import Select from "../Select";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { pasantesService } from "../../../services/pasantes";
import { especialistasService } from "../../../services";
import Button from "../../ui/button/Button";
import { toast } from "react-toastify";
import DatePicker from "../date-picker";

export default function FormularioPasantes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    cedula: "",
    nombresApellidos: "",
    contrasenia: "",
    fotoUrl: "",
    inicioPasantia: new Date().toISOString(),
    finPasantia: new Date().toISOString(),
    tutorId: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchPasante = async () => {
        try {
          setLoading(true);
          const data = await pasantesService.obtenerPorId(id);

          setFormData({
            cedula: data.cedula,
            nombresApellidos: data.nombresApellidos,
            contrasenia: data.contrasenia,
            fotoUrl: data.fotoUrl,
            inicioPasantia: data.inicioPasantia ? data.inicioPasantia.split("T")[0] : "",
            finPasantia: data.finPasantia ? data.finPasantia.split("T")[0] : "",
            tutorId: data.tutor?.id || 0,
          });
        } catch (error) {
          console.error("Error al obtener pasante:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPasante();
    }
    getEspecialistas();
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

  const handleDateChange = (name: string, dates: Date[]) => {
    setFormData((prev) => ({ ...prev, [name]: dates[0].toISOString() }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        cedula: formData.cedula,
        nombresApellidos: formData.nombresApellidos,
        contrasenia: formData.contrasenia,
        fotoUrl: formData.fotoUrl,
        inicioPasantia: formData.inicioPasantia,
        finPasantia: formData.finPasantia,
        tutorId: Number(formData.tutorId),
      };
      if (isEditing) {
        await pasantesService.actualizar(id, payload);
        toast.success("Pasante actualizado exitosamente");
      } else {
        await pasantesService.crear(payload);
        toast.success("Pasante creado exitosamente");
      }
      navigate("/pasantes");
    } catch (error) {
      toast.error("Error al guardar pasante");
    } finally {
      setLoading(false);
    }
  };

  const getEspecialistas = async () => {
    try {
      const data = await especialistasService.listarActivos();
      setEspecialistas(data);
    } catch (error) {
      console.error("Error fetching especialistas:", error);
    }
  };

  const [especialistas, setEspecialistas] = useState([
    { id: "0", nombresApellidos: "" },
  ]);

  const optionsEspecialistas = especialistas.map((especialista) => ({
    value: especialista.id,
    label: especialista.nombresApellidos,
  }));

  if (loading && isEditing && !formData.cedula) {
    return <div>Cargando datos del pasante...</div>;
  }

  return (
    <div>
      <ComponentCard title="Datos personales del pasante">
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
      <ComponentCard title="Datos de la pasante">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="fechaInicio">Fecha de inicio</Label>
              <DatePicker
                id="fechaInicio"
                placeholder="Seleccione la fecha de inicio"
                onChange={(dates) => handleDateChange("inicioPasantia", dates)}
                defaultDate={formData.inicioPasantia}
              />
            </div>
            <div>
              <Label htmlFor="fechaFin">Fecha de fin</Label>
              <DatePicker
                id="fechaFin"
                placeholder="Seleccione la fecha de fin"
                onChange={(dates) => handleDateChange("finPasantia", dates)}
                defaultDate={formData.finPasantia}
              />
            </div>
            <div>
              <Label htmlFor="tutor">Tutor</Label>
              <Select
                options={optionsEspecialistas}
                placeholder="Seleccione un tutor"
                onChange={(value) =>
                  handleSelectChange("tutorId", value)
                }
                defaultValue={String(formData.tutorId || "")}
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
        <Button variant="outline" onClick={() => navigate("/pasantes")}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Pasante"}
        </Button>
      </div>
    </div>
  );
}
