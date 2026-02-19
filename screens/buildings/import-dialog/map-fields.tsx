import { Icon } from "@/components/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { delay } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSteps } from "./steps.context";

export const MapFields = () => {
  const { columns, setColumns, toggleComplete, item } = useSteps();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const mismatchedCount = columns.filter((c) => c.status === "mismatch").length;

  const handleFix = async (id: string, value: string | null) => {
    if (!value) return;
    // Optimistic update or wait for "backend"
    setLoadingIds((prev) => [...prev, id]);

    await delay(2000);
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === id) {
          // Check if matches original (simulation)
          // In reality we'd probably just accept the mapping
          return {
            ...col,
            requiredHeader: value,
            status: "success",
          };
        }
        return col;
      }),
    );
    setLoadingIds((prev) => prev.filter((i) => i !== id));
    toggleComplete(item.id, true);
  };

  return (
    <div className="size-full space-y-4 flex flex-col">
      <div className="space-y-1 shrink-0">
        <h6 className="h6-title text-foreground">Map Your Columns</h6>
        <p className="paragraph-small text-(--text--sub-600)">
          Map your file columns to BEAT data fields
        </p>
      </div>

      <div
        className={cn(
          "w-full flex items-center justify-center gap-3 px-12 py-3",
          mismatchedCount > 0
            ? "text-(--state--warning--base) bg-(--state--warning--lighter)"
            : "text-(--state--success--base) bg-(--state--success--lighter)",
        )}
      >
        <Icon
          name={mismatchedCount > 0 ? "alert-fill" : "select-box-circle-fill"}
          size={20}
        />
        <span className="label-small text-foreground">
          {mismatchedCount > 0 ? (
            <>
              You have {mismatchedCount} column field mismatch •{" "}
              <span className="paragraph-small">
                Please fix this to continue
              </span>
            </>
          ) : (
            "All columns mapped successfully"
          )}
        </span>
      </div>

      <div className="w-full flex-1 no-scrollbar overflow-auto rounded-lg">
        <Table>
          <TableHeader className="bg-(--bg--weak-50) sticky top-0 z-10 border-none">
            <TableRow>
              <TableHead className="w-[33%]">
                Your file’s imported column
              </TableHead>
              <TableHead className="w-[40.5%]">
                System required headers
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-none">
            {columns.map((col) => (
              <TableRow key={col.id}>
                <TableCell className="font-medium">{col.fileColumn}</TableCell>
                <TableCell>
                  {col.status === "mismatch" ? (
                    <Select
                      onValueChange={(val: string | null) =>
                        handleFix(col.id, val)
                      }
                      disabled={loadingIds.includes(col.id)}
                    >
                      <SelectTrigger className="w-full bg-white h-9">
                        <SelectValue placeholder="-- Select Header --" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Mock options based on what's expected + some others */}
                        <SelectItem value="building_identifer">
                          building_identifer
                        </SelectItem>
                        <SelectItem value="building_address">
                          building_address
                        </SelectItem>
                        <SelectItem value="region_state">
                          region_state
                        </SelectItem>
                        <SelectItem value="building_city">
                          building_city
                        </SelectItem>
                        <SelectItem value="country">country</SelectItem>
                        {/* Add more as needed */}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-9 px-3 py-2 border border-(--stroke--sub-300) rounded-md bg-(--bg--weak-50) text-(--text--main-900) text-sm w-full truncate">
                      {col.requiredHeader ?? "--"}
                    </div>
                  )}
                </TableCell>
                <TableCell>{col.type}</TableCell>
                <TableCell>
                  <div className="flex">
                    {loadingIds.includes(col.id) ? (
                      <Loader2
                        size={18}
                        className="animate-spin text-(--icon--sub-600)"
                      />
                    ) : col.status === "success" ? (
                      <Icon
                        name="select-box-circle-fill"
                        size={20}
                        className="text-(--state--success--base)"
                      />
                    ) : (
                      <Icon
                        name="error-warning-fill"
                        size={20}
                        className="text-(--state--warning--base)"
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
