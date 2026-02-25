import { DUMMY_BUILDINGS } from "@/constants/dummy-buildings";
import { DUMMY_ENERGY_CARRIERS } from "@/constants/dummy-energy-carriers";
import { DUMMY_ORGANIZATIONS } from "@/constants/dummy-organizations";
import { delay } from "@/lib/helpers";
import { User } from "@/models/auth";
import { Building } from "@/models/building";
import { OperationalDataEntrySearchSchema } from "@/screens/add-building/operational-data-entry/schema";
import { OperationalDataEntry } from "@/screens/add-building/schema";

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

  async fetchOrganizations(query: string) {
    await delay(1000);
    if (!query) return DUMMY_ORGANIZATIONS;
    const organizations = DUMMY_ORGANIZATIONS.filter((org) =>
      org.name.toLowerCase().includes(query.toLowerCase()),
    );
    return organizations;
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
}

export const apiService = new ApiService();