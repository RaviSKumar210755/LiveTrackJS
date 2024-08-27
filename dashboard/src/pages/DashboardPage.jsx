import { motion } from "framer-motion";

import { ContentLayout } from "@/components/ContentLayout";
import { DashBoardLineChart } from "@/components/charts/DashBoardLineChart";

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <motion.div
        className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <DashBoardLineChart />
      </motion.div>
    </ContentLayout>
  );
}
