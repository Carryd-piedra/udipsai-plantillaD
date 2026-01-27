import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import PageMeta from "../../components/common/PageMeta";
import CalendarBox from "../../components/calendar/CalendarBox";

export default function Home() {
  return (
    <>
      <PageMeta
        title="UDIPSAI - Dashboard"
        description="Dashboard de UDIPSAI"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
        </div>
        <div className="col-span-12">
          <CalendarBox />
        </div>
      </div>
    </>
  );
}
