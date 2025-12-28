import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useSearchParams } from "react-router";
import FormularioPsicologiaClinica from "../../components/form/fichas-form/FormularioPsicologiaClinica";

export default function FichaPsicologiaClinica() {
  const [searchParams] = useSearchParams();
  const pacienteId = searchParams.get("pacienteId");

  return (
    <>
      <PageMeta
        title="Fichas | Udipsai"
        description="Formulario para la gestión de fichas psicología clínica en Udipsai"
      />
      <PageBreadcrumb
        pageTitle="Psicología Clínica"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Pacientes", path: "/pacientes" },
          { label: "Psicología Clínica"},
        ]}
      />
      <FormularioPsicologiaClinica pacienteId={pacienteId} />
    </>
  );
}
