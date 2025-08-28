const API_BASE = 'http://localhost:5000/api';

export async function login(email: string, password: string, role?: string) {
  const body: any = { email, password };
  if (role) body.role = role;
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function register(name: string, email: string, password: string, role: string = 'user') {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  return res.json();
}

// Add more API functions as needed (for admin, products, etc.)
