"use client";

import { fileSizeUnit } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { IconName } from "@/models/icons";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Icon } from "./icon";
import { Progress } from "./progress";
import { Button } from "./ui/button";

interface UploadComponentProps {
  onFileSelect?: (file: File) => void;
}

export const UploadComponent = ({ onFileSelect }: UploadComponentProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const percentage = file ? Math.round((progress / file.size) * 100) : 0;
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    console.log(file);
    if (file?.length) {
      setFile(file[0]);
      onFileSelect?.(file[0]);
    }
  };

  const onDragComplete = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files;
    if (file?.length) {
      const f = file[0];
      if (
        f.type === "text/csv" ||
        f.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(f);
        onFileSelect?.(f);
      }
    }
  };

  if (file) {
    return (
      <div className="w-full min-h-23.5 max-w-100 border border-(--stroke--sub-300) rounded-[0.75rem] p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <Icon
            name={
              `file-${file.type.includes("excel") ? "excel" : "csv"}` as IconName
            }
            size={40}
          />
          <div className="space-y-1 flex-1">
            <p className="label-small text-foreground">{file.name}</p>
            <p className="paragraph-x-small text-(--text--sub-600) inline-flex items-center gap-1">
              {`${fileSizeUnit(progress)} of ${fileSizeUnit(file.size)} • `}
              <span className="text-(--blue--500) inline-flex items-center gap-1">
                <Loader2 size={16} />
                <span className="text-foreground">Uploading...</span>
              </span>
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
            <Icon name="close-line" size={24} color="var(--icon--sub-600)" />
          </Button>
        </div>
        <Progress value={percentage} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full min-h-50.5 max-w-100 border border-dashed border-(--stroke--sub-300) rounded-[0.75rem] p-4",
        "flex flex-col items-center justify-center gap-5",
        isDragging && "bg-(--bg--weak-50)",
      )}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDragComplete}
    >
      <Icon name="upload-cloud-2-line" size={24} color="var(--icon--sub-600)" />
      <div className="space-y-1.5 text-center">
        <p className="paragraph-small">Choose a file or drag & drop it here.</p>
        <p className="paragraph-x-small text-(--text--sub-600)">
          CSV and Excel up to 50 MB.
        </p>
      </div>
      <Button
        variant="outline"
        className="h-8"
        onClick={() => inputRef.current?.click()}
      >
        Browse file
      </Button>
      <input
        type="file"
        ref={inputRef}
        onChange={onSelectFile}
        className="hidden"
        accept=".csv,.xlsx,.xls"
        multiple={false}
      />
    </div>
  );
};
