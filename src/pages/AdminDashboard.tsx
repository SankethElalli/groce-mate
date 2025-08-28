import { useEffect, useState } from 'react';
import { IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import './AdminDashboard.css';

const API_BASE = 'http://localhost:5000/api/admin';

function getToken() {
  return localStorage.getItem('token');
}

async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
}

async function apiPost(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function apiPut(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function apiDelete(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'products'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'user', id: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', id: '' });
  const [productForm, setProductForm] = useState({ name: '', price: '', image: '', category: '', id: '' });

  // Fetch all data
  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  async function fetchAll() {
    setLoading(true);
    const usersRes = await apiGet('/users');
    const categoriesRes = await apiGet('/categories');
    const productsRes = await apiGet('/products');
    setUsers(Array.isArray(usersRes) ? usersRes : []);
    setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
    setProducts(Array.isArray(productsRes) ? productsRes : []);
    setLoading(false);
  }

  // --- USERS ---
  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (userForm.id) {
      await apiPut(`/users/${userForm.id}`, userForm);
    } else {
      await apiPost('/users', userForm);
    }
    setUserForm({ name: '', email: '', password: '', role: 'user', id: '' });
    setUsers(await apiGet('/users'));
  }
  function handleUserEdit(u: any) {
    setUserForm({ name: u.name, email: u.email, password: '', role: u.role, id: u._id });
  }
  async function handleUserDelete(id: string) {
    await apiDelete(`/users/${id}`);
    setUsers(await apiGet('/users'));
  }

  // --- CATEGORIES ---
  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (categoryForm.id) {
      await apiPut(`/categories/${categoryForm.id}`, categoryForm);
    } else {
      await apiPost('/categories', categoryForm);
    }
    setCategoryForm({ name: '', id: '' });
    setCategories(await apiGet('/categories'));
  }
  function handleCategoryEdit(c: any) {
    setCategoryForm({ name: c.name, id: c._id });
  }
  async function handleCategoryDelete(id: string) {
    await apiDelete(`/categories/${id}`);
    setCategories(await apiGet('/categories'));
  }

  // --- PRODUCTS ---
  async function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (productForm.id) {
      await apiPut(`/products/${productForm.id}`, productForm);
    } else {
      await apiPost('/products', productForm);
    }
    setProductForm({ name: '', price: '', image: '', category: '', id: '' });
    setProducts(await apiGet('/products'));
  }
  function handleProductEdit(p: any) {
    setProductForm({
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category?._id || '',
      id: p._id
    });
  }
  async function handleProductDelete(id: string) {
    await apiDelete(`/products/${id}`);
    setProducts(await apiGet('/products'));
  }

  return (
    <IonPage>
      <IonContent fullscreen className="admin-dashboard-content">
        <div className="admin-dashboard-full">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <div className="admin-dashboard-tabs">
            <IonButton fill={activeTab === 'users' ? 'solid' : 'outline'} onClick={() => setActiveTab('users')}>Users</IonButton>
            <IonButton fill={activeTab === 'categories' ? 'solid' : 'outline'} onClick={() => setActiveTab('categories')}>Categories</IonButton>
            <IonButton fill={activeTab === 'products' ? 'solid' : 'outline'} onClick={() => setActiveTab('products')}>Products</IonButton>
          </div>
          {loading && <div>Loading...</div>}
          {/* USERS */}
          {activeTab === 'users' && (
            <div>
              <form className="admin-form" onSubmit={handleUserSubmit}>
                <IonItem>
                  <IonInput placeholder="Name" value={userForm.name} onIonChange={e => setUserForm(f => ({ ...f, name: e.detail.value! }))} required />
                  <IonInput placeholder="Email" value={userForm.email} onIonChange={e => setUserForm(f => ({ ...f, email: e.detail.value! }))} required />
                  <IonInput placeholder="Password" type="password" value={userForm.password} onIonChange={e => setUserForm(f => ({ ...f, password: e.detail.value! }))} required={!userForm.id} />
                  <select value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <IonButton type="submit">{userForm.id ? 'Update' : 'Add'} User</IonButton>
                  {userForm.id && <IonButton color="medium" onClick={() => setUserForm({ name: '', email: '', password: '', role: 'user', id: '' })}>Cancel</IonButton>}
                </IonItem>
              </form>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <IonButton size="small" onClick={() => handleUserEdit(u)}>Edit</IonButton>
                        <IonButton size="small" color="danger" onClick={() => handleUserDelete(u._id)}>Delete</IonButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* CATEGORIES */}
          {activeTab === 'categories' && (
            <div>
              <form className="admin-form" onSubmit={handleCategorySubmit}>
                <IonItem>
                  <IonInput placeholder="Category Name" value={categoryForm.name} onIonChange={e => setCategoryForm(f => ({ ...f, name: e.detail.value! }))} required />
                  <IonButton type="submit">{categoryForm.id ? 'Update' : 'Add'} Category</IonButton>
                  {categoryForm.id && <IonButton color="medium" onClick={() => setCategoryForm({ name: '', id: '' })}>Cancel</IonButton>}
                </IonItem>
              </form>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <IonButton size="small" onClick={() => handleCategoryEdit(c)}>Edit</IonButton>
                        <IonButton size="small" color="danger" onClick={() => handleCategoryDelete(c._id)}>Delete</IonButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              <form className="admin-form" onSubmit={handleProductSubmit}>
                <IonItem>
                  <IonInput placeholder="Product Name" value={productForm.name} onIonChange={e => setProductForm(f => ({ ...f, name: e.detail.value! }))} required />
                  <IonInput placeholder="Price" value={productForm.price} onIonChange={e => setProductForm(f => ({ ...f, price: e.detail.value! }))} required />
                  <IonInput placeholder="Image URL" value={productForm.image} onIonChange={e => setProductForm(f => ({ ...f, image: e.detail.value! }))} />
                  <select value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  <IonButton type="submit">{productForm.id ? 'Update' : 'Add'} Product</IonButton>
                  {productForm.id && <IonButton color="medium" onClick={() => setProductForm({ name: '', price: '', image: '', category: '', id: '' })}>Cancel</IonButton>}
                </IonItem>
              </form>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Price</th><th>Category</th><th>Image</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.price}</td>
                      <td>{p.category?.name || ''}</td>
                      <td>{p.image && <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />}</td>
                      <td>
                        <IonButton size="small" onClick={() => handleProductEdit(p)}>Edit</IonButton>
                        <IonButton size="small" color="danger" onClick={() => handleProductDelete(p._id)}>Delete</IonButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
