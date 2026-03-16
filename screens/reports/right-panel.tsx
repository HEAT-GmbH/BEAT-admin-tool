"use client";

import { Card } from "@/components/ui/card";
import { useReportContext } from "./context";
import { Loader } from "@/components/loader";
import { Icon } from "@/components/icon";
import { capitalize } from "@/lib/helpers";
import { Progress } from "@/components/progress";
import { DataTable } from "@/components/data-table";
import { BenchmarkingReport, PortfolioSummaryReport } from "@/models/reports";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const RightPanel = () => {
  const { generatedReport, isGenerating, generateError } = useReportContext();

  if (isGenerating) {
    return (
      <div className="grid place-items-center mx-auto">
        <Loader size={32} />
      </div>
    );
  }

  if (generateError || !generatedReport) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col items-stretch gap-4 p-6 flex-1 max-w-240 mx-auto">
      <Header />
      <Completeness />
      <Summary />
      <BreakDown />
      <AuditLog />
      <div className="px-2 py-4 flex items-center justify-between">
        <span className="text-secondary-foreground text-xs">
          BEAT &middot; IKI-ALCBT &middot; HEAT GmbH
        </span>
        <span className="text-secondary-foreground text-xs">
          Report preview
        </span>
      </div>
    </div>
  );
};

function Header() {
  const { generatedReport } = useReportContext();
  const { type, generatedAt, config } = generatedReport!;
  const typeLabel = capitalize(type).replace("_", " ");
  const title = () => {
    switch (type) {
      case "building_emission":
        return `${config.building || "Building"} \u2014 ${config.year || "Year"} Emission Report`;
      case "portfolio_summary":
        return `${config.organization || "Portfolio"} \u2014 ${config.country || "Country"} ${config.year || "Year"} Summary`;
      case "compliance":
        return `${config.reportingStandard || "Standard"} Compliance \u2014 ${config.country || "Country"} ${config.year || "Year"}`;
      case "benchmarking":
        return `${config.buildingType || "Type"} Benchmarking \u2014 ${config.country || "Country"} ${config.year || "Year"}`;
    }
  };
  const dateStr = generatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const yearStr = config.year || new Date().getFullYear().toString();

  return (
    <Card className="shadow-none w-full px-6 py-5 border-border gap-1">
      <span className="uppercase font-medium text-secondary-foreground text-xs">
        {typeLabel}
      </span>
      <h3 className="text-foreground text-2xl font-medium">{title()}</h3>
      <span className="text-secondary-foreground text-sm">
        Year: {yearStr} &middot; {dateStr} &middot; BEAT Platform
      </span>
    </Card>
  );
}

function Completeness() {
  const { generatedReport } = useReportContext();
  const {
    config: { dataCompleteness },
  } = generatedReport!;

  const isComplete = dataCompleteness === 100;
  return (
    <Card className="bg-(--state--warning--lighter) border-(--state-warning--base) px-5 py-4 gap-2">
      <div className="flex items-center justify-between text-foreground text-sm font-medium">
        <label>Data Completeness</label>
        <span>{dataCompleteness}%</span>
      </div>
      <Progress
        value={dataCompleteness}
        className="bg-(--state--warning--light)"
        barClassName="bg-(--state--warning--base)"
      />
      <div className="flex items-start gap-2">
        <Icon
          name={isComplete ? "check-line" : "alert-fill"}
          color={
            isComplete ? "var(--primary-green)" : "var(--state--warning--base)"
          }
        />
        <p className="text-xs text-foreground">
          {isComplete
            ? "All fields complete!"
            : "Some data fields are incomplete. Gaps will be noted in the export."}
        </p>
      </div>
    </Card>
  );
}

