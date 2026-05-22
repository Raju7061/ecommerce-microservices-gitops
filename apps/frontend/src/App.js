import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cart, setCart] = useState([]);

  // Load Catalog from Product Service
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching items:", err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      alert('Logged in successfully!');
    } else {
      alert('Login failed!');
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to local cart!`);
  };

  const handleCheckout = async () => {
    if (!token) {
      alert('Authentication Required! Please login first to order items.');
      return;
    }

    // Checkout first item in cart as an example
    if (cart.length === 0) return alert('Your cart is empty.');

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: cart[0].id,
        quantity: 1,
        amount: cart[0].price
      })
    });

    if (res.status === 201) {
      alert('Order Placed Successfully via Kafka Pipeline!');
      setCart([]);
    } else {
      alert('Checkout Failed.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>⚡ Electronics Mega Shop</h1>
      
      {/* Auth Section */}
      {!token ? (
        <form onSubmit={handleLogin} style={{ marginBottom: '30px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Login to Place Orders</h3>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div style={{ color: 'green', marginBottom: '20px' }}>✓ Logged In Securely</div>
      )}

      {/* Catalog */}
      <h2>Products Catalog</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
            <h4>{p.name}</h4>
            <p>Price: ${p.price}</p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Cart Actions */}
      <h2 style={{ marginTop: '40px' }}>Your Cart ({cart.length} items)</h2>
      <button onClick={handleCheckout} style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Proceed to Order (Requires Login)
      </button>
    </div>
  );
}

export default App;