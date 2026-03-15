import { DUMMY_BUILDINGS } from "@/constants/dummy-buildings";
import { DUMMY_ENERGY_CARRIERS } from "@/constants/dummy-energy-carriers";
import { DUMMY_ORGANIZATIONS } from "@/constants/dummy-organizations";
import { delay } from "@/lib/helpers";
import { User } from "@/models/auth";
import { Building } from "@/models/building";
import { Organization } from "@/models/organization";
import { UserListItem } from "@/models/user";
import { OperationalDataEntrySearchSchema } from "@/screens/add-building/operational-data-entry/schema";
import { OperationalDataEntry, Material } from "@/screens/add-building/schema";
import { EPD } from "@/models/epd";
import { DUMMY_EPDS } from "@/constants/dummy-epds";
import { EpdLibrarySearch } from "@/screens/add-building/epd-library-schema";
import { CountrySetting } from "@/models/country-setting";
import { ClimateType } from "@/models/climate-type";
import { BuildingType } from "@/models/building-type";
import { GridEmissionFactor } from "@/models/grid-emission-factor";
import { DUMMY_EC_GRID_FACTORS } from "@/constants/dummy-ec-grid-factors";
import { FuelEmissionFactor } from "@/models/fuel-emission-factor";
import { DUMMY_EC_FUEL_FACTORS } from "@/constants/dummy-ec-fuel-factors";
import { LiftEscalatorSystemFactor } from "@/models/lift-escalator-system";
import { DUMMY_EC_LIFT_ESCALATOR_SYSTEMS } from "@/constants/dummy-ec-lift-escalator-system";
import { CoolingSystemFactor } from "@/models/cooling-system";
import { DUMMY_EC_COOLING_SYSTEMS } from "@/constants/dummy-ec-cooling-systems";
import { HotWaterSystemFactor } from "@/models/hot-water-system";
import { DUMMY_EC_HOT_WATER_SYSTEMS } from "@/constants/dummy-ec-hot-water-systems";
import { LightingSystemFactor } from "@/models/lighting-system";
import { DUMMY_EC_LIGHTING_SYSTEMS } from "@/constants/dummy-ec-lighting-system";
import { VentilationSystemFactor } from "@/models/ventilation-system";
import { DUMMY_EC_VENTILATION_SYSTEMS } from "@/constants/dummy-ec-ventilation-system";

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

  async getOrganizations(params: {
    search?: string;
    industry?: string;
    location?: string;
    assignedTo?: string;
    currentPage: number;
    pageSize: number;
  }): Promise<{
    organizations: Organization[];
    currentPage: number;
    totalOrganizations: number;
  } | null> {
    await delay(1000);
    let filteredOrgs = [...DUMMY_ORGANIZATIONS];

    if (params.search) {
      filteredOrgs = filteredOrgs.filter((org) =>
        org.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    if (params.industry && params.industry !== "All") {
      filteredOrgs = filteredOrgs.filter(
        (org) => org.industry === params.industry
      );
    }

    if (params.location && params.location !== "All") {
      filteredOrgs = filteredOrgs.filter((org) =>
        org.location.toLowerCase().includes(params.location!.toLowerCase())
      );
    }

    if (params.assignedTo && params.assignedTo !== "All") {
      filteredOrgs = filteredOrgs.filter(
        (org) => org.admin.name === params.assignedTo
      );
    }

    const totalOrganizations = filteredOrgs.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedOrgs = filteredOrgs.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      organizations: paginatedOrgs,
      currentPage: params.currentPage,
      totalOrganizations,
    };
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

  // ── Organisations (real API) ──────────────────────────────────────────────

  async getOrganisations(params: {
    search?: string;
    industry?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<Organization> | null> {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.industry) q.set("industry", params.industry);
    if (params.page) q.set("page", String(params.page));
    if (params.pageSize) q.set("page_size", String(params.pageSize));
    return toPageResult(
      await apiFetch<DjangoPaginated<Organization>>(`/api/organisations?${q}`)
    );
  }

  async getOrganisationDetail(id: string): Promise<Organization> {
    return apiFetch(`/api/organisations/${id}`);
  }

  async createOrganisation(data: {
    name: string;
    industry: string;
    country_id?: string;
    city_id?: string;
    invite_users?: { email: string; role: string }[];
  }): Promise<Organization> {
    return apiFetch("/api/organisations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrganisation(
    id: string,
    data: Partial<{
      name: string;
      industry: string;
      country_id: string;
      city_id: string;
      status: string;
    }>
  ): Promise<Organization> {
    return apiFetch(`/api/organisations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // ── Users (real API) ──────────────────────────────────────────────────────

  async getUsers(params: {
    search?: string;
    role?: string;
    organisation?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<UserListItem> | null> {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.role) q.set("role", params.role);
    if (params.organisation) q.set("organisation", params.organisation);
    if (params.page) q.set("page", String(params.page));
    if (params.pageSize) q.set("page_size", String(params.pageSize));
    return toPageResult(
      await apiFetch<DjangoPaginated<UserListItem>>(`/api/users?${q}`)
    );
  }

  async getUserDetail(id: string): Promise<UserListItem> {
    return apiFetch(`/api/users/${id}`);
  }

  async createUser(data: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    organisation_id?: string;
  }): Promise<UserListItem> {
    return apiFetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(
    id: string,
    data: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      organisation_id: string;
      is_active: boolean;
    }>
  ): Promise<UserListItem> {
    return apiFetch(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();