const API_BASE_URL = "https://api.oluwasetemi.dev/tasks"

// Helper function to get auth headers
function getAuthHeaders() {
  // Import auth store dynamically to avoid circular dependencies
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

// Helper function to handle API errors
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.error || errorMessage
    } catch (e) {
      // If parsing JSON fails, use default error message
    }

    // Handle 401 Unauthorized - could redirect to login
    if (response.status === 401) {
      // Clear invalid auth data
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    throw new Error(errorMessage)
  }

  return await response.json()
}

// Fetch all todos
export async function fetchTodos(page = 1, limit = 10) {
  try {
    const res = await fetch(
      `${API_BASE_URL}?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeaders()
      }
    )
    return await handleResponse(res)
  } catch (error) {
    console.error('Error fetching todos:', error)
    throw error
  }
}

// Fetch a single todo by ID
export async function fetchTodoById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    })
    return await handleResponse(res)
  } catch (error) {
    console.error(`Error fetching todo ${id}:`, error)
    throw error
  }
}

// Create a new todo
export async function createTodo(todo) {
  try {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(todo),
    })
    return await handleResponse(res)
  } catch (error) {
    console.error('Error creating todo:', error)
    throw error
  }
}

// Update a todo
export async function updateTodo(id, updates) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    })
    return await handleResponse(res)
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error)
    throw error
  }
}

// Delete a todo
export async function deleteTodo(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    })
    return await handleResponse(res)
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error)
    throw error
  }
}

// Optional: Login API call (if your API supports it)
export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return await handleResponse(res)
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}