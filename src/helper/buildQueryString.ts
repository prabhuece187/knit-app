// -----------------------
// Helper function to call API manually
// -----------------------
export function buildQueryString<T extends Record<string, unknown>>(params: T) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });
  return query.toString();
}
