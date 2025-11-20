import { mockData } from "../../../mock/data.js";

export async function GET() {
  return Response.json(mockData);
}

