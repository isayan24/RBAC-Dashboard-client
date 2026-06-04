import API from "@/lib/axios";

export async function getDashboardAnalytics() {
  const response = await API.get("/analytics");
  return response.data;
}
