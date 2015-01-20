
/*global describe, it, after, afterEach, before */

var server  = require('./server'),
  mongoose  = require('mongoose'),
  expect    = require('chai').expect;

describe('user#model', function () {
  var User;

  before(function () {
    require('./../config/mongoose')();

    User = mongoose.model('User');
  });

  after(function (done) {
    mongoose.disconnect(done);
  });

  // flush database
  afterEach(function (done) {
    User.remove({}, done);
  });

  it('should create an user', function (done) {
    var user = new User({
      username: 'test',
      email: 'test@test.test',
      password: 'test'
    });

    user.save(function (err, user) {
      if (err) {
        throw err;
      }

      expect(user).to.exist();

      done();
    });
  });

  it('should not duplicate email', function (done) {
    var data = {
      username: 'test',
      email: 'test1@test.test',
      password: 'test'
    };

    var u1 = new User(data);

    data.email = 'test2@test.test';

    var u2 = new User(JSON.parse(JSON.stringify(data)));

    u1.save(function (err, u1) {
      if (err) {
        throw err;
      }

      u2.save(function (err, u2) {
        expect(err).to.exist();
        expect(u2).to.not.exist();

        done();
      });
    });
  });

  it('should not duplicate username', function (done) {
    var data = {
      username: 'test1',
      email: 'test@test.test',
      password: 'test'
    };

    var u1 = new User(data);

    data.username = 'test2';

    var u2 = new User(JSON.parse(JSON.stringify(data)));

    u1.save(function (err, u1) {
      if (err) {
        throw err;
      }

      u2.save(function (err, u2) {
        expect(err).to.exist();
        expect(u2).to.not.exist();

        done();
      });
    });
  });

  describe('authenticate()', function () {
    var user;

    beforeEach(function (done) {
      user = new User({
        username: 'test',
        email: 'test@test.test',
        password: 'test'
      });

      user.save(done);
    });

    afterEach(function (done) {
      User.remove({}, done);
    });

    it('should return true if password match', function () {
      var res = user.authenticate('test');

      expect(res).to.be.equal(true);
    });

    it('should return false if password mismatch', function () {
      var res = user.authenticate('false');

      expect(res).to.be.equal(false);
    });
  });
});