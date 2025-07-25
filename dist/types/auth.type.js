"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginResponseDocument = exports.loginRequestDocument = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.loginRequestDocument = typebox_1.Type.Object({
    email: typebox_1.Type.String(),
    password: typebox_1.Type.String(),
});
exports.loginResponseDocument = typebox_1.Type.Object({
    token: typebox_1.Type.Optional(typebox_1.Type.String()),
    email: typebox_1.Type.Optional(typebox_1.Type.String()),
    fullName: typebox_1.Type.Optional(typebox_1.Type.String()),
    id: typebox_1.Type.Optional(typebox_1.Type.String()),
});
