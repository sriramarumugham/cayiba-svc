import { isAdmin } from "@/data-access/admin.repo";
import AdvertismentModel from "@/data-access/models/advertisment.schema";
import { E_INVENTORY_STATUS, E_STATUS } from "@/types";
import { PipelineStage } from "mongoose";

export interface DashboardStats {
  totalAdvertisements: number;
  activeAdvertisements: number;
  deletedAdvertisements: number;
  blockedAdvertisements: number;
  availableInventory: number;
  soldInventory: number;
  unlistedInventory: number;
}

export interface GraphDataPoint {
  date: string;
  count: number;
}

export const getDashboardStatsUseCase = async (
  adminId: string
): Promise<DashboardStats> => {
  const isAdminUser = await isAdmin(adminId);

  if (!isAdminUser) {
    throw new Error("Only admins can access dashboard statistics");
  }

  // Get counts by status
  const [activeCount, deletedCount, blockedCount] = await Promise.all([
    AdvertismentModel.countDocuments({ status: E_STATUS.ACTIVE }),
    AdvertismentModel.countDocuments({ status: E_STATUS.DELETED }),
    AdvertismentModel.countDocuments({ status: E_STATUS.BLOCKED }),
  ]);

  // Get counts by inventory status
  const [availableCount, soldCount, unlistedCount] = await Promise.all([
    AdvertismentModel.countDocuments({
      inventoryDetails: E_INVENTORY_STATUS.AVAILABLE,
    }),
    AdvertismentModel.countDocuments({
      inventoryDetails: E_INVENTORY_STATUS.SOLD,
    }),
    AdvertismentModel.countDocuments({
      inventoryDetails: E_INVENTORY_STATUS.UNLIST,
    }),
  ]);

  const totalAdvertisements = activeCount + deletedCount + blockedCount;

  return {
    totalAdvertisements,
    activeAdvertisements: activeCount,
    deletedAdvertisements: deletedCount,
    blockedAdvertisements: blockedCount,
    availableInventory: availableCount,
    soldInventory: soldCount,
    unlistedInventory: unlistedCount,
  };
};

// Get dashboard graph data
export const getDashboardGraphUseCase = async (
  adminId: string,
  period: string = "30d"
): Promise<{ data: GraphDataPoint[] }> => {
  const isAdminUser = await isAdmin(adminId);

  if (!isAdminUser) {
    throw new Error("Only admins can access dashboard graph data");
  }

  // Calculate date range based on period
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  console.log(
    `Graph API - Period: ${period}, Start Date: ${startDate.toISOString()}, End Date: ${now.toISOString()}`
  );

  // Aggregate pipeline to get daily counts
  const pipeline: PipelineStage[] = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        date: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ];

  console.log("Graph API - Pipeline:", JSON.stringify(pipeline, null, 2));

  try {
    const result = await AdvertismentModel.aggregate(pipeline);
    console.log("Graph API - Raw result:", JSON.stringify(result, null, 2));

    // Fill in missing dates with zero counts
    const data: GraphDataPoint[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= now) {
      const dateString = currentDate.toISOString().split("T")[0];
      const existingData = result.find((item) => item.date === dateString);

      data.push({
        date: dateString,
        count: existingData ? existingData.count : 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`Graph API - Final data points: ${data.length}`);
    return { data };
  } catch (error: any) {
    console.error("Graph API - Error in aggregation:", error);
    throw new Error(`Failed to fetch graph data: ${error.message}`);
  }
};
