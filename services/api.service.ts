import { DUMMY_BUILDINGS } from "@/constants/dummy-buildings";
import { DUMMY_ENERGY_CARRIERS } from "@/constants/dummy-energy-carriers";
import { DUMMY_ORGANIZATIONS } from "@/constants/dummy-organizations";
import { delay } from "@/lib/helpers";
import { User } from "@/models/auth";
import { Building } from "@/models/building";
import { Organization } from "@/models/organization";
import { OperationalDataEntrySearchSchema } from "@/screens/add-building/operational-data-entry/schema";
import { OperationalDataEntry, Material } from "@/screens/add-building/schema";
import { EPD } from "@/models/epd";
import { DUMMY_EPDS } from "@/constants/dummy-epds";
import { EpdLibrarySearch } from "@/screens/add-building/epd-library-schema";
import { DUMMY_COUNTRY_SETTINGS } from "@/constants/dummy-country-settings";
import { CountrySetting } from "@/models/country-setting";
import { ClimateType } from "@/models/climate-type";
import { DUMMY_CLIMATE_TYPES } from "@/constants/dummy-client-types";
import { BuildingType } from "@/models/building-type";
import { DUMMY_SYSTEM_BUILDINGS } from "@/constants/dummy-system-buildings";

class ApiService {
  user: User | null = null;

  async login(email: string, password: string) {
    await delay(1000);
    console.log(email, password);
    this.user = {
      email,
      id: "1",
      firstName: "Joseph",
      lastName: "J.",
      middleName: "",
    };
  }

  async logout() {
    await delay(1000);
    this.user = null;
  }

  async me(): Promise<User | null> {
    await delay(1000);
    return this.user;
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

  async getCountrySettings(params: {
    search?: string;
    currentPage: number;
    pageSize: number;
  }): Promise<{
    data: CountrySetting[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_COUNTRY_SETTINGS];

    if (params.search) {
      filteredData = filteredData.filter((d) =>
        d.name.toLowerCase().includes(params.search!.toLowerCase())
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

  async getClimateTypes(params: {
    search?: string;
    currentPage: number;
    pageSize: number;
  }): Promise<{
    data: ClimateType[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_CLIMATE_TYPES];

    if (params.search) {
      filteredData = filteredData.filter((d) =>
        d.type.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData as ClimateType[],
      currentPage: params.currentPage,
      totalItems,
    };
  }

  async getBuildingTypes(params: {
    search?: string;
    currentPage: number;
    pageSize: number;
  }): Promise<{
    data: BuildingType[];
    currentPage: number;
    totalItems: number;
  } | null> {
    await delay(1000);
    let filteredData = [...DUMMY_SYSTEM_BUILDINGS];

    if (params.search) {
      filteredData = filteredData.filter((d) =>
        d.type.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    const totalItems = filteredData.length;
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + params.pageSize
    );

    return {
      data: paginatedData as BuildingType[],
      currentPage: params.currentPage,
      totalItems,
    };
  }
}

export const apiService = new ApiService();