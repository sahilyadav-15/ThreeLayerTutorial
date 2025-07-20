import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit2, Save } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch todos from API (like calling a PHP endpoint)
  const fetchTodos = async () => {
    try {
      console.log('🔄 Fetching todos from API...');
      const response = await fetch(`${API_BASE}/todos`);
      const data = await response.json();
      setTodos(data);
      console.log('✅ Todos loaded:', data);
    } catch (error) {
      console.error('❌ Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      console.log('➕ Creating new todo:', newTodo);
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });
      
      const createdTodo = await response.json();
      setTodos([...todos, createdTodo]);
      setNewTodo('');
      console.log('✅ Todo created:', createdTodo);
    } catch (error) {
      console.error('❌ Error creating todo:', error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id, completed) => {
    try {
      console.log('🔄 Toggling todo completion:', id);
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      console.log('✅ Todo toggled:', updatedTodo);
    } catch (error) {
      console.error('❌ Error toggling todo:', error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      console.log('🗑️ Deleting todo:', id);
      await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
      });
      
      setTodos(todos.filter(todo => todo.id !== id));
      console.log('✅ Todo deleted');
    } catch (error) {
      console.error('❌ Error deleting todo:', error);
    }
  };

  // Start editing
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      console.log('💾 Saving edit for todo:', id);
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editText }),
      });
      
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      setEditingId(null);
      setEditText('');
      console.log('✅ Todo updated:', updatedTodo);
    } catch (error) {
      console.error('❌ Error updating todo:', error);
    }
  };

  // Load todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            React + API + Database
          </h1>
          <p className="text-gray-600">
            Simple todo app showing how frontend, backend, and database work together
          </p>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={createTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No todos yet. Add one above!
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Completion Toggle */}
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {todo.completed && <Check size={14} />}
                  </button>

                  {/* Todo Text */}
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                      />
                    ) : (
                      <span
                        className={`${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {editingId === todo.id ? (
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Save size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(todo.id, todo.text)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Panel */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How This Works (React + API + Database)
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">1</span>
              </div>
              <div>
                <strong>React Frontend:</strong> This component makes HTTP requests to the API
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-semibold text-xs">2</span>
              </div>
              <div>
                <strong>Node.js API:</strong> Server handles requests and manages data (like PHP would)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-semibold text-xs">3</span>
              </div>
              <div>
                <strong>Database:</strong> Data is stored and retrieved (using in-memory storage here, but would be MySQL/PostgreSQL in production)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;