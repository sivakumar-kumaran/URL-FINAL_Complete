import mongoose from 'mongoose';
import Url from '../models/Url.js';
import Visit from '../models/Visit.js';

// @desc    Get analytics for a specific URL
// @route   GET /api/analytics/:id
// @access  Private
export const getUrlAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check if the URL exists and belongs to the user
    const url = await Url.findOne({ _id: id, userId });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Get total clicks
    const totalClicks = url.clickCount;

    // Get last visited timestamp
    const lastVisitRecord = await Visit.findOne({ urlId: id }).sort({ timestamp: -1 });
    const lastVisited = lastVisitRecord ? lastVisitRecord.timestamp : null;

    // Get recent visits (latest 20 visits)
    const recentVisits = await Visit.find({ urlId: id })
      .sort({ timestamp: -1 })
      .limit(20);

    // Get Daily Click Trends (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const dailyTrends = await Visit.aggregate([
      {
        $match: {
          urlId: new mongoose.Types.ObjectId(id),
          timestamp: { $gte: fourteenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format daily trends to include days with 0 clicks
    const dailyData = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = dailyTrends.find((t) => t._id === dateStr);
      dailyData.push({
        date: dateStr,
        clicks: match ? match.clicks : 0,
      });
    }

    // Get Weekly Click Trends (last 8 weeks)
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const weeklyTrends = await Visit.aggregate([
      {
        $match: {
          urlId: new mongoose.Types.ObjectId(id),
          timestamp: { $gte: eightWeeksAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $week: '$timestamp' }, // Aggregate by week number
            yearVal: { $year: '$timestamp' }
          },
          clicks: { $sum: 1 },
          date: { $min: '$timestamp' }
        },
      },
      { $sort: { '_id.yearVal': 1, '_id.year': 1 } },
    ]);

    const weeklyData = weeklyTrends.map(item => {
      const dateStr = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        week: `Week of ${dateStr}`,
        clicks: item.clicks
      };
    });

    // Browser metrics
    const browserMetrics = await Visit.aggregate([
      { $match: { urlId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // OS metrics
    const osMetrics = await Visit.aggregate([
      { $match: { urlId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$os',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Device metrics
    const deviceMetrics = await Visit.aggregate([
      { $match: { urlId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$device',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      url: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        customAlias: url.customAlias,
        isActive: url.isActive,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
      },
      totalClicks,
      lastVisited,
      recentVisits,
      dailyTrends: dailyData,
      weeklyTrends: weeklyData,
      browserMetrics: browserMetrics.map((b) => ({ name: b._id, value: b.count })),
      osMetrics: osMetrics.map((o) => ({ name: o._id, value: o.count })),
      deviceMetrics: deviceMetrics.map((d) => ({ name: d._id, value: d.count })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard aggregated metrics for the current user
// @route   GET /api/analytics/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all URLs of the user
    const urls = await Url.find({ userId });
    const urlIds = urls.map(u => u._id);

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, u) => sum + u.clickCount, 0);

    // Get last visited URL click
    const lastVisitRecord = await Visit.findOne({ urlId: { $in: urlIds } }).sort({ timestamp: -1 });
    const lastVisited = lastVisitRecord ? lastVisitRecord.timestamp : null;

    // Get total active urls
    const activeUrls = urls.filter(u => u.isActive && (!u.expiresAt || new Date() < u.expiresAt)).length;

    // Get total clicks trend over the last 14 days for all URLs of this user
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const dailyTrends = await Visit.aggregate([
      {
        $match: {
          urlId: { $in: urlIds },
          timestamp: { $gte: fourteenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyData = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = dailyTrends.find((t) => t._id === dateStr);
      dailyData.push({
        date: dateStr,
        clicks: match ? match.clicks : 0,
      });
    }

    res.json({
      totalUrls,
      totalClicks,
      activeUrls,
      lastVisited,
      dailyTrends: dailyData,
    });
  } catch (error) {
    next(error);
  }
};
