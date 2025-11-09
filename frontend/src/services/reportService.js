import API from "./axiosInstance";

export const fetchReports = async () => {
  try {
    const res = await API.get("/reports");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch reports";
  }
};

export const generateReport = async (title = "New Report", type = "monthly", options = {}) => {
  try {
    const res = await API.post("/reports/generate", { 
      title, 
      type,
      ...options 
    });
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error.response?.data?.message || error.message || "Failed to generate report";
  }
};

export const downloadReport = async (id) => {
  try {
    const res = await API.get(`/reports/download/${id}`);
    return res.data.fileUrl || res.data.data?.fileUrl;
  } catch (error) {
    console.error("Error downloading report:", error);
    throw error.response?.data?.message || error.message || "Failed to download report";
  }
};

// Fetch a single report by id
export const getReport = async (id) => {
  try {
    const res = await API.get(`/reports/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch report";
  }
};
