"use strict";
const Issue = require("../db/index").IssueModel;

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      console.log(req.query);
      let project = req.params.project;
      Issue.find(
        {
          project,
          ...req.query,
        },
        (err, issues) => {
          console.log(issues.length);
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
    })

    .delete(function (req, res) {
      let project = req.params.project;
      Issue.deleteMany({ project }, (err, issues) => {
        if (err) {
          return res.send({ error: "db failed" });
        }
        res.send("deleted");
      });
    });
};
