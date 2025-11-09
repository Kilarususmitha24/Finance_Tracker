import { generateAnalytics } from "../services/analyticsService.js";

export const getAnalytics = async (req, res) => {
  try {
    const analytics = await generateAnalytics(req.user._id);

    return res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to fetch analytics" 
    });
  }
};
