import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PasantesAccionesTable from "../../components/tables/AccionTables/PasantesAccionesTable";

export default function ListaPasantes() {
  return (
    <>
      <PageMeta
        title="Lista de Pasantes | Udipsai"
        description="Formulario para la gestión de pasantes en Udipsai"
      />
      <PageBreadcrumb pageTitle="Lista de pasantes" />
      <PasantesAccionesTable />
    </>
  );
}
