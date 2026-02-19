import { Header } from "@/components/header";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

export const AddBuildingHeader = () => {
  return (
    <Header
      startContent={
        <Button variant="secondary">
          <Icon name="logout-box-line" size={20} />
          Save & Exit
        </Button>
      }
    />
  );
};
