var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

var TrackingModel       = require('./models/tracking.model').TrackingModel;

describe("Schedule status update", function(){
         // Test will pass if we get all todos
        it("should return free time slot", function(done){
            
        });

        // Test will pass if we fail to get a todo
        it("should return error", function(done){
            var TodoMock = sinon.mock(Todo);
            var expectedResult = {status: false, error: "Something went wrong"};
            TodoMock.expects('find').yields(expectedResult, null);
            Todo.find(function (err, result) {
                TodoMock.verify();
                TodoMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });