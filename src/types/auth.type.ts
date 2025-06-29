import { Static, Type } from "@sinclair/typebox";

export const loginRequestDocument = Type.Object({
  email: Type.String(),
  password: Type.String(),
});

export type loginRequestType = Static<typeof loginRequestDocument>;

export const loginResponseDocument = Type.Object({
  token: Type.String(),
  email: Type.String(),
  fullName: Type.String(),
  id: Type.String(),
});
export type LoginResponseType = Static<typeof loginResponseDocument>;
