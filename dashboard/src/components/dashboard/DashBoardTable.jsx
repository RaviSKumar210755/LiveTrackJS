import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CircleArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { LoaderWithMessage } from "@/components/loaders/LoaderWithMessage";
import RefreshBtn from "@/components/dashboard/RefreshBtn";
import { CalloutCard } from "@/components/shared/CalloutCard";

import { useDashboardStore } from "@/store/dashboardStore";
import { formatDate } from "@/lib/utils";

export function DashBoardTable() {
  const { sites, getSites, isLoading, error } = useDashboardStore();

  useEffect(() => {
    getSites();
  }, []);

  if (isLoading) return <LoaderWithMessage message="Loading Your sites..." />;
  if (error) return <CalloutCard variant="destructive" text={error} />;

  return (
    <motion.div
      className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative">
        <CalloutCard
          variant="success"
          text={
            sites.length === 0
              ? "No sites being tracked."
              : "These are the sites being tracked by us through your API key!!"
          }
        />
        <RefreshBtn className="absolute right-3 top-3" />
      </div>

      {sites.length !== 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Sites</TableHead>
              <TableHead>Live Users</TableHead>
              <TableHead>Tracking Since</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sites.map((site, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="hover:bg-muted/50 align-middle"
              >
                <TableCell className="font-medium underline underline-offset-2">
                  <a
                    href={`https://${site.host}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {site.host}
                  </a>
                </TableCell>
                <TableCell>{site.liveUsers || "0"}</TableCell>
                <TableCell>{formatDate(site.createdAt)}</TableCell>
                <TableCell>{site.requests || "0"}</TableCell>
                <TableCell className="text-right">
                  <Link
                    to={`/dashboard/analytics/${site._id}`}
                    className="text-sm text-green-400 hover:underline flex items-center"
                    state={{site}}
                  >
                    <CircleArrowRight className="h-5 w-5 hover:scale-110" />
                  </Link>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      )}
    </motion.div>
  );
}
