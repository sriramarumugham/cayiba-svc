"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubadminListRepo = exports.isAdmin = exports.getAdminByAdminId = exports.getAdminByEmailRepo = exports.createAdminRepo = void 0;
const admin_type_1 = require("../types/admin.type");
const admin_schema_1 = __importDefault(require("./models/admin.schema"));
const paginate_1 = require("../utils/paginate");
const createAdminRepo = async (adminData) => {
    return await admin_schema_1.default.create(adminData);
};
exports.createAdminRepo = createAdminRepo;
const getAdminByEmailRepo = async (email) => {
    const admin = await admin_schema_1.default.findOne({ email });
    return admin ? admin.toObject() : null;
};
exports.getAdminByEmailRepo = getAdminByEmailRepo;
const getAdminByAdminId = async (adminId) => {
    return await admin_schema_1.default.findOne({ adminId: adminId });
};
exports.getAdminByAdminId = getAdminByAdminId;
const isAdmin = async (adminId) => {
    const admin = await admin_schema_1.default.findOne({ adminId });
    return admin?.role === admin_type_1.E_ROLE.ADMIN;
};
exports.isAdmin = isAdmin;
const getSubadminListRepo = async (options) => {
    const { search, sortBy = "createdAt", sortOrder = "desc" } = options;
    const pipeline = [
        // Add any base filters
        { $match: { role: admin_type_1.E_ROLE.SUB_ADMIN } },
        ...(0, paginate_1.buildSearchPipeline)(["fullName", "email", "referralCode", "phoneNumber"], search),
        {
            $project: {
                adminId: 1,
                fullName: 1,
                email: 1,
                phoneNumber: 1,
                countryCode: 1,
                country: 1,
                role: 1,
                createdBy: 1,
                referralCode: 1,
                _id: 0,
            },
        },
        // Add sorting
        ...(0, paginate_1.buildSortPipeline)(sortBy, sortOrder),
    ];
    const paginationOptions = (0, paginate_1.createPaginationOptions)(options);
    const result = await admin_schema_1.default.aggregatePaginate(admin_schema_1.default.aggregate(pipeline), paginationOptions);
    return {
        docs: result.docs,
        totalDocs: result.totalDocs,
        limit: result.limit,
        totalPages: result.totalPages,
        page: result.page,
        pagingCounter: result.pagingCounter,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
    };
};
exports.getSubadminListRepo = getSubadminListRepo;
