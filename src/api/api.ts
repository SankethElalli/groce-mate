const API_BASE = 'http://localhost:5000/api';

// Helper function to check if server is online
const checkServerConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE}/health`, { 
      signal: controller.signal,
      method: 'HEAD' 
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log("Server connection check failed:", error);
    return false;
  }
};

// Auth functions
export async function login(email: string, password: string, role?: string) {
  try {
    // Store email for offline fallback
    localStorage.setItem('lastLoginEmail', email);
    
    const body: any = { email, password };
    if (role) body.role = role;
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      return { error: true, message: errorData.message || 'Login failed' };
    }
    
    return res.json();
  } catch (error) {
    console.error("Login error:", error);
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

export async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await res.json();
        return { error: true, message: errorData.message || 'Failed to fetch products' };
      } else {
        return { error: true, message: `Server error: ${res.status}` };
      }
    }
    
    const data = await res.json();
    return { data, error: false };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

export async function register(name: string, email: string, password: string, role: string = 'user') {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      return { error: true, message: errorData.message || 'Registration failed' };
    }
    
    return res.json();
  } catch (error) {
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

// Profile functions
export async function updateProfile(userData: { name: string, email: string }) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  // First check if server is reachable
  const isOnline = await checkServerConnection();
  if (!isOnline) {
    // If server not reachable, handle gracefully by using mock data
    console.log("Server not reachable, using offline mode");
    
    // Get current user from local storage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update user with new data and timestamp
    const updatedUser = {
      ...currentUser,
      name: userData.name,
      email: userData.email,
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage for offline persistence
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Return the updated user
    return updatedUser;
  }
  
  try {
    console.log("Making API call to update profile:", userData);
    
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });
    
    if (!res.ok) {
      // Try to get error details
      let errorMsg = 'Failed to update profile';
      try {
        const errorData = await res.json();
        errorMsg = errorData.message || errorMsg;
      } catch (e) {
        // If parsing fails, use status text
        errorMsg = res.statusText || errorMsg;
      }
      
      throw new Error(errorMsg);
    }
    
    const data = await res.json();
    console.log("Profile update response:", data);
    return data;
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const token = localStorage.getItem('token');
  
  // First check if server is reachable
  const isOnline = await checkServerConnection();
  if (!isOnline) {
    throw new Error('Server is not reachable. Please check your connection.');
  }
  
  const res = await fetch(`${API_BASE}/users/change-password`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to change password');
  }
  
  return res.json();
}

export async function uploadProfileImage(file: File) {
  const token = localStorage.getItem('token');
  
  // First check if server is reachable
  const isOnline = await checkServerConnection();
  if (!isOnline) {
    throw new Error('Server is not reachable. Please check your connection.');
  }
  
  const formData = new FormData();
  formData.append('avatar', file);
  
  const res = await fetch(`${API_BASE}/users/upload-avatar`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to upload image');
  }
  
  return res.json();
}

export async function getProfileData() {
  const token = localStorage.getItem('token');
  
  // Add a timeout to the fetch to avoid long hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to get profile data');
    }
    
    return res.json();
  } catch (error) {
    console.error("Profile fetch error:", error);
    clearTimeout(timeoutId);
    throw error;
  }
}

// Add more API functions as needed (for admin, products, etc.)
