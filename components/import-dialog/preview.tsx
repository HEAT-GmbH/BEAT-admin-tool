import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useEffectEvent } from "react";
import { useSteps } from "./steps.context";

export const Preview = () => {
  const { toggleComplete, item, columns } = useSteps();

  const toggleEvent = useEffectEvent(() => {
    toggleComplete(item.id, true);
  });

  useEffect(() => {
    toggleEvent();
  }, []);

  return (
    <div className="size-full space-y-4 flex flex-col">
      <div className="space-y-1 shrink-0">
        <h6 className="h6-title text-foreground">Preview & Confirm</h6>
        <p className="paragraph-small text-(--text--sub-600)">
          Map your file columns to BEAT data fields
        </p>
      </div>

      <div className="w-full flex-1 overflow-auto no-scrollbar rounded-lg bg-white">
        <Table>
          <TableHeader className="bg-(--bg--weak-50) sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[30%]">
                Your file’s imported column
              </TableHead>
              <TableHead className="w-[40%]">System required headers</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((col) => (
              <TableRow key={col.id}>
                <TableCell className="font-medium">{col.fileColumn}</TableCell>
                <TableCell>{col.requiredHeader ?? "--"}</TableCell>
                <TableCell>{col.sampleValue ?? "--"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
