import { useEffect, useState } from 'react';
import { IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel, IonSpinner, IonHeader, IonToolbar, IonButtons, IonBackButton, IonToast, IonIcon } from '@ionic/react';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import './AdminDashboard.css';
import './AdminDashboardMobile.css';

const API_BASE = 'http://localhost:5000/api/admin';

function getToken() {
  return localStorage.getItem('token');
}

async function apiGet(path: string) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { error: true, message: errorData.message || 'Request failed' };
    }
    return await res.json();
  } catch (error) {
    console.error('API Get Error:', error);
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

async function apiPost(path: string, body: any) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { error: true, message: errorData.message || 'Request failed' };
    }
    return await res.json();
  } catch (error) {
    console.error('API Post Error:', error);
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

async function apiPut(path: string, body: any) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { error: true, message: errorData.message || 'Request failed' };
    }
    return await res.json();
  } catch (error) {
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

async function apiDelete(path: string) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { error: true, message: errorData.message || 'Request failed' };
    }
    return await res.json();
  } catch (error) {
    console.error('API Delete Error:', error);
    return { error: true, message: 'Network error. Please check your connection.' };
  }
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'products'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user', id: '' });
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
    setLoading(true);
    try {
      const updateData = { role: userForm.role };
      const response = await apiPut(`/users/${userForm.id}`, updateData);
      
      if (!response.error) {
        const updatedUsers = users.map(user => 
          user._id === userForm.id ? { ...user, role: userForm.role } : user
        );
        setUsers(updatedUsers);
        setNotification({
          show: true,
          message: 'User role updated successfully',
          type: 'success'
        });
        setUserForm({ name: '', email: '', role: 'user', id: '' });
      } else {
        setNotification({
          show: true,
          message: response.message || 'Error updating user role',
          type: 'error'
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        message: 'Network error. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }

  function handleUserEdit(u: any) {
    setUserForm({ 
      name: u.name || '', 
      email: u.email || '', 
      role: u.role || 'user', 
      id: u._id 
    });
  }

  async function handleUserDelete(id: string) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        const response = await apiDelete(`/users/${id}`);
        if (!response.error) {
          setUsers(users.filter(user => user._id !== id));
          setNotification({
            show: true,
            message: 'User deleted successfully',
            type: 'success'
          });
        } else {
          setNotification({
            show: true,
            message: response.message || 'Error deleting user',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        // You might want to show an error message to the user here
      } finally {
        setLoading(false);
      }
    }
  }

  // --- CATEGORIES ---
  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!categoryForm.name.trim()) {
        setNotification({
          show: true,
          message: 'Category name is required',
          type: 'error'
        });
        setLoading(false);
        return;
      }

      const response = categoryForm.id 
        ? await apiPut(`/categories/${categoryForm.id}`, categoryForm)
        : await apiPost('/categories', categoryForm);

      if (!response.error) {
        // Refresh categories list immediately
        const updatedCategories = await apiGet('/categories');
        setCategories(Array.isArray(updatedCategories) ? updatedCategories : []);
        
        setCategoryForm({ name: '', id: '' });
        setNotification({
          show: true,
          message: `Category ${categoryForm.id ? 'updated' : 'created'} successfully`,
          type: 'success'
        });
      } else {
        setNotification({
          show: true,
          message: response.message || 'Error processing category',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error processing category:', error);
      setNotification({
        show: true,
        message: 'Network error. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCategoryEdit(c: any) {
    setCategoryForm({ name: c.name, id: c._id });
  }

  async function handleCategoryDelete(id: string) {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setLoading(true);
      try {
        const response = await apiDelete(`/categories/${id}`);
        if (!response.error) {
          const updatedCategories = await apiGet('/categories');
          setCategories(Array.isArray(updatedCategories) ? updatedCategories : []);
          setNotification({
            show: true,
            message: 'Category deleted successfully',
            type: 'success'
          });
        } else {
          setNotification({
            show: true,
            message: response.message || 'Error deleting category',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        setNotification({
          show: true,
          message: 'Network error. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
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
    <IonPage className="admin-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="" />
          </IonButtons>
          <IonLabel className="admin-dashboard-title">Admin Dashboard</IonLabel>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="admin-dashboard-content">
        <div className="admin-dashboard-full">
          <IonToast
            isOpen={notification.show}
            onDidDismiss={() => setNotification({ ...notification, show: false })}
            message={notification.message}
            duration={3000}
            color={notification.type === 'success' ? 'success' : 'danger'}
            position="top"
          />
          <div className="admin-dashboard-tabs">
            <IonButton 
              expand="block"
              fill={activeTab === 'users' ? 'solid' : 'outline'} 
              onClick={() => setActiveTab('users')}
            >
              Users
            </IonButton>
            <IonButton 
              expand="block"
              fill={activeTab === 'categories' ? 'solid' : 'outline'} 
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </IonButton>
            <IonButton 
              expand="block"
              fill={activeTab === 'products' ? 'solid' : 'outline'} 
              onClick={() => setActiveTab('products')}
            >
              Products
            </IonButton>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <IonSpinner />
            </div>
          ) : (
            <>
              {activeTab === 'users' && (
                <>
                  {userForm.id && (
                    <form className="admin-form" onSubmit={handleUserSubmit}>
                      <div className="simple-admin-form">
                        <div className="simple-admin-field">
                          <label className="simple-admin-label required" htmlFor="userRole">
                            User Role
                          </label>
                          <select 
                            id="userRole"
                            className="simple-admin-select"
                            value={userForm.role} 
                            onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="action-buttons">
                          <button type="submit" className="simple-admin-btn">
                            Update Role
                          </button>
                          <button 
                            type="button"
                            className="simple-admin-btn outline" 
                            onClick={() => setUserForm({ name: '', email: '', role: 'user', id: '' })}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="admin-table">
                    <table>
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
                              <div className="table-action-buttons">
                                <button className="simple-table-btn edit" onClick={() => handleUserEdit(u)}>
                                  <IonIcon icon={pencilOutline} />
                                </button>
                                <button className="simple-table-btn danger" onClick={() => handleUserDelete(u._id)}>
                                  <IonIcon icon={trashOutline} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === 'categories' && (
                <>
                  <form className="admin-form" onSubmit={handleCategorySubmit}>
                    <div className="simple-admin-form">
                      <div className="simple-admin-field">
                        <label className="simple-admin-label required" htmlFor="categoryName">
                          Category Name
                        </label>
                        <input
                          id="categoryName"
                          className="simple-admin-input"
                          type="text"
                          value={categoryForm.name}
                          onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Enter category name"
                          required
                        />
                      </div>
                      <div className="action-buttons">
                        <button type="submit" className="simple-admin-btn">
                          {categoryForm.id ? 'Update' : 'Add'} Category
                        </button>
                        {categoryForm.id && (
                          <button 
                            type="button"
                            className="simple-admin-btn outline" 
                            onClick={() => setCategoryForm({ name: '', id: '' })}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  <div className="admin-table">
                    <table>
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
                              <div className="table-action-buttons">
                                <button className="simple-table-btn edit" onClick={() => handleCategoryEdit(c)}>
                                  <IonIcon icon={pencilOutline} />
                                </button>
                                <button className="simple-table-btn danger" onClick={() => handleCategoryDelete(c._id)}>
                                  <IonIcon icon={trashOutline} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === 'products' && (
                <>
                  <form className="admin-form" onSubmit={handleProductSubmit}>
                    <div className="simple-admin-form">
                      <div className="simple-admin-field">
                        <label className="simple-admin-label required" htmlFor="productName">
                          Product Name
                        </label>
                        <input
                          id="productName"
                          className="simple-admin-input"
                          type="text"
                          value={productForm.name}
                          onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div className="simple-admin-field">
                        <label className="simple-admin-label required" htmlFor="productPrice">
                          Price
                        </label>
                        <input
                          id="productPrice"
                          className="simple-admin-input"
                          type="number"
                          value={productForm.price}
                          onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                          placeholder="Enter price"
                          required
                        />
                      </div>
                      <div className="simple-admin-field">
                        <label className="simple-admin-label" htmlFor="productImage">
                          Image URL
                        </label>
                        <input
                          id="productImage"
                          className="simple-admin-input"
                          type="text"
                          value={productForm.image}
                          onChange={e => setProductForm(f => ({ ...f, image: e.target.value }))}
                          placeholder="Enter image URL"
                        />
                      </div>
                      <div className="simple-admin-field">
                        <label className="simple-admin-label required" htmlFor="productCategory">
                          Category
                        </label>
                        <select
                          id="productCategory"
                          className="simple-admin-select"
                          value={productForm.category}
                          onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="action-buttons">
                        <button type="submit" className="simple-admin-btn">
                          {productForm.id ? 'Update' : 'Add'} Product
                        </button>
                        {productForm.id && (
                          <button 
                            type="button"
                            className="simple-admin-btn outline" 
                            onClick={() => setProductForm({ name: '', price: '', image: '', category: '', id: '' })}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  <div className="admin-table">
                    <table>
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
                              <div className="table-action-buttons">
                                <button className="simple-table-btn edit" onClick={() => handleProductEdit(p)}>
                                  <IonIcon icon={pencilOutline} />
                                </button>
                                <button className="simple-table-btn danger" onClick={() => handleProductDelete(p._id)}>
                                  <IonIcon icon={trashOutline} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
