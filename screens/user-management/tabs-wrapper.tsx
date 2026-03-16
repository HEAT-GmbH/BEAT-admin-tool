"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Roles } from "./roles";
import { Users } from "./users";
import { AddRole } from "./add-role";
import { AddUser } from "./add-user";

export const TabsWrapper = () => {
  const [tab, setTab] = useState<"users" | "roles">("users");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {tab === "roles" && <AddRole variant="default" />}
          {tab === "users" && (
            <>
              <AddRole variant="outline" />
              <AddUser />
            </>
          )}
        </div>
      </div>
      <TabsContent value="users">
        <Users />
      </TabsContent>
      <TabsContent value="roles">
        <Roles />
      </TabsContent>
    </Tabs>
  );
};
