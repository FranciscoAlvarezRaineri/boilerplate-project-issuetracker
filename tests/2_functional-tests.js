const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { before, after } = require("mocha");

chai.use(chaiHttp);

const project = `apitest${Math.random().toFixed(5) * 10000}-`;

suite("Functional Tests", function () {
  let _id;
  suite("post", function () {
    // Create an issue with every field: POST request to /api/issues/{project}
    test("Create issue", function (done) {
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send({
          issue_title: "New Issue",
          issue_text: "New Issue Text.",
          created_by: "Joe",
          assigned_to: "Juan",
          status_text: "In QA",
        })
        .end(function (err, res) {
          _id = res.body._id;
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
        .post(`/api/issues/${project}`)
        .send({
          issue_title: "Only Required",
          issue_text: "Only Required Text.",
          created_by: "Juan",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Only Required");
          assert.equal(res.body.issue_text, "Only Required Text.");
          assert.equal(res.body.created_by, "Juan");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(Date(res.body.created_on), new Date());
          done();
        });
    });
    // Create an issue with missing required fields: POST request to /api/issues/{project}
    test("Create issue-missing fields", function (done) {
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send({
          issue_title: "Only Required",
          issue_text: "Only Required Text.",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });
  suite("get", function () {
    // View issues on a project: GET request to /api/issues/{project}
    test("All issues on a project", function (done) {
      chai
        .request(server)
        .get(`/api/issues/${project}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 2);
          done();
        });
    });
    // View issues on a project with one filter: GET request to /api/issues/{project}
    test("Issues with one filter", function (done) {
      chai
        .request(server)
        .get(`/api/issues/${project}?created_by=Joe`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].issue_title, "New Issue");
          done();
        });
    });
    // View issues on a project with multiple filters: GET request to /api/issues/{project}
    test("Issues with more filters", function (done) {
      chai
        .request(server)
        .get(`/api/issues/${project}?created_by=Joe&assigned_to=Juan`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].issue_title, "New Issue");
          done();
        });
    });
  });
  suite("put", function () {
    // Update one field on an issue: PUT request to /api/issues/{project}
    test("Update one field", function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({
          _id,
          issue_title: `Only Modified ${Math.random().toFixed(5) * 10000}-`,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, _id);
          done();
        });
    });
    // Update multiple fields on an issue: PUT request to /api/issues/{project}
    test("Update many fields", function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({
          _id,
          issue_text: `Only Modified ${Math.random().toFixed(5) * 10000}-`,
          created_by: `Joenes ${Math.random().toFixed(5) * 10000}-`,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, _id);
          done();
        });
    });
    // Update an issue with missing _id: PUT request to /api/issues/{project}
    test("Update missing id", function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({
          issue_title: `Only Modified ${Math.random().toFixed(5) * 10000}-`,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    // Update an issue with no fields to update: PUT request to /api/issues/{project}
    test("Update no fields", function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({
          _id,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, _id);
          done();
        });
    });

    // Update an issue with an invalid _id: PUT request to /api/issues/{project}
    test("Update invalid id", function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({
          _id: "1",
          issue_title: `Only Modified ${Math.random().toFixed(5) * 10000}-`,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });
  suite("delete", function () {
    // Delete an issue: DELETE request to /api/issues/{project}
    test("Delete one", function (done) {
      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send({
          _id,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, _id);
          done();
        });
    });
    // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    test("Delete one wrong id", function (done) {
      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send({
          _id: "1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "1");
          done();
        });
    });

    // Delete an issue with missing _id: DELETE request to /api/issues/{project}
    test("Delete one already deleted", function (done) {
      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send({
          _id,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, _id);
          done();
        });
    });
  });
});
