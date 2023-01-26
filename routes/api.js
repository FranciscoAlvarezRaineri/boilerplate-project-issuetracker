"use strict";
const Issue = require("../db/index").IssueModel;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      let project = req.params.project;
      let newIssue = new Issue(req.body);
      newIssue.save(function (err, issue) {
        console.log(issue);
        if (err) {
          return res.send({ error: "required field(s) missing" });
        }
        res.send(issue);
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
