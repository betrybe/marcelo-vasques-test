const { connection, connect } = require('mongoose');
const { expect } = require('chai');
const { resolve } = require('path');
const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../api/app');

chai.should();
chai.use(chaiHttp);

const MONGO_DB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'Cookmaster';

describe('Create a new recipe', () => {
  before(done => {
    connect(`${MONGO_DB_URL}/${DB_NAME}`)
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
     });

     await connection.collection('users').insertOne({
        name: 'User',
        email: 'user@email.com.br',
        password: '123456',
     });
  });

  after(done => {
    connection.close()
      .then(() => done())
      .catch(err => done(err));
  });

  it('Should be able to create a new recipe', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .post('/recipes')
          .set('Authorization', response.body.token)
          .send({
            name: 'Cake',
            ingredients: '2 eggs, 1 cup white sugar, 1 cup milk',
            preparation: '1 hour',
          })
          .then((response) => {
            expect(response).to.have.status(201);
            expect(response.body.recipe).to.have.property('_id');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('Should not be able to create a new recipe if not authenticated', (done) => {
    chai.request(app)
      .post('/recipes')
      .send({
        ingredients: '2 eggs, 1 cup white sugar, 1 cup milk',
        preparation: '1 hour',
      })
      .then((response) => {
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('missing auth token');
        done();
      })
      .catch((err) => done(err));
  });

  it('Should not be able to create a new recipe with no name', (done) => {
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .post('/recipes')
          .set('Authorization', response.body.token)
          .send({
            ingredients: '2 eggs, 1 cup white sugar, 1 cup milk',
            preparation: '1 hour',
          })
          .then((response) => {
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Invalid entries. Try again.');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
});

  it('Should not be able to create a new recipe with no ingredients', (done) => {
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .post('/recipes')
          .set('Authorization', response.body.token)
          .send({
            name: 'Cake',
            preparation: '1 hour',
          })
          .then((response) => {
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Invalid entries. Try again.');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('Should not be able to create a new recipe with no preparation', (done) => {
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .post('/recipes')
          .set('Authorization', response.body.token)
          .send({
            name: 'Cake',
            ingredients: '2 eggs, 1 cup white sugar, 1 cup milk',
          })
          .then((response) => {
            expect(response).to.have.status(400);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Invalid entries. Try again.');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });
});

describe('List recipes', () => {
  before(done => {
    connect(`${MONGO_DB_URL}/${DB_NAME}`)
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    await connection.collection('users').insertOne({
      name: 'User',
      email: 'user@email.com.br',
      password: '123456',
    });

    await connection.collection('recipes').insertMany([
      {
        name: 'Cake',
        ingredients: '2 eggs, 1 cup white sugar, 1 cup milk',
        preparation: '1 hour',
      }
    ]);
  });

  after(done => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    connection.close()
      .then(() => done())
      .catch(err => done(err));
  });

  it('Should be able to list all recipes', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .get('/recipes')
          .set('Authorization', response.body.token)
          .then((response) => {
            const [recipe] = response.body;

            expect(response).to.have.status(200);
            expect(response.body).to.have.a('array');
            expect(recipe).to.have.property('_id');
            expect(recipe.name).to.have.equal('Cake');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('Should be able to list all recipes even if authenticated', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .get('/recipes')
          .then((response) => {
            const [recipe] = response.body;

            expect(response).to.have.status(200);
            expect(response.body).to.have.a('array');
            expect(recipe).to.have.property('_id');
            expect(recipe.name).to.have.equal('Cake');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });
});

describe('Show recipe', () => {
  let recipeId;

  before(done => {
    connect(`${MONGO_DB_URL}/${DB_NAME}`)
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    await connection.collection('users').insertOne({
      name: 'User',
      email: 'user@email.com.br',
      password: '123456',
    });

    await connection.collection('recipes').insertOne({
      name: 'Cake',
      ingredients: '2 eggs, 1 cup white sugar, 1 cup milk',
      preparation: '1 hour',
    });

    const { _id } = await connection.collection('recipes').findOne({ name: 'Cake' });
    recipeId = _id;
  });

  after(done => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    connection.close()
      .then(() => done())
      .catch(err => done(err));
  });

  it('Should be able to find a specific recipe', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .get(`/recipes/${recipeId}`)
          .set('Authorization', response.body.token)
          .then((response) => {
            const recipe = response.body;

            expect(response).to.have.status(200);
            expect(recipe).to.have.a('object');
            expect(recipe).to.have.property('_id');
            expect(recipe.name).to.have.equal('Cake');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('Should not be able to find a recipe that does not exist', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .get(`/recipes/999999`)
          .set('Authorization', response.body.token)
          .then((response) => {
            expect(response).to.have.status(404);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('recipe not found');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });
});

describe('Update a recipe', () => {
  let recipeId;

  before(done => {
    connect(`${MONGO_DB_URL}/${DB_NAME}`)
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    await connection.collection('users').insertMany([
      {
        name: 'User',
        email: 'user@email.com.br',
        password: '123456',
        role: 'user',
      },
      {
        name: 'Admin',
        email: 'admin@email.com.br',
        password: 'admin',
        role: 'admin',
      },
      {
        name: 'User 2',
        email: 'user2@email.com.br',
        password: '123456',
        role: 'user',
      },
    ]);

    const { _id: userId } = await connection.collection('users').findOne({
      email: 'user@email.com.br',
    });

    await connection.collection('recipes').insertOne({
      name: 'Cake',
      ingredients: '2 eggs, 1 cup white sugar, 1 cup milk',
      preparation: '1 hour',
      userId,
    });

    const { _id } = await connection.collection('recipes').findOne({ name: 'Cake' });
    recipeId = _id;
  });

  after(done => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    connection.close()
      .then(() => done())
      .catch(err => done(err));
  });

  it('Should be able to update an especific recipe', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .put(`/recipes/${recipeId}`)
          .set('Authorization', response.body.token)
          .send({
            name: 'Updated Cake',
            ingredients: 'Updated ingredients',
            preparation: 'Updated preparation',
          })
          .then((response) => {
            const recipe = response.body;

            expect(response).to.have.status(200);
            expect(recipe.name).to.equal('Updated Cake');
            expect(recipe.ingredients).to.equal('Updated ingredients');
            expect(recipe.preparation).to.equal('Updated preparation');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('Should not be able to update a recipe if not authenticated', (done) => {    
    chai.request(app)
      .put(`/recipes/${recipeId}`)
      .send({
        name: 'Updated Cake',
        ingredients: 'Updated ingredients',
        preparation: 'Updated preparation',
      })
      .then((response) => {
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('missing auth token');
        done();
      })
      .catch((err) => done(err));
  });

  it('Should not be able to update a recipe if token is invalid', (done) => {    
    chai.request(app)
      .put(`/recipes/${recipeId}`)
      .set('Authorization', 'invalid-token')
      .send({
        name: 'Updated Cake',
        ingredients: 'Updated ingredients',
        preparation: 'Updated preparation',
      })
      .then((response) => {
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('jwt malformed');
        done();
      })
      .catch((err) => done(err));
  });

  it('Should be able to update a recipe if role user is admin', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'admin@test.com.br',
        password: 'admin',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .put(`/recipes/${recipeId}`)
          .set('Authorization', response.body.token)
          .send({
            name: 'Updated Cake',
            ingredients: 'Updated ingredients',
            preparation: 'Updated preparation',
          })
          .then((response) => {
            const recipe = response.body;

            expect(response).to.have.status(200);
            expect(recipe.name).to.equal('Updated Cake');
            expect(recipe.ingredients).to.equal('Updated ingredients');
            expect(recipe.preparation).to.equal('Updated preparation');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('should not be able to update another users recipe if not admin', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .put(`/recipes/${recipeId}`)
          .set('Authorization', response.body.token)
          .send({
            name: 'Updated Cake',
            ingredients: 'Updated ingredients',
            preparation: 'Updated preparation',
          })
          .then((response) => {
            expect(response).to.have.status(401);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('User role is not admin');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });
});

describe('Delete a recipe', () => {
  let recipeId;

  before(done => {
    connect(`${MONGO_DB_URL}/${DB_NAME}`)
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    await connection.collection('users').insertMany([
      {
        name: 'User',
        email: 'user@email.com.br',
        password: '123456',
        role: 'user',
      },
      {
        name: 'Admin',
        email: 'admin@email.com.br',
        password: 'admin',
        role: 'admin',
      },
      {
        name: 'User 2',
        email: 'user@email.com.br',
        password: '123456',
        role: 'user',
      },
    ]);

    const { _id: userId } = await connection.collection('users').findOne({
      email: 'user@email.com.br',
    });

    await connection.collection('recipes').insertOne({
      name: 'Cake',
      ingredients: '3 eggs, 3 spoons of milk',
      preparation: '1 hour',
      userId,
    });

    const { _id } = await connection.collection('recipes').findOne({ name: 'Cake' });
    recipeId = _id;
  });

  after(done => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    connection.close()
      .then(() => done())
      .catch(err => done(err));
  });

  it('Should be able to delete a recipe if authenticated', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .delete(`/recipes/${recipeId}`)
          .set('Authorization', response.body.token)
          .then((response) => {
            expect(response).to.have.status(204);
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('Should not be able to delete a recipe if not authenticated', (done) => {    
    chai.request(app)
      .delete(`/recipes/${recipeId}`)
      .then((response) => {
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('missing auth token');
        done();
      })
      .catch((err) => done(err));
  });

  it('Should able to delete a recipe if user role is admin', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'admin@email.com.br',
        password: 'admin',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .delete(`/recipes/${recipeId}`)
          .set('Authorization', response.body.token)
          .then((response) => {
            expect(response).to.have.status(204);
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('Should not be able to delete a recipe from another user if role is not admin', (done) => {    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .delete(`/recipes/${recipeId}`)
          .set('Authorization', response.body.token)
          .then((response) => {
            expect(response).to.have.status(401);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('User role is not admin');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });
});

describe('Create an image for a recipe', () => {
  let recipeId;

  before(done => {
    connect(`${MONGO_DB_URL}/${DB_NAME}`)
      .then(() => done())
      .catch((err) => done(err));
  });

  beforeEach(async () => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    await connection.collection('users').insertMany([
      {
        name: 'User',
        email: 'user@email.com.br',
        password: '123456',
        role: 'user',
      },
      {
        name: 'Admin',
        email: 'admin@email.com.br',
        password: 'admin',
        role: 'admin',
      },
      {
        name: 'User 2',
        email: 'user@email.com.br',
        password: '123456',
        role: 'user',
      },
    ]);

    const { _id: userId } = await connection.collection('users').findOne({
      email: 'user@email.com.br',
    });

    await connection.collection('recipes').insertOne({
      name: 'Cake',
      ingredients: '2 eggs, 1 cup white sugar, 1 cup milk',
      preparation: '1 hour',
      userId,
    });

    const { _id } = await connection.collection('recipes').findOne({ name: 'Cake' });
    recipeId = _id;
  });

  after(done => {
    Object.keys(connection.collections).forEach(async key => {
      await connection.collections[key].deleteMany({});
    });

    connection.close()
      .then(() => done())
      .catch(err => done(err));
  });

  it('Should be able to create an image for a recipe if authenticated', (done) => {
    const imageFile = resolve(__dirname, '..', 'uploads', 'ratinho.jpg');
    const iamgeStream =  fs.createReadStream(imageFile);
    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .put(`/recipes/${recipeId}/image`)
          .attach('image', iamgeStream)
          .set('Authorization', response.body.token)
          .then((response) => {
            expect(response).to.have.status(200);
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('Should not be able to create an image for a recipe if not authenticated', (done) => {
    chai.request(app)
      .put(`/recipes/${recipeId}/image`)
      .then((response) => {
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('missing auth token');
        done();
      })
      .catch((err) => done(err));
  });

  it('Should be able to create an image for a recipe if admin', (done) => {
    const imageFile = resolve(__dirname, '..', 'uploads', 'ratinho.jpg');
    const iamgeStream =  fs.createReadStream(imageFile);
    
    chai.request(app)
      .post('/login')
      .send({
        email: 'admin@email.com.br',
        password: 'admin',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .put(`/recipes/${recipeId}/image`)
          .attach('image', iamgeStream)
          .set('Authorization', response.body.token)
          .then((response) => {
            expect(response).to.have.status(200);
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('should not be able to create an image for another users recipe if not admin', (done) => {
    const imageFile = resolve(__dirname, '..', 'uploads', 'ratinho.jpg');
    const iamgeStream =  fs.createReadStream(imageFile);
    
    chai.request(app)
      .post('/login')
      .send({
        email: 'user@email.com.br',
        password: '123456',
      })
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        chai.request(app)
          .put(`/recipes/${recipeId}/image`)
          .attach('image', iamgeStream)
          .set('Authorization', response.body.token)
          .then((response) => {
            expect(response).to.have.status(401);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('User is not admin');
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });
});

