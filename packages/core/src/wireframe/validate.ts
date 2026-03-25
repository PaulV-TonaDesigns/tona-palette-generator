import { WireframeResponseSchema } from "./schema";
import type { WireframeResponse } from "./schema";

export function validateWireframeResponse(data: unknown): WireframeResponse {
  return WireframeResponseSchema.parse(data);
}
