const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { before } = require("mocha");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("post", function () {
    // Create an issue with every field: POST request to /api/issues/{project}
    test("Create issue", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "New Issue",
          issue_text: "New Issue Text.",
          created_by: "Joe",
          assigned_to: "Juan",
          status_text: "In QA",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "New Issue");
          assert.equal(res.body.issue_text, "New Issue Text.");
          assert.equal(res.body.created_by, "Joe");
          assert.equal(res.body.assigned_to, "Juan");
          assert.equal(res.body.status_text, "In QA");
          assert.equal(Date(res.body.created_on), new Date());
          done();
        });
    });
    // Create an issue with only required fields: POST request to /api/issues/{project}
    test("Create issue-only requiered", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Only Required",
          issue_text: "Only Required Text.",
          created_by: "Joe",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Only Required");
          assert.equal(res.body.issue_text, "Only Required Text.");
          assert.equal(res.body.created_by, "Joe");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(Date(res.body.created_on), new Date());
          done();
        });
    });
    // Create an issue with missing required fields: POST request to /api/issues/{project}
    test("Create issue-only requiered", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "Only Required",
          issue_text: "Only Required Text.",
        })
        .end(function (err, res) {
          assert.equal(res.status, 204);
          assert.equal(res.error, "required field(s) missing");
          done();
        });
    });
  });
  suite("get", function () {
    // View issues on a project: GET request to /api/issues/{project}
    // View issues on a project with one filter: GET request to /api/issues/{project}
    // View issues on a project with multiple filters: GET request to /api/issues/{project}
  });
  suite("put", function () {
    // Update one field on an issue: PUT request to /api/issues/{project}
    // Update multiple fields on an issue: PUT request to /api/issues/{project}
    // Update an issue with missing _id: PUT request to /api/issues/{project}
    // Update an issue with no fields to update: PUT request to /api/issues/{project}
    // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  });
  suite("delete", function () {
    // Delete an issue: DELETE request to /api/issues/{project}
    // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    // Delete an issue with missing _id: DELETE request to /api/issues/{project}
  });
});
