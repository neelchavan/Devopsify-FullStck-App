const express = require('express');
const router = express.Router();

let todos = [];

// GET /api/todos
router.get('/', (req, res) => {
  res.json(todos);
});

// POST /api/todos
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTodo = {
    id: Date.now().toString(),
    title,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const updatedTodo = {
    ...todos[todoIndex],
    title: title !== undefined ? title : todos[todoIndex].title,
    completed: completed !== undefined ? completed : todos[todoIndex].completed
  };

  todos[todoIndex] = updatedTodo;
  res.json(updatedTodo);
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(todoIndex, 1);
  res.status(204).send();
});

module.exports = router;
