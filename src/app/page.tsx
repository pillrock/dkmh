import Dashboard from "@/components/Dashboard";
import { DataUserProvider } from "@/contexts/dataUser";

export default function Home() {
  return (
    <DataUserProvider>
      <Dashboard />
    </DataUserProvider>
  );
}
