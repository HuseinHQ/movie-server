const { History } = require("../models/");

class HistoryController {
  static async getHistories(req, res, next) {
    try {
      const histories = await History.findAll({
        order: [["id", "DESC"]],
      });

      res.status(200).json(histories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = HistoryController;
