var chai = require('chai');
var Strategy = require('../lib/strategy');


describe('verify function', function() {
  
  describe('that authenticates', function() {
    var strategy = new Strategy(function(token, cb) {
      expect(token).to.equal('mF_9.B5f-4.1JqM');
      return cb(null, { id: '248289761001' }, { scope: [ 'profile', 'email' ] });
    });
  
    it('should authenticate request with token in header field', function(done) {
      chai.passport.use(strategy)
        .request(function(req) {
          req.headers['authorization'] = 'Bearer mF_9.B5f-4.1JqM';
        })
        .success(function(user, info) {
          expect(user).to.deep.equal({ id: '248289761001' });
          expect(info).to.deep.equal({ scope: [ 'profile', 'email' ] });
          done();
        })
        .authenticate();
    }); // should authenticate request with token in header field
  
    it('should authenticate request with token in form-encoded body parameter', function(done) {
      chai.passport.use(strategy)
        .request(function(req) {
          req.body = {};
          req.body.access_token = 'mF_9.B5f-4.1JqM';
        })
        .success(function(user, info) {
          expect(user).to.deep.equal({ id: '248289761001' });
          expect(info).to.deep.equal({ scope: [ 'profile', 'email' ] });
          done();
        })
        .authenticate();
    }); // should authenticate request with token in form-encoded body parameter
    
    it('should authenticate request with token in URI query parameter', function(done) {
      chai.passport.use(strategy)
        .request(function(req) {
          req.query = {};
          req.query.access_token = 'mF_9.B5f-4.1JqM';
        })
        .success(function(user, info) {
          expect(user).to.deep.equal({ id: '248289761001' });
          expect(info).to.deep.equal({ scope: [ 'profile', 'email' ] });
          done();
        })
        .authenticate();
    }); // should authenticate request with token in URI query parameter
    
    it('should authenticate request with case-insensitive scheme', function(done) {
      chai.passport.use(strategy)
        .request(function(req) {
          req.headers['authorization'] = 'bearer mF_9.B5f-4.1JqM';
        })
        .success(function(user, info) {
          expect(user).to.deep.equal({ id: '248289761001' });
          expect(info).to.deep.equal({ scope: [ 'profile', 'email' ] });
          done();
        })
        .authenticate();
    }); // should authenticate request with case-insensitive scheme
  
    describe('that accepts request argument', function() {
      
      it('should authenticate request', function(done) {
        var strategy = new Strategy({ passReqToCallback: true }, function(req, token, cb) {
          expect(req.url).to.equal('/');
          expect(token).to.equal('mF_9.B5f-4.1JqM');
          return cb(null, { id: '248289761001' }, { scope: [ 'profile', 'email' ] });
        });
        
        chai.passport.use(strategy)
          .request(function(req) {
            req.headers['authorization'] = 'Bearer mF_9.B5f-4.1JqM';
          })
          .success(function(user, info) {
            expect(user).to.deep.equal({ id: '248289761001' });
            expect(info).to.deep.equal({ scope: [ 'profile', 'email' ] });
            done();
          })
          .authenticate();
      });
      
    }); // that accepts request argument
  
  }); // that authenticates
  
  describe('that does not authenticate', function() {
    
    it('should challenge request', function(done) {
      var strategy = new Strategy(function(token, cb) {
        return cb(null, false);
      });
      
      chai.passport.use(strategy)
        .request(function(req) {
          req.headers['authorization'] = 'Bearer mF_9.B5f-4.1JqM';
        })
        .fail(function(challenge, status) {
          expect(challenge).to.equal('Bearer realm="Users", error="invalid_token"');
          expect(status).to.be.undefined;
          done();
        })
        .authenticate();
    }); // should challenge request
    
    describe('with explanation', function() {
      
      it('should challenge request', function(done) {
        var strategy = new Strategy(function(token, cb) {
          return cb(null, false, { message: 'The access token expired' });
        });
        
        chai.passport.use(strategy)
          .fail(function(challenge, status) {
            expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="The access token expired"');
            expect(status).to.be.undefined;
            done();
          })
          .request(function(req) {
            req.headers['authorization'] = 'Bearer mF_9.B5f-4.1JqM';
          })
          .authenticate();
      });
      
    }); // with explanation
    
    describe('with explanation as string', function() {
      
      it('should challenge request', function(done) {
        var strategy = new Strategy(function(token, cb) {
          return cb(null, false, 'The access token expired');
        });
        
        chai.passport.use(strategy)
          .fail(function(challenge, status) {
            expect(challenge).to.equal('Bearer realm="Users", error="invalid_token", error_description="The access token expired"');
            expect(status).to.be.undefined;
            done();
          })
          .request(function(req) {
            req.headers['authorization'] = 'Bearer mF_9.B5f-4.1JqM';
          })
          .authenticate();
      });
      
    }); // with explanation as string
    
  }); // that does not authenticate
  
  describe('that errors', function() {
    
    it('should error request', function(done) {
      var strategy = new Strategy(function(token, cb) {
        return cb(new Error('something went wrong'));
      });
      
      chai.passport.use(strategy)
        .request(function(req) {
          req.headers['authorization'] = 'Bearer mF_9.B5f-4.1JqM';
        })
        .error(function(err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.equal('something went wrong');
          done();
        })
        .authenticate();
    }); // should error request
    
  }); // that errors
  
});