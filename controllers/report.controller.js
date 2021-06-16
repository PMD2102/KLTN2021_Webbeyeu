const { REPORT_TYPE } = require("../config/keys");
const { isAuth } = require("../middleware/isAuth");
const Report = require("../models/Report");

const createReport = async (req, res) => {
  try {
    const { _id } = req.user;
    const { type, reportId } = req.body;
    let payload = { reporter: _id };
    switch (type) {
      case REPORT_TYPE.USER:
        payload = {
          ...payload,
          user: reportId,
          type: REPORT_TYPE.USER,
        };
        break;

      case REPORT_TYPE.POST:
        payload = {
          ...payload,
          post: reportId,
          type: REPORT_TYPE.POST,
        };
        break;

      case REPORT_TYPE.COMMENT:
        payload = {
          ...payload,
          comment: reportId,
          type: REPORT_TYPE.COMMENT,
        };
        break;

      default:
        break;
    }
    if (Object.keys(payload).length === 1)
      return res.status(400).send("Report không hợp lệ");

    const report = await Report.findOne(payload);
    if (report) return res.status(400).send("Bạn đã báo cáo");

    await new Report(payload).save();
    res.send("success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getReports = async (req, res) => {
  try {
    const { type } = req.body;
    let query;
    switch (type) {
      case REPORT_TYPE.USER:
        query = {
          type: REPORT_TYPE.USER,
        };
        break;

      case REPORT_TYPE.POST:
        query = {
          type: REPORT_TYPE.POST,
        };
        break;

      case REPORT_TYPE.COMMENT:
        query = {
          type: REPORT_TYPE.COMMENT,
        };
        break;

      default:
        break;
    }
    const reports = await Report.find(query)
      .populate("reporter", ["_id", "username", "avatar"])
      .populate("user", ["_id", "username", "avatar"])
      .populate("post")
      .populate("comment");
    res.json(reports);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);
    res.send("success");
  } catch (err) {
    console.log(error);
    res.status(500).json(err);
  }
};

module.exports = {
  createReport,
  getReports,
  deleteReport,
};
