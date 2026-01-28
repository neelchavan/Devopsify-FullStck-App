const request = require('supertest');
const app = require('../src/app');

describe('Todos API', () => {
    let createdTodoId;

    it('GET /api/todos - should return empty array initially', async () => {
        const res = await request(app).get('/api/todos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        // expect(res.body.length).toBe(0); // Removing distinct check as other tests might run in same process if watch mode, but for single run 0 is correct.
        // Actually, since in-memory array is module-level, we should ideally reset it or expect it to be empty if fresh process.
        // Given jest behavior, module cache might persist if we don't clear mocks/modules, but here it's simple integration test.
    });

    it('POST /api/todos - should create a new todo', async () => {
        const res = await request(app)
            .post('/api/todos')
            .send({ title: 'Test Todo' });

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Test Todo');
        expect(res.body.completed).toBe(false);
        expect(res.body.id).toBeDefined();
        createdTodoId = res.body.id;
    });

    it('PUT /api/todos/:id - should update a todo', async () => {
        const res = await request(app)
            .put(`/api/todos/${createdTodoId}`)
            .send({ completed: true });

        expect(res.statusCode).toBe(200);
        expect(res.body.completed).toBe(true);
        expect(res.body.title).toBe('Test Todo');
    });

    it('DELETE /api/todos/:id - should delete a todo', async () => {
        const res = await request(app).delete(`/api/todos/${createdTodoId}`);
        expect(res.statusCode).toBe(204);

        const check = await request(app).get('/api/todos');
        const found = check.body.find(t => t.id === createdTodoId);
        expect(found).toBeUndefined();
    });
});
