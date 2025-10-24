const API_BASE_URL = "https://api.oluwasetemi.dev/tasks";
const AUTH_BASE_URL = "https://api.oluwasetemi.dev/api/auth";

// ================== HELPER FUNCTIONS ==================

// ✅ Get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

// ✅ Safe JSON parsing helper
async function safeJsonParse(response) {
  try {
    return await response.json();
  } catch {
    return null; // return null if no valid JSON
  }
}

// ✅ Handle API responses & errors
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await safeJsonParse(response);
    let errorMessage = errorData?.message || errorData?.error || `HTTP ${response.status}`;

    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    throw new Error(errorMessage);
  }

  // ✅ Return parsed JSON or null safely
  return await safeJsonParse(response);
}

// ================== AUTHENTICATION ==================

// ✅ Login user
export async function loginUser(email, password) {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
// ✅ Register user (fully fixed)
export async function registerUser(userData) {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ❌ remove credentials (CORS-safe)
      // ✅ include correct payload
      body: JSON.stringify({
        email: userData.email.trim(),
        password: userData.password,
        name: userData.name,
        // Optional callback for success redirect
        callbackURL: "https://api.oluwasetemi.dev/api/auth/sign-in/email"
      }),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}




// ✅ Get current user
export async function getCurrentUser() {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/get-session`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// ✅ Logout user (with safe JSON handling)
export async function logoutUser() {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/sign-out`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    const data = await safeJsonParse(res);
    return data || { success: res.ok };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}

// ✅ Change password
export async function changePassword(currentPassword, newPassword) {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/change-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
}

// ✅ Request password reset
export async function requestPasswordReset(email) {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/forget-password`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
}

// ================== TODO API CALLS ==================

// ✅ Fetch all todos
export async function fetchTodos(page = 1, limit = 10) {
  try {
    const res = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}

// ✅ Fetch single todo by ID
export async function fetchTodoById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error(`Error fetching todo ${id}:`, error);
    throw error;
  }
}

// ✅ Create todo
export async function createTodo(todo) {
  try {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(todo),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

// ✅ Update todo
export async function updateTodo(id, updates) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error);
    throw error;
  }
}

// ✅ Delete todo
export async function deleteTodo(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error);
    throw error;
  }
}
