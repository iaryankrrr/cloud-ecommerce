import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [theme, setTheme] = useState('light')
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoginView, setIsLoginView] = useState(true)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authError, setAuthError] = useState('')

  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  
  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart' | 'address' | 'payment' | 'qr' | 'success'
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', pincode: '' })
  const [paymentType, setPaymentType] = useState('UPI')

  // Product Reviews State
  const [reviews, setReviews] = useState({}) 
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')

  const [isAdminView, setIsAdminView] = useState(false)
  const [allOrders, setAllOrders] = useState([])

  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'

  const colors = theme === 'light' ? {
    bg: '#FAF7F2',
    cardBg: '#FFFFFF',
    text: '#2A2522',
    subtext: '#7A706B',
    border: '#EAE3D9',
    accent: '#262422',
    accentText: '#FAF7F2',
    inputBg: '#F4F0EA',
    navBg: '#FAF7F2'
  } : {
    bg: '#161412',
    cardBg: '#201D1A',
    text: '#F4F0EA',
    subtext: '#A39993',
    border: '#332E2A',
    accent: '#EBE5DD',
    accentText: '#161412',
    inputBg: '#2A2622',
    navBg: '#161412'
  }

  useEffect(() => {
    fetch('https://loud-ecommerce-backend.onrender.com/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

  const categories = [
    { name: 'Apparel', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600', desc: "Men's, women's & kids fashion apparel" },
    { name: 'Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', desc: 'Fresh vegetables, fruits, dry fruits & staples' },
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', desc: 'Smartwatches, headphones & audio gear' },
    { name: 'Books & Stationery', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', desc: 'Bestsellers, journals, pens & art supplies' },
    { name: 'Pet Supplies', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600', desc: 'Dog food, toys, beds & accessories' },
    { name: 'Kitchen & Dining', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600', desc: 'Cookware, dinner sets, bottles & storage' },
    { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', desc: 'Running shoes, sneakers, loafers & slippers' },
    { name: 'Home Decor & Lighting', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600', desc: 'Scented candles, fairy lights, lamps & cushions' },
    { name: 'Fitness & Wellness', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600', desc: 'Massage guns, yoga mats, protein & fitness gear' }
  ]

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('https://loud-ecommerce-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      })
      if (res.ok) {
        const user = await res.json()
        setCurrentUser(user)
        setAuthError('')
      } else {
        setAuthError('Invalid email or password.')
      }
    } catch (err) {
      setAuthError('Server error.')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('https://loud-ecommerce-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: authName, email: authEmail, password: authPassword })
      })
      if (res.ok) {
        const user = await res.json()
        setCurrentUser(user)
        setAuthError('')
      } else {
        setAuthError('Registration failed.')
      }
    } catch (err) {
      setAuthError('Server error.')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setSelectedCategory(null)
    setSelectedProduct(null)
    setCart([])
    setWishlist([])
    setIsAdminView(false)
  }

  const addToCart = (product) => {
    if (product.stockStatus === 'OUT_OF_STOCK') return;
    setCart(prev => [...prev, product])
    setIsCartOpen(true)
    setCheckoutStep('cart')
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id))
    } else {
      setWishlist([...wishlist, product])
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)
  const deliveryFee = subtotal > 199 || subtotal === 0 ? 0 : 50.00
  const totalAmount = subtotal + deliveryFee

  const handleProceedPayment = () => {
    if (paymentType.includes('UPI') || paymentType.includes('PhonePe')) {
      setCheckoutStep('qr')
    } else {
      handlePlaceOrder()
    }
  }

  const handlePlaceOrder = async () => {
    if (!currentUser) return
    const orderData = { 
      userId: currentUser.id, 
      totalAmount: totalAmount, 
      paymentMethod: paymentType,
      shippingAddress: `${address.fullName}, ${address.street}, ${address.city} - ${address.pincode} (Ph: ${address.phone})`
    }
    try {
      const res = await fetch('https://loud-ecommerce-backend.onrender.com/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      if (res.ok) {
        setCheckoutStep('success')
      } else {
        alert('Failed to place order.')
      }
    } catch (err) {
      alert('Server error.')
    }
  }

  const handleAddReview = (productId, e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    const reviewItem = {
      name: currentUser.fullName,
      rating: Number(newRating),
      comment: newComment,
      date: new Date().toLocaleDateString()
    }
    setReviews(prev => ({
      ...prev,
      [productId]: [reviewItem, ...(prev[productId] || [])]
    }))
    setNewComment('')
  }

  const fetchAllOrders = async () => {
    try {
      const res = await fetch('https://loud-ecommerce-backend.onrender.com/api/orders/all')
      if (res.ok) {
        const data = await res.json()
        setAllOrders(data)
        setIsAdminView(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!currentUser) {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Playfair Display', sans-serif", color: colors.text }}>
        <div style={{ backgroundColor: colors.cardBg, padding: '48px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: `1px solid ${colors.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '0.2em', marginBottom: '8px' }}>KASA</h1>
            <p style={{ color: colors.subtext, fontSize: '0.9rem' }}>Warm essentials & curated living.</p>
          </div>
          
          <div style={{ display: 'flex', marginBottom: '24px', borderBottom: `1px solid ${colors.border}` }}>
            <button onClick={() => { setIsLoginView(true); setAuthError(''); }} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: isLoginView ? `2px solid ${colors.accent}` : 'none', fontWeight: '600', color: isLoginView ? colors.text : colors.subtext, cursor: 'pointer' }}>Sign In</button>
            <button onClick={() => { setIsLoginView(false); setAuthError(''); }} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: !isLoginView ? `2px solid ${colors.accent}` : 'none', fontWeight: '600', color: !isLoginView ? colors.text : colors.subtext, cursor: 'pointer' }}>Register</button>
          </div>

          {authError && <div style={{ color: '#D9534F', backgroundColor: 'rgba(217,83,79,0.1)', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem', textAlign: 'center' }}>{authError}</div>}
          
          <form onSubmit={isLoginView ? handleLogin : handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLoginView && <input type="text" placeholder="Full Name" required value={authName} onChange={(e) => setAuthName(e.target.value)} style={{ padding: '12px 16px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text, outline: 'none' }} />}
            <input type="email" placeholder="Email Address" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} style={{ padding: '12px 16px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text, outline: 'none' }} />
            <input type="password" placeholder="Password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} style={{ padding: '12px 16px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text, outline: 'none' }} />
            <button type="submit" style={{ backgroundColor: colors.accent, color: colors.accentText, padding: '14px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>{isLoginView ? 'Sign In to Store' : 'Create Account'}</button>
          </form>
        </div>
      </div>
    )
  }

  if (isAdminView) {
    return (
      <div style={{ backgroundColor: colors.bg, minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', color: colors.text }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem' }}>Admin Orders Dashboard</h1>
          <button onClick={() => setIsAdminView(false)} style={{ padding: '10px 20px', cursor: 'pointer', border: `1px solid ${colors.text}`, background: 'transparent', color: colors.text, borderRadius: '8px', fontWeight: '600' }}>Exit Dashboard</button>
        </div>
        <div style={{ backgroundColor: colors.cardBg, borderRadius: '12px', padding: '24px', border: `1px solid ${colors.border}` }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.border}`, color: colors.subtext }}>
                <th style={{ padding: '12px' }}>Order ID</th>
                <th style={{ padding: '12px' }}>User ID</th>
                <th style={{ padding: '12px' }}>Total Amount</th>
                <th style={{ padding: '12px' }}>Payment</th>
                <th style={{ padding: '12px' }}>Shipping Address</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: colors.subtext }}>No orders placed yet.</td></tr>
              ) : (
                allOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>#{o.id}</td>
                    <td style={{ padding: '16px' }}>{o.userId}</td>
                    <td style={{ padding: '16px' }}>₹{o.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: '16px' }}>{o.paymentMethod}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem' }}>{o.shippingAddress || 'Standard Pickup'}</td>
                    <td style={{ padding: '16px' }}><span style={{ backgroundColor: colors.inputBg, padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>{o.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const filteredProducts = products.filter(p => {
    if (searchTerm) {
      return (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
             (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (!selectedCategory) return true
    return p.category && p.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
  })

  const productReviews = selectedProduct ? (reviews[selectedProduct.id] || []) : []
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1) 
    : '4.8'

  return (
    <div style={{ backgroundColor: colors.bg, color: colors.text, minHeight: '100vh', fontFamily: "'Playfair Display', 'Plus Jakarta Sans', serif", position: 'relative', transition: 'background 0.3s' }}>
      
      <div style={{ backgroundColor: colors.accent, color: colors.accentText, textAlign: 'center', padding: '10px 20px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        FREE DELIVERY ON ORDERS OVER ₹199 &nbsp;&bull;&nbsp; PHONEPE UPI QR INTEGRATED &nbsp;&bull;&nbsp; KASA
      </div>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.navBg, position: 'sticky', top: 0, zIndex: 90 }}>
        <div style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '0.25em', cursor: 'pointer' }} onClick={() => { setSelectedCategory(null); setSelectedProduct(null); setSearchTerm(''); }}>
          KASA
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <input 
            type="text" 
            placeholder="Search collections..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ padding: '8px 16px', borderRadius: '20px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text, outline: 'none', fontSize: '0.85rem', width: '200px' }} 
          />

          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ background: 'none', border: `1px solid ${colors.border}`, padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', color: colors.text, fontSize: '0.85rem', fontWeight: '600' }}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>

          <div onClick={() => setIsWishlistOpen(true)} style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: colors.inputBg, padding: '6px 14px', borderRadius: '20px' }}>
            ❤️ <span>{wishlist.length}</span>
          </div>

          <div onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: colors.inputBg, padding: '6px 14px', borderRadius: '20px' }}>
            🛒 <span>{cart.length}</span>
          </div>

          <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600' }}>Hi, {currentUser.fullName.split(' ')[0]}</span>
            {currentUser.role === 'ADMIN' && (
              <button onClick={fetchAllOrders} style={{ background: colors.accent, color: colors.accentText, border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Dashboard</button>
            )}
            <button onClick={handleLogout} style={{ background: 'none', border: `1px solid ${colors.border}`, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', color: colors.text }}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px 48px' }}>
        
        {selectedProduct && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', overflowY: 'auto' }}>
            <div style={{ backgroundColor: colors.cardBg, borderRadius: '16px', maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative', border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: colors.text }}>&times;</button>
              
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', height: '320px', borderRadius: '12px', overflow: 'hidden', backgroundColor: colors.inputBg }}>
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} onError={(e) => { e.target.src = fallbackImage; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', backgroundColor: colors.inputBg, padding: '4px 8px', borderRadius: '4px' }}>{selectedProduct.category}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#D4AF37' }}>★ {avgRating} ({productReviews.length + 12} reviews)</span>
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontFamily: 'serif', marginTop: '10px', marginBottom: '12px' }}>{selectedProduct.name}</h2>
                    <div style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>₹{selectedProduct.price.toFixed(2)}</div>
                    <p style={{ color: colors.subtext, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>{selectedProduct.description}</p>
                    
                    <div style={{ backgroundColor: colors.inputBg, padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Specifications:</div>
                      <div style={{ fontSize: '0.8rem', color: colors.subtext }}>• Availability: {selectedProduct.stockStatus}</div>
                      <div style={{ fontSize: '0.8rem', color: colors.subtext }}>• Delivery: Free on orders over ₹199</div>
                      <div style={{ fontSize: '0.8rem', color: colors.subtext }}>• Quality Verified</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => toggleWishlist(selectedProduct)} style={{ flex: 1, backgroundColor: colors.inputBg, color: colors.text, border: `1px solid ${colors.border}`, padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                      {wishlist.some(i => i.id === selectedProduct.id) ? '❤️ Wishlisted' : '🤍 Wishlist'}
                    </button>
                    <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} disabled={selectedProduct.stockStatus === 'OUT_OF_STOCK'} style={{ flex: 2, backgroundColor: selectedProduct.stockStatus === 'OUT_OF_STOCK' ? colors.subtext : colors.accent, color: colors.accentText, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                      {selectedProduct.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '24px', marginTop: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'serif', marginBottom: '16px' }}>Customer Ratings & Reviews</h3>
                
                <form onSubmit={(e) => handleAddReview(selectedProduct.id, e)} style={{ backgroundColor: colors.inputBg, padding: '16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Your Rating:</label>
                    <select value={newRating} onChange={(e) => setNewRating(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardBg, color: colors.text }}>
                      <option value="5">★★★★★ (5/5)</option>
                      <option value="4">★★★★☆ (4/5)</option>
                      <option value="3">★★★☆☆ (3/5)</option>
                      <option value="2">★★☆☆☆ (2/5)</option>
                      <option value="1">★☆☆☆☆ (1/5)</option>
                    </select>
                  </div>
                  <textarea placeholder="Write your review about this product..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required rows="2" style={{ padding: '10px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardBg, color: colors.text, outline: 'none', fontSize: '0.85rem' }} />
                  <button type="submit" style={{ alignSelf: 'flex-end', backgroundColor: colors.accent, color: colors.accentText, border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Submit Review</button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {productReviews.length === 0 ? (
                    <p style={{ color: colors.subtext, fontSize: '0.85rem' }}>Be the first to review this product!</p>
                  ) : (
                    productReviews.map((rev, idx) => (
                      <div key={idx} style={{ backgroundColor: colors.inputBg, padding: '12px 16px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{rev.name}</span>
                          <span style={{ fontSize: '0.8rem', color: colors.subtext }}>{rev.date}</span>
                        </div>
                        <div style={{ color: '#D4AF37', fontSize: '0.85rem', marginBottom: '6px' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                        <p style={{ fontSize: '0.85rem', color: colors.text, lineHeight: '1.4' }}>{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {!selectedCategory && !searchTerm ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '3rem', fontFamily: 'serif', marginBottom: '12px' }}>What would you like to shop today?</h1>
              <p style={{ color: colors.subtext, fontSize: '1.05rem' }}>Select a category below to explore curated items.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
              {categories.map((cat) => (
                <div key={cat.name} onClick={() => setSelectedCategory(cat.name)} style={{ backgroundColor: colors.cardBg, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: `1px solid ${colors.border}`, transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <div style={{ height: '220px', overflow: 'hidden' }}>
                    <img src={cat.image} alt={cat.name} onError={(e) => { e.target.src = fallbackImage; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'serif', marginBottom: '6px' }}>{cat.name}</h3>
                    <p style={{ color: colors.subtext, fontSize: '0.85rem', lineHeight: '1.4' }}>{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <button onClick={() => { setSelectedCategory(null); setSearchTerm(''); }} style={{ background: 'none', border: 'none', color: colors.subtext, cursor: 'pointer', fontSize: '0.9rem', marginBottom: '8px' }}>← Back to Categories</button>
                <h2 style={{ fontSize: '2.2rem', fontFamily: 'serif' }}>{searchTerm ? `Search Results for "${searchTerm}"` : `${selectedCategory} Collection`}</h2>
              </div>
              <span style={{ color: colors.subtext, fontSize: '0.9rem' }}>Showing {filteredProducts.length} items</span>
            </div>

            {filteredProducts.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '80px', color: colors.subtext }}>No products found in this selection.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px' }}>
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlist.some(item => item.id === product.id)
                  return (
                    <div key={product.id} style={{ backgroundColor: colors.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                      <div onClick={() => setSelectedProduct(product)} style={{ height: '240px', borderRadius: '8px', overflow: 'hidden', backgroundColor: colors.inputBg, position: 'relative', marginBottom: '14px', cursor: 'pointer' }}>
                        {product.stockStatus === 'OUT_OF_STOCK' ? (
                          <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#D9534F', color: '#FFF', padding: '4px 10px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', borderRadius: '4px', zIndex: 2 }}>Out of Stock</span>
                        ) : (
                          <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: colors.cardBg, color: colors.text, padding: '4px 10px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', borderRadius: '4px', zIndex: 2 }}>In Stock</span>
                        )}

                        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} style={{ position: 'absolute', top: '10px', right: '10px', background: colors.cardBg, border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', zIndex: 2 }}>
                          {isWishlisted ? '❤️' : '🤍'}
                        </button>

                        <img src={product.imageUrl} alt={product.name} onError={(e) => { e.target.src = fallbackImage; }} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: product.stockStatus === 'OUT_OF_STOCK' ? 0.6 : 1 }} />
                      </div>

                      <h3 onClick={() => setSelectedProduct(product)} style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '6px', cursor: 'pointer' }}>{product.name}</h3>
                      <p style={{ fontSize: '0.8rem', color: colors.subtext, marginBottom: '12px', lineHeight: '1.4', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>₹{product.price.toFixed(2)}</span>
                        {product.stockStatus !== 'OUT_OF_STOCK' && (
                          <button onClick={() => addToCart(product)} style={{ backgroundColor: colors.accent, color: colors.accentText, border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>Add to Cart</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {isWishlistOpen && (
        <>
          <div onClick={() => setIsWishlistOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, width: '400px', height: '100%', backgroundColor: colors.cardBg, zIndex: 100, padding: '30px', boxSizing: 'border-box', borderLeft: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontFamily: 'serif' }}>Your Wishlist ({wishlist.length})</h2>
              <button onClick={() => setIsWishlistOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: colors.text }}>&times;</button>
            </div>
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 0' }}>
              {wishlist.length === 0 ? (
                <p style={{ textAlign: 'center', color: colors.subtext, marginTop: '40px' }}>Your wishlist is empty.</p>
              ) : (
                wishlist.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '16px', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>
                    <img src={item.imageUrl} alt={item.name} onError={(e) => { e.target.src = fallbackImage; }} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{item.name}</h4>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>₹{item.price.toFixed(2)}</span>
                    </div>
                    <button onClick={() => { addToCart(item); toggleWishlist(item); }} style={{ backgroundColor: colors.accent, color: colors.accentText, border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Move to Cart</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {isCartOpen && (
        <>
          <div onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, width: '420px', height: '100%', backgroundColor: colors.cardBg, zIndex: 100, padding: '30px', boxSizing: 'border-box', borderLeft: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontFamily: 'serif' }}>
                {checkoutStep === 'success' ? 'Order Confirmed' : checkoutStep === 'qr' ? 'Scan & Pay (PhonePe UPI)' : checkoutStep === 'address' ? 'Delivery Address' : checkoutStep === 'payment' ? 'Payment Method' : `Your Cart (${cart.length})`}
              </h2>
              <button onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: colors.text }}>&times;</button>
            </div>

            {checkoutStep === 'cart' && (
              <>
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 0' }}>
                  {cart.length === 0 ? (
                    <p style={{ textAlign: 'center', color: colors.subtext, marginTop: '60px' }}>Your cart is empty.</p>
                  ) : (
                    cart.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '16px', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>
                        <img src={item.imageUrl} alt={item.name} onError={(e) => { e.target.src = fallbackImage; }} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{item.name}</h4>
                          <span style={{ fontWeight: '600' }}>₹{item.price.toFixed(2)}</span>
                        </div>
                        <button onClick={() => removeFromCart(index)} style={{ background: 'none', border: 'none', color: '#D9534F', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: colors.subtext }}><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: colors.subtext }}>
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? 'FREE (Above ₹199)' : `₹${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: '700' }}><span>Total</span><span>₹{totalAmount.toFixed(2)}</span></div>
                    <button onClick={() => setCheckoutStep('address')} style={{ width: '100%', backgroundColor: colors.accent, color: colors.accentText, border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Proceed to Address</button>
                  </div>
                )}
              </>
            )}

            {checkoutStep === 'address' && (
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontFamily: 'serif' }}>Enter Shipping Details</h3>
                  <input type="text" placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text }} />
                  <input type="text" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text }} />
                  <input type="text" placeholder="Street Address / House No." value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text }} />
                  <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text }} />
                  <input type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: colors.inputBg, color: colors.text }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setCheckoutStep('cart')} style={{ flex: 1, backgroundColor: 'transparent', color: colors.text, border: `1px solid ${colors.text}`, padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
                  <button onClick={() => { if(!address.fullName || !address.street) { alert('Please fill address'); return; } setCheckoutStep('payment'); }} style={{ flex: 2, backgroundColor: colors.accent, color: colors.accentText, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Continue to Payment</button>
                </div>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div style={{ flexGrow: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 0' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontFamily: 'serif', marginBottom: '16px' }}>Select Payment Option</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {['PhonePe UPI (Scan QR)', 'Google Pay / Paytm UPI', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery'].map((method) => (
                      <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: paymentType === method ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`, backgroundColor: colors.inputBg, cursor: 'pointer' }}>
                        <input type="radio" name="payment" checked={paymentType === method} onChange={() => setPaymentType(method)} />
                        <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{method}</span>
                      </label>
                    ))}
                  </div>
                  <div style={{ backgroundColor: colors.inputBg, padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}><span>Total Payable</span><span>₹{totalAmount.toFixed(2)}</span></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setCheckoutStep('address')} style={{ flex: 1, backgroundColor: 'transparent', color: colors.text, border: `1px solid ${colors.text}`, padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
                  <button onClick={handleProceedPayment} style={{ flex: 2, backgroundColor: colors.accent, color: colors.accentText, border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Proceed to Pay</button>
                </div>
              </div>
            )}

            {checkoutStep === 'qr' && (
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0', textAlign: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.85rem', color: colors.subtext, marginBottom: '10px' }}>Scan the QR code below using your PhonePe app to complete payment.</p>
                  
                  <div style={{ backgroundColor: '#111', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=kasa.store@ybl&pn=KASA" alt="PhonePe QR Code" onError={(e) => { e.target.src = fallbackImage; }} style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '6px', backgroundColor: '#fff', padding: '10px' }} />
                    <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: '600', marginTop: '8px', letterSpacing: '0.05em' }}>KASA.pvt.ltd</div>
                  </div>

                  <div style={{ backgroundColor: colors.inputBg, padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.85rem', color: colors.subtext }}>Amount to Pay</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '700', color: colors.text }}>₹{totalAmount.toFixed(2)}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setCheckoutStep('payment')} style={{ flex: 1, backgroundColor: 'transparent', color: colors.text, border: `1px solid ${colors.text}`, padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
                  <button onClick={handlePlaceOrder} style={{ flex: 2, backgroundColor: '#5f259f', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>I Have Paid - Confirm Order</button>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✨</div>
                <h3 style={{ fontSize: '1.5rem', fontFamily: 'serif', marginBottom: '10px' }}>Order Placed Successfully!</h3>
                <p style={{ color: colors.subtext, fontSize: '0.95rem', marginBottom: '30px' }}>Your payment of <strong>₹{totalAmount.toFixed(2)}</strong> via <strong>{paymentType}</strong> was verified. It will be delivered to: <br/><em>{address.street}, {address.city}</em></p>
                <button onClick={() => { setCart([]); setCheckoutStep('cart'); setIsCartOpen(false); setSelectedCategory(null); }} style={{ backgroundColor: colors.accent, color: colors.accentText, border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Continue Shopping</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App
