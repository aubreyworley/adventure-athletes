var request = require('request')
    expect = require('chai').expect,
    baseUrl = 'http://localhost:3000';

describe('GET /', function() {
  it('should return statusCode 200', function(done) {
    request(baseUrl, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});

describe('GET /api/posts', function() {
  it('should return statusCode 200', function(done) {
    request(baseUrl + '/api/posts', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});

describe('POST /api/posts', function() {
  it('should return statusCode 200', function(done) {
    request.post(
      {
        url: baseUrl + '/api/posts',
        form: {
          adventure: 'AJAX'
        }
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });
});

describe('PUT /api/posts/:id', function() {
  it('should return statusCode 200', function(done) {
    request.put(
      {
        url: baseUrl + '/api/posts/1',
        form: {
          adventure: 'AJAX'
        }
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });
});

describe('DELETE /api/posts/:id', function() {
  it('should return statusCode 200', function(done) {
    request.del(baseUrl + '/api/phrases/1', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});