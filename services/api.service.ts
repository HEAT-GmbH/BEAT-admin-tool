import { DUMMY_BUILDINGS } from "@/constants/dummy-buildings";
import { DUMMY_EC_COOLING_SYSTEMS } from "@/constants/dummy-ec-cooling-systems";
import { DUMMY_EC_FUEL_FACTORS } from "@/constants/dummy-ec-fuel-factors";
import { DUMMY_EC_GRID_FACTORS } from "@/constants/dummy-ec-grid-factors";
import { DUMMY_EC_HOT_WATER_SYSTEMS } from "@/constants/dummy-ec-hot-water-systems";
import { DUMMY_EC_LIFT_ESCALATOR_SYSTEMS } from "@/constants/dummy-ec-lift-escalator-system";
import { DUMMY_EC_LIGHTING_SYSTEMS } from "@/constants/dummy-ec-lighting-system";
import { DUMMY_EC_VENTILATION_SYSTEMS } from "@/constants/dummy-ec-ventilation-system";
import { DUMMY_ENERGY_CARRIERS } from "@/constants/dummy-energy-carriers";
import { DUMMY_EPDS } from "@/constants/dummy-epds";
import { DUMMY_BENCHMARKING_REPORT, DUMMY_BUILDING_EMISSION_REPORT, DUMMY_COMPLIANCE_REPORT, DUMMY_PORTFOLIO_SUMMARY_REPORT } from "@/constants/dummy-reports";
import { DUMMY_USERS } from "@/constants/dummy-users";
import { delay } from "@/lib/helpers";
import { User } from "@/models/auth";
import { Building } from "@/models/building";
import { BuildingType } from "@/models/building-type";
import { ClimateType } from "@/models/climate-type";
import { CoolingSystemFactor } from "@/models/cooling-system";
import { CountrySetting } from "@/models/country-setting";
import { EPD } from "@/models/epd";
import { FuelEmissionFactor } from "@/models/fuel-emission-factor";
import { GridEmissionFactor } from "@/models/grid-emission-factor";
import { HotWaterSystemFactor } from "@/models/hot-water-system";
import { LiftEscalatorSystemFactor } from "@/models/lift-escalator-system";
import { LightingSystemFactor } from "@/models/lighting-system";
import { GeneratedReport, Report, ReportSchema } from "@/models/reports";
import { OrganizationUser } from "@/models/user";
import { VentilationSystemFactor } from "@/models/ventilation-system";
import { EpdLibrarySearch } from "@/screens/add-building/epd-library-schema";
import { OperationalDataEntrySearchSchema } from "@/screens/add-building/operational-data-entry/schema";
import { OperationalDataEntry } from "@/screens/add-building/schema";

type BasePaginatedTable = {
  search?: string;
  currentPage: number;
  pageSize: number;
}

type DjangoPaginated<T> = {
  results: T[];
  pagination: { total: number; page: number; page_size: number; total_pages: number };
};

type PaginatedResult<T> = { data: T[]; currentPage: number; totalItems: number };

function toQuery(params: BasePaginatedTable) {
  return new URLSearchParams({
    page: String(params.currentPage),
    page_size: String(params.pageSize),
    ...(params.search ? { search: params.search } : {}),
  });
}

