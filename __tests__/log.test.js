
const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/log');

describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a log via POST', () => {
    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: '1',
        dateOfEvent: '09/20/2020',
        notes: 'great',
        rating: 10
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: '1',
          dateOfEvent: '09/20/2020',
          notes: 'great',
          rating: 10
        });
      });
  });

  it('gets one log by id via GET', async() => {
    await Promise.all([
      {
        recipeId: '1',
        dateOfEvent: '09/20/2020',
        notes: 'great',
        rating: 10
      },
      {
        recipeId: '2',
        dateOfEvent: '09/21/2020',
        notes: 'great',
        rating: 10
      },
      {
        recipeId: '3',
        dateOfEvent: '09/23/2020',
        notes: 'great',
        rating: 10
      }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs/1')
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: '1',
          dateOfEvent: '09/20/2020',
          notes: 'great',
          rating: 10
        });
      });
  });

  it('gets all logs via GET', async() => {
    const logs = await Promise.all([
      {
        recipeId: '1',
        dateOfEvent: '09/20/2020',
        notes: 'great',
        rating: 10
      },
      {
        recipeId: '2',
        dateOfEvent: '09/21/2020',
        notes: 'great',
        rating: 10
      },
      {
        recipeId: '3',
        dateOfEvent: '09/23/2020',
        notes: 'great',
        rating: 10
      }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });  
      });
  });

  it('updates a log by id via PUT', async() => {
    const log = await Log.insert({
      recipeId: '1',
      dateOfEvent: '09/20/2020',
      notes: 'great',
      rating: 10
    });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        recipeId: '2',
        dateOfEvent: '09/20/2020',
        notes: 'super not delicious',
        rating: 10
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: '2',
          dateOfEvent: '09/20/2020',
          notes: 'super not delicious',
          rating: 10
        });
      });
  });

  it('deletes a log by id using DELETE', async() => {
    const log = await Log.insert({
      recipeId: '1',
      dateOfEvent: '09/20/2020',
      notes: 'great',
      rating: 10
    });

    const response = await request(app)
      .delete(`/api/v1/logs/${log.id}`);

    expect(response.body).toEqual({
      id: log.id,
      recipeId: '1',
      dateOfEvent: '09/20/2020',
      notes: 'great',
      rating: 10
    });
  });
});

