import Report from "../models/Report.js";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import Budget from "../models/Budget.js";

/** ✅ GET ALL REPORTS */
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({ message: error.message || "Failed to fetch reports" });
  }
};

/** ✅ GENERATE A NEW REPORT (Auto-generate PDF URL) */
export const generateReport = async (req, res) => {
  try {
    const { title, type } = req.body;

    // Example summary (you can expand this)
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = await Income.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalBudgets = await Budget.aggregate([
      { $group: { _id: null, total: { $sum: "$budget" } } },
    ]);

    // Auto-generate a dummy file URL
    const fileUrl = `https://dummyreport.com/${Date.now()}.pdf`;

    const report = await Report.create({
      title,
      type,
      fileUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "✅ Report generated successfully",
      data: {
        ...report._doc,
        summary: {
          totalExpenses: totalExpenses[0]?.total || 0,
          totalIncome: totalIncome[0]?.total || 0,
          totalBudgets: totalBudgets[0]?.total || 0,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error generating report:", error);
    res.status(500).json({ message: error.message || "Failed to generate report" });
  }
};

/** ✅ GET SINGLE REPORT BY ID */
export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("❌ Error fetching report:", error);
    res.status(500).json({ message: error.message || "Failed to fetch report" });
  }
};

/** ✅ DOWNLOAD REPORT */
export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      fileUrl: report.fileUrl,
      data: { fileUrl: report.fileUrl },
    });
  } catch (error) {
    console.error("❌ Error downloading report:", error);
    res.status(500).json({ message: error.message || "Failed to download report" });
  }
};

/** ✅ DELETE REPORT */
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ 
        success: false,
        message: "Report not found" 
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "✅ Report deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting report:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to delete report" 
    });
  }
};