function toPageResult<T>(res: DjangoPaginated<T>): PaginatedResult<T> {
  return {
    data: res.results,
    currentPage: res.pagination.page,
    totalItems: res.pagination.total,
  };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try { const d = await res.json(); message = d.detail ?? d.message ?? message; } catch { /* ignore */ }
    throw new Error(message);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

class ApiService {
  async login(email: string, password: string): Promise<void> {
    await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  }

  async logout(): Promise<void> {
    await apiFetch("/api/auth/logout", { method: "POST" });
  }

  async me(): Promise<User | null> {
    try {
      const data = await apiFetch<{ user: { id: string; email: string; username: string; first_name: string; last_name: string } }>("/api/auth/profile");
      const u = data.user;
      return { id: String(u.id), email: u.email, username: u.username, firstName: u.first_name, middleName: null, lastName: u.last_name };
    } catch {
      return null;
    }
  }

  async getBuildings(params: {
    search?: string;
    status?: Building["status"] | null;
    location?: string;
    buildingType?: string;
    assignedTo?: string;
    currentPage: number;
    pageSize: number;
  }): Promise<{
    buildings: Building[];
    currentPage: number;
    totalBuildings: number;
  } | null> {
    await delay(1000);
    let filteredBuildings = [...DUMMY_BUILDINGS];

    if (params.search) {
      filteredBuildings = filteredBuildings.filter((b) =>
        b.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    if (params.status && params.status !== null) {
      filteredBuildings = filteredBuildings.filter(
        (b) => b.status === params.status
      );
    }

    if (params.location && params.location !== "All") {
      filteredBuildings = filteredBuildings.filter((b) =>
        b.location.toLowerCase().includes(params.location!.toLowerCase())
      );
    }

    if (params.buildingType && params.buildingType !== "All") {
      filteredBuildings = filteredBuildings.filter(
        (b) => b.building_type === params.buildingType
      );
    }

    if (params.assignedTo && params.assignedTo !== "All") {
      filteredBuildings = filteredBuildings.filter(
        (b) => b.assigned_to.name === params.assignedTo
      );
    }

    const totalBuildings = filteredBuildings.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedBuildings = filteredBuildings.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      buildings: paginatedBuildings,
      currentPage: params.currentPage,
      totalBuildings,
    };
  }

  async getEnergyCarriers(params: OperationalDataEntrySearchSchema & {pageSize: number, currentPage: number}):Promise<{
    data: OperationalDataEntry[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_ENERGY_CARRIERS];

    if (params.searchValue) {
      filteredData = filteredData.filter((d) =>
        d.childCategory.toLowerCase().includes(params.searchValue!.toLowerCase()) ||
        d.subCategory.toLowerCase().includes(params.searchValue!.toLowerCase()) ||
        d.category.toLowerCase().includes(params.searchValue!.toLowerCase())
      );
    }

    if (params.country && params.country !== "all") {
      filteredData = filteredData.filter((d) =>
        d.country.toLowerCase().includes(params.country!.toLowerCase())
      );
    }

    if (params.category) {
      filteredData = filteredData.filter((d) =>
        d.category.toLowerCase().includes(params.category!.toLowerCase())
      );
    }

    if (params.subCategory) {
      filteredData = filteredData.filter((d) =>
        d.subCategory.toLowerCase().includes(params.subCategory!.toLowerCase())
      );
    }

    if (params.childCategory) {
      filteredData = filteredData.filter((d) =>
        d.childCategory.toLowerCase().includes(params.childCategory!.toLowerCase())
      );
    }

    if (params.epdType) {
      filteredData = filteredData.filter((d) =>
        d.epdType.toLowerCase().includes(params.epdType!.toLowerCase())
      );
    }

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData,
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getEpds(params: EpdLibrarySearch & { pageSize: number, currentPage: number }): Promise<{
    data: EPD[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_EPDS];

    if (params.searchValue) {
      filteredData = filteredData.filter((d) =>
        d.name.toLowerCase().includes(params.searchValue!.toLowerCase()) ||
        d.category.toLowerCase().includes(params.searchValue!.toLowerCase()) ||
        d.childCategory.toLowerCase().includes(params.searchValue!.toLowerCase())
      );
    }

    if (params.country && params.country !== "all") {
      filteredData = filteredData.filter((d) =>
        d.country.toLowerCase() === params.country!.toLowerCase()
      );
    }

    if (params.category && params.category !== "all") {
      filteredData = filteredData.filter((d) =>
        d.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    if (params.subCategory && params.subCategory !== "all") {
      filteredData = filteredData.filter((d) =>
        d.subCategory.toLowerCase() === params.subCategory!.toLowerCase()
      );
    }

    if (params.childCategory && params.childCategory !== "all") {
      filteredData = filteredData.filter((d) =>
        d.childCategory.toLowerCase() === params.childCategory!.toLowerCase()
      );
    }

    if (params.epdType && params.epdType !== "all") {
      filteredData = filteredData.filter((d) =>
        d.epdType.toLowerCase() === params.epdType!.toLowerCase()
      );
    }

    // Sorting logic (placeholder)
    if (params.sortBy) {
      // implementation if needed
    }

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData,
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getClimateTypeDetail(id: string): Promise<ClimateType> {
    return apiFetch(`/api/system-settings/climate-types/${id}`);
  }

  async getCountryDetail(id: string): Promise<CountrySetting> {
    return apiFetch(`/api/system-settings/countries/${id}`);
  }

  async getBuildingTypeDetail(id: string): Promise<BuildingType> {
    return apiFetch(`/api/system-settings/building-types/${id}`);
  }

  async getCountrySettings(params: BasePaginatedTable): Promise<PaginatedResult<CountrySetting> | null> {
    const q = toQuery(params);
    return toPageResult(await apiFetch<DjangoPaginated<CountrySetting>>(`/api/system-settings/countries?${q}`));
  }

  async getClimateTypes(params: BasePaginatedTable): Promise<PaginatedResult<ClimateType> | null> {
    const q = toQuery(params);
    return toPageResult(await apiFetch<DjangoPaginated<ClimateType>>(`/api/system-settings/climate-types?${q}`));
  }

  async getBuildingTypes(params: BasePaginatedTable): Promise<PaginatedResult<BuildingType> | null> {
    const q = toQuery(params);
    return toPageResult(await apiFetch<DjangoPaginated<BuildingType>>(`/api/system-settings/building-types?${q}`));
  }

  async createClimateType(data: { name: string; description: string }): Promise<ClimateType> {
    return apiFetch("/api/system-settings/climate-types", { method: "POST", body: JSON.stringify(data) });
  }

  async updateClimateType(id: string, data: { name: string; description: string; status: string }): Promise<ClimateType> {
    return apiFetch(`/api/system-settings/climate-types/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  }

  async createBuildingType(data: { name: string; has_subtypes: boolean; subtypes: { name: string }[] }): Promise<BuildingType> {
    return apiFetch("/api/system-settings/building-types", { method: "POST", body: JSON.stringify(data) });
  }

  async updateBuildingType(id: string, data: { name: string; has_subtypes: boolean; subtypes: { name: string }[] }): Promise<BuildingType> {
    return apiFetch(`/api/system-settings/building-types/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  }

  async getGridEmissionFactors(params: BasePaginatedTable): Promise<{
    data: GridEmissionFactor[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_EC_GRID_FACTORS];

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData as GridEmissionFactor[],
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getFuelEmissionFactors(params: BasePaginatedTable): Promise<{
    data: FuelEmissionFactor[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_EC_FUEL_FACTORS];

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData as FuelEmissionFactor[],
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getLiftEscalatorSystemFactors(params: BasePaginatedTable): Promise<{
    data: LiftEscalatorSystemFactor[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_EC_LIFT_ESCALATOR_SYSTEMS];

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData as LiftEscalatorSystemFactor[],
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getLightingSystemFactors(params: BasePaginatedTable): Promise<{
    data: LightingSystemFactor[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_EC_LIGHTING_SYSTEMS];

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData as LightingSystemFactor[],
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getVentilationSystemFactors(params: BasePaginatedTable): Promise<{
    data: VentilationSystemFactor[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_EC_VENTILATION_SYSTEMS];

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData as VentilationSystemFactor[],
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getHotWaterSystemFactors(params: BasePaginatedTable): Promise<{
    data: HotWaterSystemFactor[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_EC_HOT_WATER_SYSTEMS];

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData as HotWaterSystemFactor[],
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getCoolingSystemFactors(params: BasePaginatedTable): Promise<{
    data: CoolingSystemFactor[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_EC_COOLING_SYSTEMS];

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData as CoolingSystemFactor[],
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getUsers(params: BasePaginatedTable): Promise<{
    data: OrganizationUser[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_USERS];

    if (params.search) {
      filteredData = filteredData.filter((user) =>
        user.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        user.email.toLowerCase().includes(params.search!.toLowerCase()),
      );
    }

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData,
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async generateReport(params: ReportSchema | null): Promise<GeneratedReport | null>{
    if(!params) return null;
    await delay(1000);
    let report: Report;
    let auditNotes:string | undefined = undefined;

    switch (params.type) {
      case "building_emission":
        report = DUMMY_BUILDING_EMISSION_REPORT;
        break;
      case "portfolio_summary":
        report = DUMMY_PORTFOLIO_SUMMARY_REPORT;
        break;
      case "compliance":
        report = DUMMY_COMPLIANCE_REPORT;
        auditNotes = "Data sourced from project-specific EPDs where available; generic ICE v3.0 factors used for remaining materials. Operational data based on 12-month utility records. This report is pending third-party review and should not be used for regulatory submissions until verified."
        break;
      case "benchmarking":
        report = DUMMY_BENCHMARKING_REPORT;
        break;
      default:
        return null;
    }

    return {
      ...report,
      config: {
        ...report.config,
        ...params.config,
      },
      generatedAt: new Date(),
      auditNotes
    } as GeneratedReport;
  }
}

export const apiService = new ApiService();