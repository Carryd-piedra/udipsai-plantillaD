import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useSearchParams } from "react-router";
import FormularioFonoaudiologia from "../../components/form/fichas-form/FormularioFonoaudiologia";

export default function FichaFonoaudiologia() {
  const [searchParams] = useSearchParams();
  const pacienteId = searchParams.get("pacienteId");

  return (
    <>
      <PageMeta
        title="Fichas | Udipsai"
        description="Formulario para la gestión de fichas fonoaudiológicas en Udipsai"
      />
      <PageBreadcrumb
        pageTitle="Ficha de fonoaudiología"
        items={[
          { label: "Inicio", path: "/" },
          { label: "Pacientes", path: "/pacientes" },
          { label: "Ficha de fonoaudiología" },
        ]}
      />
      <FormularioFonoaudiologia pacienteId={pacienteId} />
    </>
  );
}
