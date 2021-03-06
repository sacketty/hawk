// Load modules

var Http = require('http');
var Url = require('url');
var Hoek = require('hoek');
var Lab = require('lab');
var Abriva = require('../lib');

// Declare internals

var internals = {};


// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;


describe('Abriva', function () {

    describe('Uri', function () {

        var credentialsFunc = function (id, callback) {

            var credentials = {
                adr: id,
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'sha256',
                user: 'steve'
            };

            return callback(null, credentials);
        };

        it('should generate a bewit then successfully authenticate it', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?a=1&b=2',
                host: 'example.com',
                port: 80
            };

            credentialsFunc('18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK', function (err, credentials) {

                var bewit = Abriva.uri.getBewit('http://example.com/resource/4?a=1&b=2', { credentials: credentials, ttlSec: 60 * 60 * 24 * 365 * 100, ext: 'some-app-data' });
                req.url += '&bewit=' + bewit;

                Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                    expect(err).to.not.exist;
                    expect(credentials.user).to.equal('steve');
                    expect(attributes.ext).to.equal('some-app-data');
                    done();
                });
            });
        });

        it('should generate a bewit then successfully authenticate it (no ext)', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?a=1&b=2',
                host: 'example.com',
                port: 80
            };

            credentialsFunc('18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK', function (err, credentials) {

                var bewit = Abriva.uri.getBewit('http://example.com/resource/4?a=1&b=2', { credentials: credentials, ttlSec: 60 * 60 * 24 * 365 * 100 });
                req.url += '&bewit=' + bewit;

                Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                    expect(err).to.not.exist;
                    expect(credentials.user).to.equal('steve');
                    done();
                });
            });
        });

        it('should successfully authenticate a request (last param)', function (done) {

            var req = {
                method: 'GET',
//                url: '/resource/4?a=1&b=2&bewit=MTIzNDU2XDQ1MTE0ODQ2MjFcMzFjMmNkbUJFd1NJRVZDOVkva1NFb2c3d3YrdEVNWjZ3RXNmOGNHU2FXQT1cc29tZS1hcHAtZGF0YQ',
                url: '/resource/4?a=1&b=2&bewit=MThaWHZzcFR1R1I4YWM0WEYzRUhHZWd5NmRmOTN2Y1Z6S1w0NTExNDg0NjIxXEg0WnQvMWx2UWl4SDQ0L0ZWWTNNRkg2Y0N6L3htZWFQWUVQNHBSWlQ5c3hGTmlEQTJyemIwRC9rZGRTdmNTb3NsUjV6Z0N2Y3psUXlCN3ZHVXQvai9Fdz1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.not.exist;
                expect(credentials.user).to.equal('steve');
                expect(attributes.ext).to.equal('some-app-data');
                done();
            });
        });

        it('should successfully authenticate a request (first param)', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MThaWHZzcFR1R1I4YWM0WEYzRUhHZWd5NmRmOTN2Y1Z6S1w0NTExNDg0NjIxXEg0WnQvMWx2UWl4SDQ0L0ZWWTNNRkg2Y0N6L3htZWFQWUVQNHBSWlQ5c3hGTmlEQTJyemIwRC9rZGRTdmNTb3NsUjV6Z0N2Y3psUXlCN3ZHVXQvai9Fdz1cc29tZS1hcHAtZGF0YQ&a=1&b=2',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.not.exist;
                expect(credentials.user).to.equal('steve');
                expect(attributes.ext).to.equal('some-app-data');
                done();
            });
        });

        it('should successfully authenticate a request (only param)', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MThaWHZzcFR1R1I4YWM0WEYzRUhHZWd5NmRmOTN2Y1Z6S1w0NTExNDg0NjIxXElDWCs0ZDY1bW5XVytoN3lFeHhQN1ByN0tCb2ZOSlUvZUpIcTRydXAxZ0loZWQrRlB3SjZDT1VFRno1R1JzczB3ck1iMGFXelY4cmJQaERrOFVmb3pVMD1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.not.exist;
                expect(credentials.user).to.equal('steve');
                expect(attributes.ext).to.equal('some-app-data');
                done();
            });
        });

        it('should fail on multiple authentication', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MTIzNDU2XDQ1MTE0ODQ2NDFcZm1CdkNWT3MvcElOTUUxSTIwbWhrejQ3UnBwTmo4Y1VrSHpQd3Q5OXJ1cz1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080,
                authorization: 'Basic asdasdasdasd'
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Multiple authentications');
                done();
            });
        });

        it('should fail on method other than GET', function (done) {

            credentialsFunc('18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK', function (err, credentials) {

                var req = {
                    method: 'POST',
                    url: '/resource/4?filter=a',
                    host: 'example.com',
                    port: 8080
                };

                var exp = Math.floor(Abriva.utils.now() / 1000) + 60;
                var ext = 'some-app-data';
                var mac = Abriva.crypto.calculateMac('bewit', credentials, {
                    timestamp: exp,
                    nonce: '',
                    method: req.method,
                    resource: req.url,
                    host: req.host,
                    port: req.port,
                    ext: ext
                });

                var bewit = credentials.id + '\\' + exp + '\\' + mac + '\\' + ext;

                req.url += '&bewit=' + Hoek.base64urlEncode(bewit);

                Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                    expect(err).to.exist;
                    expect(err.output.payload.message).to.equal('Invalid method');
                    done();
                });
            });
        });

        it('should fail on invalid host header', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MTIzNDU2XDQ1MDk5OTE3MTlcTUE2eWkwRWRwR0pEcWRwb0JkYVdvVDJrL0hDSzA1T0Y3MkhuZlVmVy96Zz1cc29tZS1hcHAtZGF0YQ',
                headers: {
                    host: 'example.com:something'
                }
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Invalid Host header');
                done();
            });
        });

        it('should fail on empty bewit', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Empty bewit');
                expect(err.isMissing).to.not.exist;
                done();
            });
        });

        it('should fail on invalid bewit', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=*',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Invalid bewit encoding');
                expect(err.isMissing).to.not.exist;
                done();
            });
        });

        it('should fail on missing bewit', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.not.exist;
                expect(err.isMissing).to.equal(true);
                done();
            });
        });

        it('should fail on invalid bewit structure', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=abc',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Invalid bewit structure');
                done();
            });
        });

        it('should fail on empty bewit attribute', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=YVxcY1xk',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Missing bewit attributes');
                done();
            });
        });

        it('should fail on missing bewit id attribute', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=XDQ1NTIxNDc2MjJcK0JFbFhQMXhuWjcvd1Nrbm1ldGhlZm5vUTNHVjZNSlFVRHk4NWpTZVJ4VT1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Missing bewit attributes');
                done();
            });
        });
        
        it('should fail on expired access', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?a=1&b=2&bewit=MTIzNDU2XDEzNTY0MTg1ODNcWk1wZlMwWU5KNHV0WHpOMmRucTRydEk3NXNXTjFjeWVITTcrL0tNZFdVQT1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, credentialsFunc, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Access expired');
                done();
            });
        });

        it('should fail on credentials function error', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MTIzNDU2XDQ1MDk5OTE3MTlcTUE2eWkwRWRwR0pEcWRwb0JkYVdvVDJrL0hDSzA1T0Y3MkhuZlVmVy96Zz1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, function (id, callback) { callback(Abriva.error.badRequest('Boom')); }, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Boom');
                done();
            });
        });

        it('should fail on credentials function error with credentials', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MTIzNDU2XDQ1MDk5OTE3MTlcTUE2eWkwRWRwR0pEcWRwb0JkYVdvVDJrL0hDSzA1T0Y3MkhuZlVmVy96Zz1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, function (id, callback) { callback(Abriva.error.badRequest('Boom'), { some: 'value' }); }, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Boom');
                expect(credentials.some).to.equal('value');
                done();
            });
        });

        it('should fail on null credentials function response', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MTIzNDU2XDQ1MDk5OTE3MTlcTUE2eWkwRWRwR0pEcWRwb0JkYVdvVDJrL0hDSzA1T0Y3MkhuZlVmVy96Zz1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, function (id, callback) { callback(null, null); }, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Unknown credentials');
                done();
            });
        });

        it('should fail on invalid credentials function response', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MTIzNDU2XDQ1MDk5OTE3MTlcTUE2eWkwRWRwR0pEcWRwb0JkYVdvVDJrL0hDSzA1T0Y3MkhuZlVmVy96Zz1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, function (id, callback) { callback(null, {}); }, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.message).to.equal('Invalid credentials');
                done();
            });
        });

        it('should fail on invalid credentials function response (unknown algorithm)', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MTIzNDU2XDQ1MDk5OTE3MTlcTUE2eWkwRWRwR0pEcWRwb0JkYVdvVDJrL0hDSzA1T0Y3MkhuZlVmVy96Zz1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, function (id, callback) { callback(null, { key: 'xxx', algorithm: 'xxx' }); }, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.message).to.equal('Unknown algorithm');
                done();
            });
        });

        it('should fail on expired access', function (done) {

            var req = {
                method: 'GET',
                url: '/resource/4?bewit=MTIzNDU2XDQ1MDk5OTE3MTlcTUE2eWkwRWRwR0pEcWRwb0JkYVdvVDJrL0hDSzA1T0Y3MkhuZlVmVy96Zz1cc29tZS1hcHAtZGF0YQ',
                host: 'example.com',
                port: 8080
            };

            Abriva.uri.authenticate(req, function (id, callback) { callback(null, { key: 'xxx', algorithm: 'sha256' }); }, {}, function (err, credentials, attributes) {

                expect(err).to.exist;
                expect(err.output.payload.message).to.equal('Bad mac');
                done();
            });
        });
    });

    describe('#getBewit', function () {

        it('returns a valid bewit value', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            var bewit = Abriva.uri.getBewit('https://example.com/somewhere/over/the/rainbow', { credentials: credentials, ttlSec: 300, localtimeOffsetMsec: 1356420407232 - Abriva.utils.now(), ext: 'xandyandz' });
            expect(bewit).to.equal('MThaWHZzcFR1R1I4YWM0WEYzRUhHZWd5NmRmOTN2Y1Z6S1wxMzU2NDIwNzA3XEgxdmRtamY2NnVCSDJKWGJEczBxVjB0ckFwR3hYaGppR2UwV05yYkdBaGNNU1YvZUV0WWR4akg4bTUxakQvK0NlcmViS2R3aDRrc0xwNDBua0hhR3ZSRT1ceGFuZHlhbmR6');
            done();
        });

        it('returns a valid bewit value (explicit port)', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            var bewit = Abriva.uri.getBewit('https://example.com:8080/somewhere/over/the/rainbow', { credentials: credentials, ttlSec: 300, localtimeOffsetMsec: 1356420407232 - Abriva.utils.now(), ext: 'xandyandz' });
            expect(bewit).to.equal('MThaWHZzcFR1R1I4YWM0WEYzRUhHZWd5NmRmOTN2Y1Z6S1wxMzU2NDIwNzA3XElMTGVCN29RV21RdEpHQ1Y1MEoxYjNPU1ZNVGdIdy9mV0Q1eWlYak9ydWl2SVhCZHNINk9PSTZubG01TnhDSnpYdnh5c1R6SDhMdVNuVGwzdUx3SnVzYz1ceGFuZHlhbmR6');
            done();
        });

        it('returns a valid bewit value (null ext)', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            var bewit = Abriva.uri.getBewit('https://example.com/somewhere/over/the/rainbow', { credentials: credentials, ttlSec: 300, localtimeOffsetMsec: 1356420407232 - Abriva.utils.now(), ext: null });
            expect(bewit).to.equal('MThaWHZzcFR1R1I4YWM0WEYzRUhHZWd5NmRmOTN2Y1Z6S1wxMzU2NDIwNzA3XEh5bitZQnRoYkZuOEN1MTVBTGhmT096bnVIbTAvT0h2bDVEN2RBY0Zzd3ZMQzRsQ1VFUXhGZFo0b1dWUVFSS2J0cmdLQ2pVbmxGT0VBdVdPT0p6cmxUcz1c');
            done();
        });

        it('returns a valid bewit value (parsed uri)', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            var bewit = Abriva.uri.getBewit(Url.parse('https://example.com/somewhere/over/the/rainbow'), { credentials: credentials, ttlSec: 300, localtimeOffsetMsec: 1356420407232 - Abriva.utils.now(), ext: 'xandyandz' });
            expect(bewit).to.equal('MThaWHZzcFR1R1I4YWM0WEYzRUhHZWd5NmRmOTN2Y1Z6S1wxMzU2NDIwNzA3XEgxdmRtamY2NnVCSDJKWGJEczBxVjB0ckFwR3hYaGppR2UwV05yYkdBaGNNU1YvZUV0WWR4akg4bTUxakQvK0NlcmViS2R3aDRrc0xwNDBua0hhR3ZSRT1ceGFuZHlhbmR6');
            done();
        });

        it('errors on invalid options', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            var bewit = Abriva.uri.getBewit('https://example.com/somewhere/over/the/rainbow', 4);
            expect(bewit).to.equal('');
            done();
        });

        it('errors on missing uri', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            var bewit = Abriva.uri.getBewit('', { credentials: credentials, ttlSec: 300, localtimeOffsetMsec: 1356420407232 - Abriva.utils.now(), ext: 'xandyandz' });
            expect(bewit).to.equal('');
            done();
        });

        it('errors on invalid uri', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            var bewit = Abriva.uri.getBewit(5, { credentials: credentials, ttlSec: 300, localtimeOffsetMsec: 1356420407232 - Abriva.utils.now(), ext: 'xandyandz' });
            expect(bewit).to.equal('');
            done();
        });

        it('errors on invalid credentials (id)', function (done) {

            var credentials = {
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            var bewit = Abriva.uri.getBewit('https://example.com/somewhere/over/the/rainbow', { credentials: credentials, ttlSec: 3000, ext: 'xandyandz' });
            expect(bewit).to.equal('');
            done();
        });

        it('errors on missing credentials', function (done) {

            var bewit = Abriva.uri.getBewit('https://example.com/somewhere/over/the/rainbow', { ttlSec: 3000, ext: 'xandyandz' });
            expect(bewit).to.equal('');
            done();
        });

        it('errors on invalid credentials (key)', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                algorithm: 'sha256'
            };

            var bewit = Abriva.uri.getBewit('https://example.com/somewhere/over/the/rainbow', { credentials: credentials, ttlSec: 3000, ext: 'xandyandz' });
            expect(bewit).to.equal('');
            done();
        });

        it('errors on invalid algorithm', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                key: '2983d45yun89q',
                algorithm: 'hmac-sha-0'
            };

            var bewit = Abriva.uri.getBewit('https://example.com/somewhere/over/the/rainbow', { credentials: credentials, ttlSec: 300, ext: 'xandyandz' });
            expect(bewit).to.equal('');
            done();
        });

        it('errors on missing options', function (done) {

            var credentials = {
                adr: '18ZXvspTuGR8ac4XF3EHGegy6df93vcVzK',
                key: '2983d45yun89q',
                algorithm: 'hmac-sha-0'
            };

            var bewit = Abriva.uri.getBewit('https://example.com/somewhere/over/the/rainbow');
            expect(bewit).to.equal('');
            done();
        });
    });
});

