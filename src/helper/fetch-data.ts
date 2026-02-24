import type { Item, ItemQuery } from "@/schema-types/master-schema";
import type { PaginationMeta } from "@/schema-types/pagination-schema";
import { buildQueryString } from "./buildQueryString";

const baseUrl = import.meta.env.VITE_API_URL as string;

export async function fetchItems(
  params: ItemQuery,
): Promise<{ data: Item[]; meta: PaginationMeta }> {
  const queryString = buildQueryString(params);
  const response = await fetch(`${baseUrl}/items?${queryString}`);
  const json = await response.json();
  return { data: json.data as Item[], meta: json.meta as PaginationMeta };
}
