const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { connection, connect } = require('mongoose');
const app = require('../api/app');

chai.should();
chai.use(chaiHttp);

const MONGO_DB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'Cookmaster'; 

describe('Create a new session', () => {
  before(done => {
    connect(`${MONGO_DB_URL}/${DB_NAME}`)
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
     });
  });

  after(done => {
    connection.close()
      .then(() => done())
      .catch(err => done(err));
  });

  it('Should be able to create a new session', (done) => {
    chai.request(app)
      .post('/users')
      .send({
        name: 'User',
        email: 'User@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(201);
        expect(response.body.user).to.have.property('_id');

        chai.request(app)
          .post('/login')
          .send({
            email: 'User@email.com.br',
            password: '123456',
          })
          .then((response) => {
            expect(response).to.have.status(200);
            expect(response.body).to.have.property('token');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err)); 
  });

  it('should not be able to create a new session with no valid email', (done) => {
    chai.request(app)
    .post('/users')
    .send({
      name: 'User',
      email: 'User@email.com.br',
      password: '123456',
    })
    .then((response) => {
      expect(response).to.have.status(201);
      expect(response.body.user).to.have.property('_id');

      chai.request(app)
        .post('/login')
        .send({
          email: 'User@email.com.br',
          password: '123456',
        })
        .then((response) => {
          expect(response).to.have.status(401);
          expect(response.body.message).to.have.equal('Incorrect username or password');
          done();
        })
        .catch((err) => done(err));
    })
    .catch((err) => done(err)); 
  });

  it('should not be able to create a new session with no valid password', (done) => {
    chai.request(app)
    .post('/users')
    .send({
      name: 'User',
      email: 'User@email.com.br',
      password: '123456',
    })
    .then((response) => {
      expect(response).to.have.status(201);
      expect(response.body.user).to.have.property('_id');

      chai.request(app)
        .post('/login')
        .send({
          email: 'User@email.com.br',
          password: '123456',
        })
        .then((response) => {
          expect(response).to.have.status(401);
          expect(response.body.message).to.have.equal('Incorrect username or password');
          done();
        })
        .catch((err) => done(err));
    })
    .catch((err) => done(err)); 
  });
});