import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormularioPsicologiaEducativa from "../../components/form/fichas-form/FormularioPsicologiaEducativa";
import { useSearchParams } from "react-router";

export default function FichaPsicologiaEducativa() {
  const [searchParams] = useSearchParams();
  const pacienteId = searchParams.get("pacienteId");

  return (
    <>
      <PageMeta
        title="Fichas | Udipsai"
        description="Formulario para la gestión de fichas psicología educativa en Udipsai"
      />
      <PageBreadcrumb
        pageTitle="Psicología Educativa"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Pacientes", path: "/pacientes" },
          { label: "Psicología Educativa" },
        ]}
      />
      <FormularioPsicologiaEducativa pacienteId={pacienteId} />
    </>
  );
}
