import { Static, Type } from "@sinclair/typebox";

export const loginRequestDocument = Type.Object({
  email: Type.String(),
  password: Type.String(),
});

export type loginRequestType = Static<typeof loginRequestDocument>;

export const loginResponseDocument = Type.Object({
  token: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  fullName: Type.Optional(Type.String()),
  id: Type.Optional(Type.String()),
});
export type LoginResponseType = Static<typeof loginResponseDocument>;
