"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardGraphUseCase = exports.getDashboardStatsUseCase = void 0;
const admin_repo_1 = require("../../data-access/admin.repo");
const advertisment_schema_1 = __importDefault(require("../../data-access/models/advertisment.schema"));
const types_1 = require("../../types");
const getDashboardStatsUseCase = async (adminId) => {
    const isAdminUser = await (0, admin_repo_1.isAdmin)(adminId);
    if (!isAdminUser) {
        throw new Error("Only admins can access dashboard statistics");
    }
    // Get counts by status
    const [activeCount, deletedCount, blockedCount] = await Promise.all([
        advertisment_schema_1.default.countDocuments({ status: types_1.E_STATUS.ACTIVE }),
        advertisment_schema_1.default.countDocuments({ status: types_1.E_STATUS.DELETED }),
        advertisment_schema_1.default.countDocuments({ status: types_1.E_STATUS.BLOCKED }),
    ]);
    // Get counts by inventory status
    const [availableCount, soldCount, unlistedCount] = await Promise.all([
        advertisment_schema_1.default.countDocuments({
            inventoryDetails: types_1.E_INVENTORY_STATUS.AVAILABLE,
        }),
        advertisment_schema_1.default.countDocuments({
            inventoryDetails: types_1.E_INVENTORY_STATUS.SOLD,
        }),
        advertisment_schema_1.default.countDocuments({
            inventoryDetails: types_1.E_INVENTORY_STATUS.UNLIST,
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
exports.getDashboardStatsUseCase = getDashboardStatsUseCase;
// Get dashboard graph data
const getDashboardGraphUseCase = async (adminId, period = "30d") => {
    const isAdminUser = await (0, admin_repo_1.isAdmin)(adminId);
    if (!isAdminUser) {
        throw new Error("Only admins can access dashboard graph data");
    }
    // Calculate date range based on period
    const now = new Date();
    let startDate;
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
    console.log(`Graph API - Period: ${period}, Start Date: ${startDate.toISOString()}, End Date: ${now.toISOString()}`);
    // Aggregate pipeline to get daily counts
    const pipeline = [
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
        const result = await advertisment_schema_1.default.aggregate(pipeline);
        console.log("Graph API - Raw result:", JSON.stringify(result, null, 2));
        // Fill in missing dates with zero counts
        const data = [];
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
    }
    catch (error) {
        console.error("Graph API - Error in aggregation:", error);
        throw new Error(`Failed to fetch graph data: ${error.message}`);
    }
};
exports.getDashboardGraphUseCase = getDashboardGraphUseCase;
