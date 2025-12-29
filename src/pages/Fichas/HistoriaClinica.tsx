import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormularioHistoriaClinica from "../../components/form/fichas-form/FormularioHistoriaClinica";
import { useSearchParams } from "react-router";

export default function HistoriaClinica() {
  const [searchParams] = useSearchParams();
  const pacienteId = searchParams.get("pacienteId");

  return (
    <>
      <PageMeta
        title="Fichas | Udipsai"
        description="Formulario para la gestión de fichas médicas en Udipsai"
      />
      <PageBreadcrumb
        pageTitle="Historia Clínica"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Pacientes", path: "/pacientes" },
          { label: "Historia Clínica" },
        ]}
      />
      <FormularioHistoriaClinica pacienteId={pacienteId} />
    </>
  );
}
