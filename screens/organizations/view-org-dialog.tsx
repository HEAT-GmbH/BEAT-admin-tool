"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RightDialogHeader } from "@/components/right-dialog-header";
import { Organization } from "@/models/organization";
import { apiService } from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string | null;
  mode: "view" | "edit";
}

export const ViewOrgDialog = ({ open, onOpenChange, orgId, mode }: Props) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");

  const { data: org, isLoading } = useQuery<Organization>({
    queryKey: ["organisation-detail", orgId],
    queryFn: () => apiService.getOrganisationDetail(orgId!),
    enabled: open && !!orgId,
  });

  useEffect(() => {
    if (org) {
      setName(org.name);
      setIndustry(org.industry ?? "");
    }
  }, [org]);

  const { mutateAsync: update, isPending } = useMutation({
    mutationFn: (data: { name: string; industry: string }) =>
      apiService.updateOrganisation(orgId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({ queryKey: ["organisation-detail", orgId] });
      toast.success("Organisation updated");
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSave = async () => {
    await update({ name, industry });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="right-side-dialog gap-0 p-0 max-w-136!">
        <RightDialogHeader
          title={mode === "edit" ? "Edit organization" : "Organization details"}
          description={mode === "edit" ? "Update organization information" : "View organization information"}
          onClose={() => onOpenChange(false)}
          className="border-b border-(--stroke--soft-200)"
        />

        {isLoading || !org ? (
          <div className="p-6 text-center text-(--text--sub-600)">Loading...</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header card */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border border-border">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-(--bg--soft-200) text-(--text--sub-600) text-lg">
                  {org.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-(--text--strong-950)">{org.name}</span>
                <Badge
                  variant="outline"
                  className="text-xs w-fit min-h-5 px-1.5 rounded-[0.25rem] border-(--stroke--soft-200)"
                >
                  {org.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Fields */}
            {mode === "edit" ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Organization name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Industry</Label>
                  <Select value={industry} onValueChange={(v) => setIndustry(v ?? "")}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-(--text--sub-600) mb-1">Industry</p>
                    <p className="text-sm font-medium">{org.industry || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-(--text--sub-600) mb-1">Location</p>
                    <p className="text-sm font-medium">
                      {[org.city?.name, org.country?.name].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-(--text--sub-600) mb-1">Buildings</p>
                    <p className="text-sm font-medium">{org.buildings_count ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-(--text--sub-600) mb-1">Total Emissions</p>
                    <p className="text-sm font-medium">{org.total_emissions ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-(--text--sub-600) mb-1">Joined</p>
                    <p className="text-sm font-medium">
                      {org.created_at ? new Date(org.created_at).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>

                {org.admins && org.admins.length > 0 && (
                  <div>
                    <p className="text-xs text-(--text--sub-600) mb-2">Admins</p>
                    <div className="flex flex-col gap-2">
                      {org.admins.map((admin) => (
                        <div key={admin.id} className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">
                              {(admin.full_name || admin.email).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{admin.full_name || admin.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t border-(--stroke--soft-200) flex justify-end gap-3 bg-white mt-auto">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-4">
            {mode === "edit" ? "Cancel" : "Close"}
          </Button>
          {mode === "edit" && (
            <Button onClick={handleSave} disabled={isPending} className="h-10 px-4">
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
