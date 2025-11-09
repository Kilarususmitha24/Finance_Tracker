import Alert from "../models/Alert.js";

// ✅ Create alert
export const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create({
      ...req.body,
      user: req.user._id,
      read: false,
    });

    res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    console.error("Create Alert Error:", error);
    res.status(500).json({ message: "Failed to create alert" });
  }
};

// ✅ Get all alerts for user
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error("Get Alerts Error:", error);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

// ✅ Delete alert
export const deleteAlert = async (req, res) => {
  try {
    const deleted = await Alert.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({ success: true, message: "Alert deleted" });
  } catch (error) {
    console.error("Delete Alert Error:", error);
    res.status(500).json({ message: "Failed to delete alert" });
  }
};

// ✅ Mark alert as read
export const markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({ success: true, data: alert });
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ message: "Failed to mark alert as read" });
  }
};
