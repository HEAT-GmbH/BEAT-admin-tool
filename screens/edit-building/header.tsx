"use client";

import { Header } from "@/components/header";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const EditBuildingHeader = () => {
  const router = useRouter();

  return (
    <Header
      startContent={
        <Button variant="secondary" onClick={() => router.push("/buildings")}>
          <Icon name="logout-box-line" size={20} />
          Save & Exit
        </Button>
      }
    />
  );
};
