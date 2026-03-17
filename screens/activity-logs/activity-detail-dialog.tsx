"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ActivityLogEntry } from "@/models/activity-log";
import { format } from "date-fns";

interface Props {
  entry: ActivityLogEntry | null;
  onClose: () => void;
}

export const ActivityDetailDialog = ({ entry, onClose }: Props) => {
  if (!entry) return null;

  const isFailed = entry.status === "failed";
  return (
    <Dialog open={!!entry} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="right-side-dialog max-w-[32.5rem]! gap-0">
        <DialogHeader className="p-5 flex-row items-start justify-between border-b border-border">
          <div>
            <h2 className="text-lg text-foreground font-medium">
              Event Details
            </h2>
            <p className="text-xs text-secondary-foreground mt-1">
              {entry.action} · {formatFull(entry.timestamp)}
            </p>
          </div>
          <Button onClick={onClose} variant="ghost">
            <Icon
              name="close-line"
              size={20}
              className="text-secondary-foreground"
            />
          </Button>
        </DialogHeader>
        <div className="flex-1 p-5 overflow-y-auto">
          <div
            className={cn(
              "flex items-center gap-2.5 px-3.5 py-2.5 rad-3 mb-5",
              isFailed
                ? "bg-(--state--error--lighter) border border-(--state--error--base)"
                : "bg-(--state--success--lighter) border border-(--state--success--base)",
            )}
          >
            {isFailed ? (
              <Icon
                name="close-circle-fill"
                size={16}
                className="text-destructive shrink-0"
              />
            ) : (
              <Icon
                name="check-line"
                size={16}
                className="text-(--state--success--base) shrink-0"
              />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                isFailed ? "text-destructive" : "text-(--state--success--base)",
              )}
            >
              {isFailed ? "Event Failed" : "Event Successful"}
            </span>
          </div>

          <SectionLabel>User Information</SectionLabel>
          <div className="flex items-center gap-3 mt-3">
            <div className="size-9 bg-primary/10 rad-3 flex items-center justify-center shrink-0">
              <span className="text-primary text-xs font-medium">
                {entry.userInitials}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-foreground block truncate text-sm font-medium">
                {entry.userName}
              </span>
              <span className="text-secondary-foreground block truncate text-xs font-normal">
                {entry.userEmail}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Field label="Role" value={entry.userRole} />
          </div>

          <div className="h-px bg-border w-full my-5" />

          <SectionLabel>Action Details</SectionLabel>
          <div className="mt-3 flex flex-col gap-4">
            <Field label="Action" value={entry.action} />
            <Field label="Description" value={entry.description} />
            <div>
              <span className="text-secondary-foreground block text-xs font-normal">
                Category
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 bg-secondary text-secondary-foreground rad-3 text-xs font-medium">
                {entry.category}
              </span>
            </div>
            <Field label="Target Resource" value={entry.targetResource} />
          </div>

          <div className="h-px bg-border w-full my-5" />

          <SectionLabel>Technical Details</SectionLabel>
          <div className="mt-3 flex flex-col gap-4">
            <Field label="IP Address" value={entry.ipAddress} />
            <Field label="Timestamp" value={formatFull(entry.timestamp)} />
          </div>

          {/* Failure Details */}
          {isFailed && entry.failureReason && (
            <>
              <div className="h-px bg-border w-full my-5" />
              <SectionLabel>Failure Details</SectionLabel>
              <div className="mt-3 border-l-2 border-l-destructive bg-destructive/[0.04] px-3.5 py-3 text-foreground text-sm font-normal leading-6 rad-3 rounded-l-none">
                {entry.failureReason}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-muted-foreground uppercase tracking-wider text-xs font-medium">
      {children}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-secondary-foreground block text-xs">{label}</span>
      <span className="text-foreground block mt-0.5 text-sm">{value}</span>
    </div>
  );
}

function formatFull(date: Date) {
  return format(date, "MMM dd, yyyy 'at' h:mm a");
}