function Summary() {
  const { generatedReport } = useReportContext();
  const { type, config } = generatedReport!;

  const items: {
    title: string;
    amount: number | string;
    unit?: string;
    color: string;
  }[] =
    type === "building_emission"
      ? [
          {
            title: "Total Emmissions",
            color: "black",
            ...config.totalEmissions,
          },
          {
            title: "Embodied",
            color: "var(--blue--500)",
            ...config.embodiedCarbon,
          },
          {
            title: "Operational",
            color: "var(--primary-green)",
            ...config.operationalCarbon,
          },
          {
            title: "Floor Area",
            color: "var(--stroke--strong-950)",
            ...config.floorArea,
          },
        ]
      : type === "portfolio_summary"
        ? [
            {
              title: "Total Emmissions",
              color: "black",
              ...config.totalEmissions,
            },
            {
              title: "Buildings Assessed",
              color: "var(--blue--500)",
              amount: config.buildingsAssessed,
            },
            {
              title: "Avg. Carbon Intensity",
              color: "var(--stroke--strong-950)",
              ...config.avgCarbonIntensity,
            },
          ]
        : type === "compliance"
          ? [
              {
                title: "Reporting standard",
                color: "black",
                amount: config.reportingStandard,
              },
              {
                title: "Country",
                color: "var(--stroke--strong-950)",
                amount: config.country,
              },
              {
                title: "Buildings Covered",
                color: "var(--primary-green)",
                amount: config.buildingsCovered,
              },
            ]
          : [
              {
                title: "Building type",
                color: "black",
                amount: config.buildingType,
              },
              {
                title: "Country",
                color: "var(--blue--500)",
                amount: config.country,
              },
              {
                title: "Peer group size",
                color: "var(--primary-green)",
                amount: config.peerGroupSize,
              },
            ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3">
      {items.map((item) => (
        <Card
          key={item.title}
          className="border-t-3 p-4 gap-1.5 shadow-none"
          style={{
            borderTopColor: item.color,
            borderTopStyle: "dashed",
          }}
        >
          <span className="text-secondary-foreground uppercase text-xs font-medium">
            {item.title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground text-3xl font-medium">
              {item.amount}
            </span>
            {!!item.unit && (
              <span className="text-xs text-shadow-secondary-foreground">
                {item.unit}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function BreakDown() {
  const { generatedReport } = useReportContext();
  const { type, config } = generatedReport!;

  if (type === "building_emission") {
    return (
      <>
        <Card className="shadow-none p-5 gap-0">
          <h6 className="text-lg text-foreground font-medium">Carbon Split</h6>
          <p className="text-secondary-foreground text-xs mb-4">
            Embodied vs operational breakdown
          </p>
          <SplitBar
            leftLabel={"Embodied"}
            leftValue={config.embodiedCarbon.amount}
            rightLabel={"Operational"}
            rightValue={config.operationalCarbon.amount}
            leftColor="var(--blue--500)"
            rightColor="var(--primary-green)"
            unit={config.embodiedCarbon.unit}
          />
        </Card>
        <Card className="shadow-none p-5 gap-0">
          <h6 className="text-lg text-foreground font-medium">
            Embodied Carbon by Assembly
          </h6>
          <p className="text-secondary-foreground text-xs mb-4">
            Distribution across building components
          </p>
          <div className="flex flex-col gap-3">
            {config.embodiedCarbonBreakdown.map((item) => (
              <HorizontalBar
                key={item.label}
                label={item.label}
                value={item.amount}
                maxValue={Math.max(
                  ...config.embodiedCarbonBreakdown.map((i) => i.amount),
                )}
                color="var(--blue--500)"
                unit={item.unit}
              />
            ))}
          </div>
        </Card>
        <Card className="shadow-none p-5 gap-0">
          <h6 className="text-lg text-foreground font-medium">
            Operational Carbon by System
          </h6>
          <p className="text-secondary-foreground text-xs mb-4">
            Annual energy consumption (MWh/year)
          </p>
          <div className="flex flex-col gap-3">
            {config.operationalCarbonBreakdown.map((item) => (
              <HorizontalBar
                key={item.label}
                label={item.label}
                value={item.amount}
                maxValue={Math.max(
                  ...config.operationalCarbonBreakdown.map((i) => i.amount),
                )}
                color="var(--primary-green)"
                unit={item.unit}
              />
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (type === "portfolio_summary") {
    return (
      <>
        <Card className="shadow-none p-5 gap-0">
          <h6 className="text-lg text-foreground font-medium">
            Portfolio Carbon Split
          </h6>
          <p className="text-secondary-foreground text-xs mb-4">
            Embodied vs operational breakdown
          </p>
          <SplitBar
            leftLabel={"Embodied"}
            leftValue={config.embodiedCarbon.amount}
            rightLabel={"Operational"}
            rightValue={config.operationalCarbon.amount}
            leftColor="var(--blue--500)"
            rightColor="var(--primary-green)"
            unit={config.embodiedCarbon.unit}
          />
        </Card>
        <Card className="shadow-none p-5 gap-0">
          <h6 className="text-lg text-foreground font-medium mb-4">
            Building Breakdown
          </h6>
          <PortfolioTable />
        </Card>
      </>
    );
  }

  if (type === "compliance") {
    return (
      <>
        <Card className="shadow-none p-5 gap-0">
          <h6 className="text-base text-foreground font-medium mb-4">
            Methodology & Data Sources
          </h6>
          <div className="grid grid-cols-[auto_1fr] gap-y-1">
            {config.methodologyAndDataSources.map((item) => (
              <React.Fragment key={item.label}>
                <span className="text-xs text-secondary-foreground w-45 shrink-0 text-ellipsis">
                  {item.label}
                </span>
                <p className="text-foreground text-sm">{item.value}</p>
              </React.Fragment>
            ))}
          </div>
        </Card>

        <Card className="shadow-none p-5 gap-0">
          <h6 className="text-lg text-foreground font-medium mb-4">
            Emissions by Building
          </h6>
          <div className="flex flex-col gap-3">
            {config.emissionBreakdown.map((item) => (
              <HorizontalBar
                key={item.label}
                label={item.label}
                value={item.amount}
                maxValue={Math.max(
                  ...config.emissionBreakdown.map((i) => i.amount),
                )}
                color="var(--primary-green)"
                unit={item.unit}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between py-2.5 border-t border-border">
            <span className="text-foreground text-sm font-medium">Total</span>
            <span className="text-foreground text-sm font-medium">
              {config.emissionBreakdown
                .reduce((prev, curr) => prev + curr.amount, 0)
                .toLocaleString()}{" "}
              tCO2e
            </span>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className="shadow-none p-5 gap-0">
        <h6 className="text-lg text-foreground font-medium mb-4">
          Performance Comparison
        </h6>
        <div className="flex flex-col gap-3">
          {config.performanceComparision.map((item) => (
            <HorizontalBar
              key={item.label}
              label={item.label}
              value={item.amount}
              maxValue={Math.max(
                ...config.performanceComparision.map((i) => i.amount),
              )}
              color={item.color}
              unit={item.unit}
            />
          ))}
        </div>
      </Card>
      <Card className="shadow-none p-5 gap-0">
        <h6 className="text-lg text-foreground font-medium mb-4">
          Peer Rankings
        </h6>
        <PeerTable />
      </Card>
    </>
  );
}

function AuditLog() {
  const { generatedReport } = useReportContext();
  const { auditNotes } = generatedReport!;

  if (!auditNotes) return null;

  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rad-2.5 border border-(--state--warning--base) bg-(--state--warning--lighter)">
      <AlertTriangle size={16} className="text-(--state--warning--base)" />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Audit Notes</span>
        <span className="text-secondary-foreground text-xs">{auditNotes}</span>
      </div>
    </div>
  );
}

function PortfolioTable() {
  const { generatedReport } = useReportContext();
  const {
    config: { buildingBreakdown },
  } = generatedReport as PortfolioSummaryReport;

  const columns: ColumnDef<
    PortfolioSummaryReport["config"]["buildingBreakdown"][number]
  >[] = [
    {
      accessorKey: "building",
      header: "Building",
    },
    {
      accessorKey: "area",
      header: "Area(m2)",
    },
    {
      accessorKey: "embodiedCarbon.amount",
      header: "Embodied",
    },
    {
      accessorKey: "operationalCarbon.amount",
      header: "Operational",
    },
    {
      accessorKey: "totalEmissions.amount",
      header: "Total (tCO2e)",
    },
  ];

  return <DataTable columns={columns} data={buildingBreakdown} />;
}

function PeerTable() {
  const { generatedReport } = useReportContext();
  const {
    config: { peerRankings },
  } = generatedReport as BenchmarkingReport;

  const columns: ColumnDef<
    BenchmarkingReport["config"]["peerRankings"][number]
  >[] = [
    {
      accessorKey: "rank",
      header: "Rank",
      cell: ({ row }) => <>#{row.original.rank}</>,
    },
    {
      accessorKey: "building",
      header: "Building",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.building}
          {!!row.original.isOwnBuilding && <Badge>YOU</Badge>}
        </div>
      ),
    },
    {
      id: "carbonIntensity",
      header: "Carbon Intensity",
      cell: ({ row }) => (
        <>
          {row.original.carbonIntensity.amount +
            row.original.carbonIntensity.unit}
        </>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.original.rating;
        return (
          <>
            <Badge
              className={cn(
                "rad-1.5!",
                rating.startsWith("B") && "bg-(--primary-green)/50",
                rating.startsWith("C") && "bg-(--state--warning--light)",
                rating.startsWith("D") && "bg-(--state--error--light)",
              )}
            >
              {rating}
            </Badge>
          </>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={peerRankings} />;
}

function EmptyState() {
  return (
    <div className="grid place-items-center p-4 mx-auto">
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="size-14 rad-2.5 bg-card border border-border flex items-center justify-center">
          <Icon
            name="file-chart-fill"
            size={32}
            color="var(--icon--soft-400)"
          />
        </div>
        <div className="text-center max-w-80">
          <h6 className="text-foreground font-medium">No reports generated</h6>
          <p className="text-secondary-foreground text-sm">
            Select a report type, configure the parameters, and click Generate
            Report to preview results here.
          </p>
        </div>
      </div>
    </div>
  );
}

function SplitBar({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  leftColor,
  rightColor,
  leftTextColor = "white",
  rightTextColor = "white",
  unit,
}: {
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
  leftColor: string;
  rightColor: string;
  leftTextColor?: string;
  rightTextColor?: string;
  unit: string;
}) {
  const total = leftValue + rightValue;
  const leftPct = total > 0 ? Math.round((leftValue / total) * 100) : 50;
  const rightPct = 100 - leftPct;

  const items = [
    {
      width: leftPct + "%",
      background: leftColor,
      label: leftLabel,
      color: leftTextColor,
      value: leftValue,
    },
    {
      width: rightPct + "%",
      background: rightColor,
      label: rightLabel,
      color: rightTextColor,
      value: rightValue,
    },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="w-full h-9 rad-2.5 overflow-hidden flex">
        {items.map(({ width, background, label, color }, i) => (
          <div
            key={i}
            className="h-full flex items-center justify-center transition-all duration-700"
            style={{ width, background }}
          >
            <span className="text-xs font-medium" style={{ color }}>
              {label} {width}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5">
        {items.map(({ background, label, value }, i) => (
          <div className="flex items-center gap-1.5">
            <div
              key={i}
              className="size-[8px] rounded-sm"
              style={{ background }}
            />
            <span className="text-secondary-foreground text-xs">
              {label}: {value} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBar({
  label,
  value,
  maxValue,
  color,
  unit,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  unit: string;
}) {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-foreground w-40 shrink-0 truncate text-sm">
        {label}
      </span>
      <div className="flex-1 relative h-7 bg-muted rad-2.5 overflow-hidden">
        <div
          className="h-full rad-2.5 flex items-center justify-end px-2 transition-all duration-700"
          style={{ width: `${pct}%`, background: color, minWidth: "2.5rem" }}
        >
          <span className="text-white text-xs font-medium">
            {value.toLocaleString()}
          </span>
        </div>
      </div>
      <span className="text-secondary-foreground w-10 shrink-0 text-right text-xs">
        {unit}
      </span>
    </div>
  );
}
