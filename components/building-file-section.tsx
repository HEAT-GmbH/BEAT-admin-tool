"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExistingFile {
  id?: number;
  name: string;
  url: string;
}

export function BuildingFileSection({
  label,
  buildingUuid,
  fileType,
  multiple,
  onFilesChange,
}: {
  label: string;
  buildingUuid: string | null;
  fileType: "certification" | "boq";
  multiple: boolean;
  onFilesChange: (files: File[]) => void;
}) {
  const queryClient = useQueryClient();
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const { data: fileState, isLoading } = useQuery({
    queryKey: ["building-files", buildingUuid],
    queryFn: async () => {
      const res = await fetch(`/api/buildings/files?building_uuid=${buildingUuid}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!buildingUuid,
    staleTime: 0,
  });

  const existingFiles: ExistingFile[] =
    fileType === "certification"
      ? fileState?.certification_file
        ? [fileState.certification_file]
        : []
      : fileState?.boq_files ?? [];

  const { mutate: deleteFile, isPending: isDeleting } = useMutation({
    mutationFn: async (params: { type: string; fileId?: number }) => {
      const url = `/api/buildings/files?building_uuid=${buildingUuid}&type=${params.type}${params.fileId ? `&file_id=${params.fileId}` : ""}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete file");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["building-files", buildingUuid] });
      toast.success("File deleted.");
    },
    onError: () => toast.error("Failed to delete file."),
  });

  const handleNewFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setNewFiles(files);
    onFilesChange(files);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-(--text--sub-600)">{label}</label>

      {!isLoading && existingFiles.length > 0 && (
        <div className="space-y-1">
          {existingFiles.map((f, i) => (
            <div
              key={f.id ?? i}
              className="flex items-center gap-2 p-2 rounded border border-border bg-(--bg--soft-200) text-sm"
            >
              <FileText className="h-4 w-4 shrink-0 text-(--text--sub-600)" />
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-(--text--sub-600) hover:underline"
              >
                {f.name}
              </a>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => deleteFile({ type: fileType, fileId: f.id })}
                className="p-1 rounded hover:bg-destructive/10 text-destructive disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {(existingFiles.length === 0 || multiple) && (
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
          multiple={multiple}
          className="block w-full text-sm text-(--text--sub-600) file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-(--bg--soft-200) file:text-(--text--strong-950) hover:file:bg-(--bg--weak-50) cursor-pointer"
          onChange={handleNewFiles}
        />
      )}
      {newFiles.length > 0 && (
        <p className="text-xs text-(--text--sub-600)">
          {newFiles.length} file(s) selected — will be uploaded on save
        </p>
      )}
    </div>
  );
}
