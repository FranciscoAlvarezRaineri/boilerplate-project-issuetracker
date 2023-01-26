"use strict";
const Issue = require("../db/index").IssueModel;

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      let project = req.params.project;
      Issue.find(
        {
          project,
          ...req.query,
        },
        (err, issues) => {
          if (err) {
            return res.send({ error: "db failed" });
          }
          res.send(issues);
        }
      );
    })

    .post(function (req, res) {
      let project = req.params.project;
      let newIssue = new Issue({ ...req.body, project });
      newIssue.save(function (err, issue) {
        if (err) {
          return res.send({ error: "required field(s) missing" });
        }
        res.send(issue);
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      let _id = req.body._id;
      if (!_id) return res.send({ error: "missing _id" });
      if (Object.keys(req.body).length < 2)
        return res.send({ error: "no update field(s) sent", _id });
      Issue.findOneAndUpdate(
        { _id, project },
        { ...req.body, updated_on: new Date() },
        { new: true, runValidators: true },
        (err, issue) => {
          if (!issue) {
            res.send({ error: "could not update", _id });
            return;
          }

          res.send({ result: "successfully updated", _id });
        }
      );
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let _id = req.body._id;
      if (!_id) return res.send({ error: "missing _id" });
      Issue.findOneAndDelete({ _id, project }, (err, issue) => {
        if (!issue) {
          res.send({ error: "could not delete", _id });
          return;
        }
        res.send({ result: "successfully deleted", _id: _id });
      });
    });
};
