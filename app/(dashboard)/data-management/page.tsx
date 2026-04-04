import DataManagementScreen from "@/screens/data-management";
import { apiService } from "@/services/api.service";

export default async function DataManagementPage() {
  const summary = await apiService.getDataManagementSummary();

  return <DataManagementScreen summary={summary} />;
}
