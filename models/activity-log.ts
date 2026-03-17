export interface ActivityLogEntry {
  id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  userInitials: string;
  action: string;
  actionVerb: string;
  actionTarget: string;
  description: string;
  category: string;
  targetResource: string;
  status: "success" | "failed";
  failureReason?: string;
  ipAddress: string;
  timestamp: Date;
  iconType: "user" | "building" | "org" | "data" | "auth" | "settings" | "emission";
}