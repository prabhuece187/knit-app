/**
 * Prepends an item to the list if no existing item has the same id.
 * Useful for paginated option lists where the selected item may not be in the current page.
 *
 * @example
 * // District's state not in paginated states list
 * const states = ensureOptionInList(
 *   statesFromApi,
 *   district?.stateId && district?.state
 *     ? { id: district.stateId, name: district.state.name, stateCode: district.state.stateCode }
 *     : null
 * );
 *
 * @example
 * // City's district not in paginated districts list
 * const districts = ensureOptionInList(
 *   districtsFromApi,
 *   city?.districtId && city?.district
 *     ? { id: city.districtId, name: city.district.name }
 *     : null
 * );
 */
export function ensureOptionInList<T extends Record<string, unknown>>(
  list: T[],
  item: T | null | undefined,
  idKey: keyof T = "id" as keyof T
): T[] {
  if (!item || item[idKey] == null) return list;
  const itemId = item[idKey] as number;
  const exists = list.some((opt) => opt[idKey] === itemId);
  if (exists) return list;
  return [item, ...list];
}

export function toIdNameOptions<
  T extends {
    id?: number | null;
    name?: string | null;
  }
>(items: T[] | undefined | null): Array<{ id: number; name: string }> {
  if (!items) return [];
  return items
    .filter(
      (item): item is T & { id: number; name: string } =>
        item.id != null && item.name != null
    )
    .map((item) => ({ id: item.id, name: item.name }));
}
