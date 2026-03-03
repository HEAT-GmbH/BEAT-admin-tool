import { PageHeader } from "@/components/page-header";

interface Props {
  title: string;
  description: string;
  headerActions: React.ReactNode;
  searchBar: React.ReactNode;
  table: React.ReactNode;
  pagination?: React.ReactNode;
}

export const SSWrapper = ({
  title,
  description,
  headerActions,
  searchBar,
  table,
  pagination,
}: Props) => {
  return (
    <div className="size-full flex flex-col gap-6">
      <PageHeader title={title} description={description}>
        {headerActions}
      </PageHeader>

      <div className="w-full">{searchBar}</div>

      <div className="flex flex-col gap-4.75 overflow-x-auto w-full">
        {table}
        {pagination}
      </div>
    </div>
  );
};
