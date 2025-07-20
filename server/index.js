const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory database (in real apps, this would be MySQL/PostgreSQL)
let todos = [
  { id: 1, text: 'Learn React', completed: false },
  { id: 2, text: 'Build an API', completed: false },
  { id: 3, text: 'Connect to database', completed: false }
];
let nextId = 4;

// API Routes (similar to PHP endpoints)

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  console.log('GET /api/todos - Fetching all todos');
  res.json(todos);
});

// POST /api/todos - Create new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  console.log('POST /api/todos - Creating todo:', text);
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  const newTodo = {
    id: nextId++,
    text,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id - Update todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  console.log('PUT /api/todos/' + id + ' - Updating todo');
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  if (text !== undefined) todos[todoIndex].text = text;
  if (completed !== undefined) todos[todoIndex].completed = completed;
  
  res.json(todos[todoIndex]);
});

// DELETE /api/todos/:id - Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log('DELETE /api/todos/' + id + ' - Deleting todo');
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(todoIndex, 1);
  res.json({ message: 'Todo deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('  GET    /api/todos     - Get all todos');
  console.log('  POST   /api/todos     - Create new todo');
  console.log('  PUT    /api/todos/:id - Update todo');
  console.log('  DELETE /api/todos/:id - Delete todo');
});