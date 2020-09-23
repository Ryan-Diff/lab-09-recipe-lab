const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: {
          flour: {
            amount: 2,
            measurement: 'cup',
          }, 
          sugar: {
            amount: 1,
            measurement: 'cup',
          }, 
          chocolateChips: {
            amount: 1,
            measurement: 'cup',
          }
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: {
            flour: {
              amount: 2,
              measurement: 'cup',
            }, 
            sugar: {
              amount: 1,
              measurement: 'cup',
            }, 
            chocolateChips: {
              amount: 1,
              measurement: 'cup',
            }
          }
        });
      });
  });

  it('gets one recipe by id', async() => {
    await Promise.all([
      { name: 'cookies', directions: [], ingredients: {} },
      { name: 'cake', directions: [], ingredients: {} },
      { name: 'pie', directions: [], ingredients: {} }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes/1')
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [],
          ingredients: {}
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [], ingredients: {} },
      { name: 'cake', directions: [], ingredients: {} },
      { name: 'pie', directions: [], ingredients: {} }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: {
        flour: {
          amount: 2,
          measurement: 'cup',
        }, 
        sugar: {
          amount: 1,
          measurement: 'cup',
        }, 
        chocolateChips: {
          amount: 1,
          measurement: 'cup',
        }
      }
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: {
          flour: {
            amount: 2,
            measurement: 'cup',
          }, 
          sugar: {
            amount: 1,
            measurement: 'cup',
          }, 
          chocolateChips: {
            amount: 1,
            measurement: 'cup',
          }
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: {
            flour: {
              amount: 2,
              measurement: 'cup',
            }, 
            sugar: {
              amount: 1,
              measurement: 'cup',
            }, 
            chocolateChips: {
              amount: 1,
              measurement: 'cup',
            }
          }
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const createdRecipe = await Recipe.insert({
      name: 'good cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: {
        flour: {
          amount: 2,
          measurement: 'cup',
        }, 
        sugar: {
          amount: 1,
          measurement: 'cup',
        }, 
        chocolateChips: {
          amount: 1,
          measurement: 'cup',
        }
      }
    });

    const response = await request(app)
      .delete(`/api/v1/recipes/${createdRecipe.id}`);

    expect(response.body).toEqual({ ...createdRecipe });
  });
});
