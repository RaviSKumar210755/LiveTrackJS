import { Site } from "../models/site.model.js";
import { Activity } from "../models/activity.model.js";
import { Subscription } from "../models/subscriptions.model.js";
import { User } from "../models/user.model.js";
import { redisClient } from "../db/redis.js";

export const getSitesForUser = async (req, res) => {
  try {
    const userId = req.userId;
    let sites = await Site.find({ userId });

    if (!sites.length) {
      return res.status(200).json({ success: true, sites: [] });
    }

    const sitesWithLiveUsers = await Promise.all(
      sites.map(async (site) => {
        const liveUsersCount = await redisClient.get(
          `live_users:${site.host}:${userId}`
        );

        return {
          ...site.toObject(),
          liveUsers: parseInt(liveUsersCount, 10) || 0,
        };
      })
    );

    res.status(200).json({ success: true, sites: sitesWithLiveUsers });
  } catch (error) {
    console.error("Error fetching sites for user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getActivitiesForSite = async (req, res) => {
  try {
    const { siteId } = req.params;
    const userId = req.userId;

    const site = await Site.findOne({ _id: siteId, userId });
    if (!site) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied or site not found" });
    }

    const activities = await Activity.find({ site: siteId });

    if (!activities.length) {
      return res.status(200).json({ success: true, activities: [] });
    }

    res.status(200).json({ success: true, activities });
  } catch (error) {
    console.error("Error fetching activities for site:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSubscriptionsPlans = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isSubscribed) {
      return res.status(200).json({
        subscription: null,
        message: "No Active Plan for the user!!",
        success: true,
      });
    }

    const subscription = await Subscription.findOne({ userId });
    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error("Error retrieving subscription plans:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
