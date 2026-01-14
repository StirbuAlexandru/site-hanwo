import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { FaEnvelope, FaImage, FaTags, FaSignOutAlt, FaTrash, FaCheck, FaPlus, FaEdit, FaTimes, FaTractor, FaQuoteRight, FaStar } from "react-icons/fa";
import { API_URL } from "../config";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("messages");
  
  // Messages state
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // Hero image state
  const [heroImage, setHeroImage] = useState(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [currentHero, setCurrentHero] = useState("");
  const [uploadingHero, setUploadingHero] = useState(false);
  const [storedHeroImages, setStoredHeroImages] = useState([]);
  const [selectedHeroImage, setSelectedHeroImage] = useState(null);
  
  // Promotions state
  const [promotions, setPromotions] = useState([]);
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [newPromo, setNewPromo] = useState({
    title: "",
    price: "",
    oldPrice: "",
    discount: "",
    link: "",
    image: null
  });

  // Products state
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [storedImages, setStoredImages] = useState([]);
  const [selectedStoredImage, setSelectedStoredImage] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    category: "tractoare",
    price: "",
    description: "",
    sort_order: 0,
    mainImage: null,
    additionalImages: []
  });

  // Testimonials state
  const [testimonials, setTestimonials] = useState([]);
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    client_name: "",
    content: "",
    rating: 5,
    location: ""
  });

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("dashboard_token");
    if (token) {
      setIsLoggedIn(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    await Promise.all([
      fetchMessages(),
      fetchHeroImage(),
      fetchPromotions(),
      fetchProducts(),
      fetchStoredImages(),
      fetchStoredHeroImages(),
      fetchTestimonials()
    ]);
  };

  // Fetch stored hero images from Supabase
  const fetchStoredHeroImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stored-hero-images`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("dashboard_token")}` }
      });
      const data = await res.json();
      if (data.ok) {
        setStoredHeroImages(data.images || []);
      }
    } catch (err) {
      console.error("Error fetching stored hero images:", err);
    }
  };

  // Fetch stored images from Supabase
  const fetchStoredImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stored-images`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("dashboard_token")}` }
      });
      const data = await res.json();
      if (data.ok) {
        setStoredImages(data.images || []);
      }
    } catch (err) {
      console.error("Error fetching stored images:", err);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem("dashboard_token", data.token);
        setIsLoggedIn(true);
        setLoginError("");
        loadDashboardData();
      } else {
        setLoginError("Parolă incorectă!");
      }
    } catch (err) {
      setLoginError("Eroare de conexiune la server");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dashboard_token");
    setIsLoggedIn(false);
    setMessages([]);
    setPromotions([]);
  };

  // Messages functions
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`${API_URL}/api/messages`);
      const data = await res.json();
      if (data.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
    setLoadingMessages(false);
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest mesaj?")) return;
    try {
      const res = await fetch(`${API_URL}/api/messages/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem("dashboard_token")}`
        }
      });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/messages/${id}/read`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem("dashboard_token")}`
        }
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
      }
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  // Hero image functions
  const fetchHeroImage = async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings/hero`);
      const data = await res.json();
      if (data.ok && data.heroImage) {
        setCurrentHero(data.heroImage);
      }
    } catch (err) {
      console.error("Error fetching hero image:", err);
    }
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImage(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const uploadHeroImage = async () => {
    if (!heroImage) return;
    setUploadingHero(true);
    
    const formData = new FormData();
    formData.append("heroImage", heroImage);
    
    try {
      const res = await fetch(`${API_URL}/api/settings/hero`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("dashboard_token")}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.ok) {
        setCurrentHero(data.heroImage);
        setHeroImage(null);
        setHeroPreview("");
        alert("Imaginea a fost actualizată cu succes!");
      }
    } catch (err) {
      console.error("Error uploading hero image:", err);
      alert("Eroare la încărcarea imaginii");
    }
    setUploadingHero(false);
  };

  // Promotions functions
  const fetchPromotions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/promotions`);
      const data = await res.json();
      if (data.ok) {
        setPromotions(data.promotions || []);
      }
    } catch (err) {
      console.error("Error fetching promotions:", err);
    }
  };

  const handlePromoImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPromo({ ...newPromo, image: file });
    }
  };

  const resetPromoForm = () => {
    setNewPromo({ title: "", price: "", oldPrice: "", discount: "", link: "", image: null });
    setEditingPromo(null);
    setShowAddPromo(false);
  };

  // Calculate discount percentage automatically
  const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice) return "";
    const old = parseFloat(oldPrice.replace(/,/g, ''));
    const newP = parseFloat(newPrice.replace(/,/g, ''));
    if (isNaN(old) || isNaN(newP) || old <= 0) return "";
    const discount = Math.round(((old - newP) / old) * 100);
    return discount > 0 ? `${discount}%` : "";
  };

  // Update discount when prices change
  const handlePriceChange = (field, value) => {
    const updatedPromo = { ...newPromo, [field]: value };
    
    // Auto-calculate discount if both prices are set
    if (field === 'oldPrice' || field === 'price') {
      const discount = calculateDiscount(
        field === 'oldPrice' ? value : newPromo.oldPrice,
        field === 'price' ? value : newPromo.price
      );
      updatedPromo.discount = discount;
    }
    
    setNewPromo(updatedPromo);
  };

  const addPromotion = async (e) => {
    e.preventDefault();
    console.log("Form submitted", { editingPromo, newPromo });
    
    const formData = new FormData();
    formData.append("title", newPromo.title);
    formData.append("price", newPromo.price);
    formData.append("oldPrice", newPromo.oldPrice);
    formData.append("discount", newPromo.discount);
    formData.append("link", newPromo.link);
    if (newPromo.image) {
      formData.append("image", newPromo.image);
    }
    
    try {
      const url = editingPromo 
        ? `${API_URL}/api/promotions/${editingPromo.id}`
        : `${API_URL}/api/promotions`;
      
      console.log("Sending request to:", url);
      console.log("Method:", editingPromo ? "PUT" : "POST");
        
      const res = await fetch(url, {
        method: editingPromo ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("dashboard_token")}`
        },
        body: formData
      });
      
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
      
      if (data.ok) {
        if (editingPromo) {
          setPromotions(promotions.map(p => p.id === editingPromo.id ? data.promotion : p));
        } else {
          setPromotions([...promotions, data.promotion]);
        }
        resetPromoForm();
        alert(editingPromo ? "Promoție actualizată!" : "Promoție adăugată!");
      } else {
        console.error("Server returned error:", data);
        alert(`Eroare: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error saving promotion:", err);
      alert("Eroare la salvarea promoției: " + err.message);
    }
  };

  const editPromotion = (promo) => {
    setEditingPromo(promo);
    setNewPromo({
      title: promo.name,
      price: promo.new_price,
      oldPrice: promo.old_price || "",
      discount: promo.discount || "",
      link: promo.link || "",
      image: null
    });
    setShowAddPromo(true);
  };

  const deletePromotion = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi această promoție?")) return;
    try {
      const res = await fetch(`${API_URL}/api/promotions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("dashboard_token")}`
        }
      });
      if (res.ok) {
        setPromotions(promotions.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting promotion:", err);
    }
  };

  // Products functions
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      console.log("Products API response:", data);
      if (data.ok) {
        console.log("Products with images:", data.products.map(p => ({ name: p.name, main_image: p.main_image })));
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      slug: "",
      category: "tractoare",
      price: "",
      description: "",
      sort_order: 0,
      mainImage: null,
      additionalImages: []
    });
    setEditingProduct(null);
    setSelectedStoredImage(null);
  };

  const handleProductImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'main') {
      setProductForm({ ...productForm, mainImage: files[0] });
    } else {
      setProductForm({ ...productForm, additionalImages: [...productForm.additionalImages, ...files] });
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = productForm.additionalImages.filter((_, i) => i !== index);
    setProductForm({ ...productForm, additionalImages: newImages });
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("slug", productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    formData.append("category", productForm.category);
    formData.append("price", productForm.price);
    formData.append("description", productForm.description);
    formData.append("sort_order", productForm.sort_order);
    
    // Use selected stored image URL or upload new file
    if (selectedStoredImage) {
      formData.append("mainImageUrl", selectedStoredImage);
    } else if (productForm.mainImage) {
      formData.append("mainImage", productForm.mainImage);
    }
    
    productForm.additionalImages.forEach((img, i) => {
      if (img instanceof File) {
        formData.append(`${editingProduct ? 'newImage' : 'image'}${i}`, img);
      }
    });

    if (editingProduct && editingProduct.images) {
      const existingImages = productForm.additionalImages.filter(img => typeof img === 'string');
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    try {
      const url = editingProduct 
        ? `${API_URL}/api/products/${editingProduct.id}`
        : `${API_URL}/api/products`;
      
      const res = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("dashboard_token")}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (data.ok) {
        if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? data.product : p));
        } else {
          setProducts([...products, data.product]);
        }
        resetProductForm();
        setShowAddProduct(false);
        alert(editingProduct ? "Produs actualizat!" : "Produs adăugat!");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Eroare la salvarea produsului");
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      description: product.description || "",
      sort_order: product.sort_order || 0,
      mainImage: null,
      additionalImages: product.images || []
    });
    setShowAddProduct(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest produs?")) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("dashboard_token")}`
        }
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Testimonials functions
  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/api/testimonials`);
      const data = await res.json();
      if (data.ok) {
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  };

  const saveTestimonial = async (e) => {
    e.preventDefault();
    try {
      const url = editingTestimonial 
        ? `${API_URL}/api/testimonials/${editingTestimonial.id}`
        : `${API_URL}/api/testimonials`;
      
      const res = await fetch(url, {
        method: editingTestimonial ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("dashboard_token")}`
        },
        body: JSON.stringify(testimonialForm)
      });
      
      const data = await res.json();
      if (data.ok) {
        await fetchTestimonials();
        setShowAddTestimonial(false);
        setEditingTestimonial(null);
        setTestimonialForm({
          client_name: "",
          content: "",
          rating: 5,
          location: ""
        });
      }
    } catch (err) {
      console.error("Error saving testimonial:", err);
      alert("Eroare la salvare!");
    }
  };

  const editTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      client_name: testimonial.client_name,
      content: testimonial.content,
      rating: testimonial.rating,
      location: testimonial.location || ""
    });
    setShowAddTestimonial(true);
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest testimonial?")) return;
    try {
      const res = await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("dashboard_token")}`
        }
      });
      if (res.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error("Error deleting testimonial:", err);
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="dashboard-login">
        <div className="login-card">
          <h1>🔐 Admin Dashboard</h1>
          <p>Introduceți parola pentru a accesa panoul de administrare</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && <div className="login-error">{loginError}</div>}
            <button type="submit">Autentificare</button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>🚜 HANWO Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={activeTab === "messages" ? "active" : ""} 
            onClick={() => setActiveTab("messages")}
          >
            <FaEnvelope /> Mesaje
            {messages.filter(m => !m.is_read).length > 0 && (
              <span className="badge">{messages.filter(m => !m.is_read).length}</span>
            )}
          </button>
          <button 
            className={activeTab === "hero" ? "active" : ""} 
            onClick={() => setActiveTab("hero")}
          >
            <FaImage /> Imagine Principală
          </button>
          <button 
            className={activeTab === "promotions" ? "active" : ""} 
            onClick={() => setActiveTab("promotions")}
          >
            <FaTags /> Promoții
          </button>
          <button 
            className={activeTab === "products" ? "active" : ""} 
            onClick={() => setActiveTab("products")}
          >
            <FaTractor /> Produse
          </button>
          <button 
            className={activeTab === "testimonials" ? "active" : ""} 
            onClick={() => setActiveTab("testimonials")}
          >
            <FaQuoteRight /> Testimoniale
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Deconectare
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>📩 Mesaje Primite</h1>
              <button className="refresh-btn" onClick={fetchMessages}>
                Reîncarcă
              </button>
            </div>
            
            {loadingMessages ? (
              <div className="loading">Se încarcă...</div>
            ) : messages.length === 0 ? (
              <div className="empty-state">Nu există mesaje</div>
            ) : (
              <div className="messages-list">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-card ${msg.is_read ? 'read' : 'unread'}`}>
                    <div className="message-header">
                      <div>
                        <strong>{msg.name}</strong>
                        <span className="message-email">{msg.email}</span>
                        {msg.phone && <span className="message-phone">📞 {msg.phone}</span>}
                      </div>
                      <div className="message-meta">
                        <span className="message-date">
                          {new Date(msg.created_at).toLocaleString('ro-RO')}
                        </span>
                        {msg.product && <span className="message-product">🚜 {msg.product}</span>}
                        <span className="message-source">{msg.source}</span>
                      </div>
                    </div>
                    <div className="message-body">
                      {msg.message}
                    </div>
                    <div className="message-actions">
                      {!msg.is_read && (
                        <button className="btn-read" onClick={() => markAsRead(msg.id)}>
                          <FaCheck /> Marchează citit
                        </button>
                      )}
                      <button className="btn-delete" onClick={() => deleteMessage(msg.id)}>
                        <FaTrash /> Șterge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hero Image Tab */}
        {activeTab === "hero" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>🖼️ Imagine Principală (Hero)</h1>
            </div>
            
            <div className="hero-section">
              <div className="current-hero">
                <h3>Imagine Curentă:</h3>
                {currentHero ? (
                  <img src={currentHero.startsWith('http') ? currentHero : `${API_URL}${currentHero}`} alt="Current Hero" />
                ) : (
                  <div className="no-image">Nu există imagine setată</div>
                )}
              </div>
              
              <div className="upload-hero">
                <h3>Încarcă Imagine Nouă:</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleHeroImageChange(e);
                    setSelectedHeroImage(null);
                  }}
                  id="hero-upload"
                />
                <label htmlFor="hero-upload" className="upload-label">
                  <FaImage /> Selectează Imagine
                </label>
                
                {heroPreview && (
                  <div className="hero-preview">
                    <h4>Previzualizare:</h4>
                    <img src={heroPreview} alt="Preview" />
                    <button 
                      className="upload-btn" 
                      onClick={uploadHeroImage}
                      disabled={uploadingHero}
                    >
                      {uploadingHero ? "Se încarcă..." : "Salvează Imaginea"}
                    </button>
                  </div>
                )}

                {selectedHeroImage && (
                  <div className="hero-preview">
                    <h4>✓ Imagine selectată din galerie:</h4>
                    <img src={selectedHeroImage} alt="Selected" style={{border: '3px solid #28a745'}} />
                    <button 
                      className="upload-btn" 
                      onClick={async () => {
                        setUploadingHero(true);
                        try {
                          const res = await fetch(`${API_URL}/api/hero-image-url`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem("dashboard_token")}`
                            },
                            body: JSON.stringify({ url: selectedHeroImage })
                          });
                          const data = await res.json();
                          if (data.ok) {
                            setCurrentHero(selectedHeroImage);
                            setSelectedHeroImage(null);
                            alert('✓ Imaginea a fost salvată!');
                          }
                        } catch (err) {
                          console.error('Error saving hero image:', err);
                          alert('Eroare la salvare!');
                        }
                        setUploadingHero(false);
                      }}
                      disabled={uploadingHero}
                    >
                      {uploadingHero ? "Se salvează..." : "Folosește Această Imagine"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setSelectedHeroImage(null)} 
                      style={{marginLeft: '10px', background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}
                    >
                      Anulează
                    </button>
                  </div>
                )}
              </div>

              {/* Imagini hero anterioare */}
              {storedHeroImages.length > 0 && (
                <div className="stored-images-row" style={{marginTop: '30px'}}>
                  <h3 style={{marginBottom: '15px'}}>🖼️ Sau alege din imaginile anterioare:</h3>
                  <div className="stored-images-list">
                    {storedHeroImages.map((img, index) => (
                      <div 
                        key={index} 
                        className={`stored-image-thumb ${selectedHeroImage === img.url ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedHeroImage(img.url);
                          setHeroPreview('');
                          setHeroImage(null);
                        }}
                        title={img.name}
                      >
                        <img src={img.url} alt={img.name} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Promotions Tab */}
        {activeTab === "promotions" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>🏷️ Promoții HANWO</h1>
              <button className="add-btn" onClick={() => setShowAddPromo(true)}>
                <FaPlus /> Adaugă Promoție
              </button>
            </div>

            {/* Add/Edit Promotion Modal */}
            {showAddPromo && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h2>{editingPromo ? "Editează Promoție" : "Adaugă Promoție Nouă"}</h2>
                    <button className="close-btn" onClick={resetPromoForm}>
                      <FaTimes />
                    </button>
                  </div>
                  <form onSubmit={addPromotion} className="promo-form">
                    <div className="form-group">
                      <label>Titlu Produs:</label>
                      <input
                        type="text"
                        value={newPromo.title}
                        onChange={(e) => setNewPromo({...newPromo, title: e.target.value})}
                        placeholder="ex: Tractor HANWO 504"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Preț Vechi (lei):</label>
                        <input
                          type="text"
                          value={newPromo.oldPrice}
                          onChange={(e) => handlePriceChange('oldPrice', e.target.value)}
                          placeholder="ex: 120,000"
                        />
                      </div>
                      <div className="form-group">
                        <label>Preț Nou (lei):</label>
                        <input
                          type="text"
                          value={newPromo.price}
                          onChange={(e) => handlePriceChange('price', e.target.value)}
                          placeholder="ex: 99,900"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Reducere (se calculează automat):</label>
                      <input
                        type="text"
                        value={newPromo.discount}
                        readOnly
                        placeholder="Se va calcula automat"
                        style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Link Produs:</label>
                      <input
                        type="text"
                        value={newPromo.link}
                        onChange={(e) => setNewPromo({...newPromo, link: e.target.value})}
                        placeholder="ex: /produse/tractoare/tractor-hanwo-504"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Imagine Produs: {editingPromo && "(lasă gol pentru a păstra imaginea curentă)"}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePromoImageChange}
                      />
                      {editingPromo && editingPromo.image && (
                        <div className="current-image-preview">
                          <p style={{marginTop: '10px', color: '#666'}}>Imagine curentă:</p>
                          <img src={editingPromo.image.startsWith('http') ? editingPromo.image : `${API_URL}${editingPromo.image}`} alt="Current" style={{maxWidth: '150px', marginTop: '5px'}} />
                        </div>
                      )}
                    </div>
                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={resetPromoForm}>Anulează</button>
                      <button type="submit" className="submit-btn">{editingPromo ? "Salvează Modificările" : "Salvează Promoția"}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Promotions List */}
            <div className="promotions-grid">
              {promotions.length === 0 ? (
                <div className="empty-state">Nu există promoții active</div>
              ) : (
                promotions.map((promo) => (
                  <div key={promo.id} className="promo-card">
                    {promo.image && (
                      <img src={promo.image.startsWith('http') ? promo.image : `${API_URL}${promo.image}`} alt={promo.name} />
                    )}
                    <div className="promo-info">
                      <h3>{promo.name}</h3>
                      {promo.discount && <span className="discount-badge">-{promo.discount}</span>}
                      <div className="promo-prices">
                        {promo.old_price && <span className="old-price">{promo.old_price} lei</span>}
                        <span className="new-price">{promo.new_price} lei</span>
                      </div>
                      {promo.link && <p className="promo-link-display">Link: {promo.link}</p>}
                    </div>
                    <div className="product-actions">
                      <button className="edit-btn" onClick={() => editPromotion(promo)}>
                        <FaEdit /> Editează
                      </button>
                      <button className="delete-btn" onClick={() => deletePromotion(promo.id)}>
                        <FaTrash /> Şterge
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>🚜 Produse</h1>
              <button className="add-btn" onClick={() => { resetProductForm(); setShowAddProduct(true); }}>
                <FaPlus /> Adaugă Produs
              </button>
            </div>

            {/* Add/Edit Product Modal */}
            {showAddProduct && (
              <div className="modal-overlay">
                <div className="modal modal-large">
                  <div className="modal-header">
                    <h2>{editingProduct ? "Editează Produs" : "Adaugă Produs Nou"}</h2>
                    <button className="close-btn" onClick={() => { setShowAddProduct(false); resetProductForm(); }}>
                      <FaTimes />
                    </button>
                  </div>
                  <form onSubmit={saveProduct} className="product-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nume Produs: *</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          placeholder="ex: Tractor 50 CAI HANWO 504"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Slug (URL):</label>
                        <input
                          type="text"
                          value={productForm.slug}
                          onChange={(e) => setProductForm({...productForm, slug: e.target.value})}
                          placeholder="ex: tractor-hanwo-504"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Preț (doar număr): *</label>
                        <input
                          type="text"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          placeholder="ex: 99,900.00 (se va adăuga automat 'Lei')"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Descriere:</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        rows="6"
                        placeholder="Descrierea completă a produsului..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Imagine Principală: {editingProduct && "(lasă gol pentru a păstra imaginea curentă)"}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductImageChange(e, 'main')}
                      />
                      {editingProduct && editingProduct.main_image && (
                        <div className="current-image-preview">
                          <p style={{marginTop: '10px', color: '#666'}}>Imagine curentă:</p>
                          <img src={editingProduct.main_image} alt="Current" style={{maxWidth: '150px', marginTop: '5px'}} />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Imagini Adiționale (galerie):</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleProductImageChange(e, 'additional')}
                      />
                      <div className="additional-images-preview">
                        {productForm.additionalImages.map((img, index) => (
                          <div key={index} className="preview-image">
                            <img 
                              src={img instanceof File ? URL.createObjectURL(img) : img} 
                              alt={`Additional ${index}`} 
                            />
                            <button type="button" onClick={() => removeAdditionalImage(index)}>
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => { setShowAddProduct(false); resetProductForm(); }}>Anulează</button>
                      <button type="submit" className="submit-btn">
                        {editingProduct ? "Salvează Modificările" : "Adaugă Produsul"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="products-grid">
              {products.length === 0 ? (
                <div className="empty-state">Nu există produse. Adaugă primul produs!</div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="product-card">
                    {product.main_image ? (
                      <img 
                        src={product.main_image}
                        alt={product.name}
                        style={{display: 'block', width: '100%', height: '200px', objectFit: 'cover', backgroundColor: '#f5f5f5'}}
                        onError={(e) => {
                          console.log('Image error:', product.main_image);
                          e.target.style.display = 'none';
                        }}
                        onLoad={(e) => console.log('Image loaded successfully:', product.main_image)}
                      />
                    ) : (
                      <div style={{height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'}}>Fără imagine</div>
                    )}
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <span className="product-category">{product.category}</span>
                      <span className="product-price">{product.price} Lei</span>
                    </div>
                    <div className="product-actions">
                      <button className="edit-btn" onClick={() => editProduct(product)}>
                        <FaEdit /> Editează
                      </button>
                      <button className="delete-btn" onClick={() => deleteProduct(product.id)}>
                        <FaTrash /> Șterge
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === "testimonials" && (
          <div className="tab-content">
            <div className="tab-header">
              <h1>💬 Testimoniale Clienți</h1>
              <button className="add-btn" onClick={() => {
                setShowAddTestimonial(!showAddTestimonial);
                if (showAddTestimonial) {
                  setEditingTestimonial(null);
                  setTestimonialForm({ client_name: "", content: "", rating: 5, location: "" });
                }
              }}>
                {showAddTestimonial ? <><FaTimes /> Anulează</> : <><FaPlus /> Adaugă Testimonial</>}
              </button>
            </div>

            {/* Add/Edit Testimonial Form */}
            {showAddTestimonial && (
              <div className="add-form-overlay">
                <div className="add-form-modal">
                  <h2>{editingTestimonial ? "Editează Testimonial" : "Adaugă Testimonial Nou"}</h2>
                  <form onSubmit={saveTestimonial}>
                    <div className="form-group">
                      <label>Nume Client: *</label>
                      <input
                        type="text"
                        value={testimonialForm.client_name}
                        onChange={(e) => setTestimonialForm({...testimonialForm, client_name: e.target.value})}
                        placeholder="ex: Ion Popescu"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Locație (opțional):</label>
                      <input
                        type="text"
                        value={testimonialForm.location}
                        onChange={(e) => setTestimonialForm({...testimonialForm, location: e.target.value})}
                        placeholder="ex: București, România"
                      />
                    </div>
                    <div className="form-group">
                      <label>Rating (1-5 stele): *</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar 
                            key={star}
                            onClick={() => setTestimonialForm({...testimonialForm, rating: star})}
                            style={{
                              cursor: 'pointer',
                              color: star <= testimonialForm.rating ? '#ffc107' : '#ddd',
                              fontSize: '30px',
                              marginRight: '5px'
                            }}
                          />
                        ))}
                        <span style={{marginLeft: '10px', fontSize: '18px'}}>{testimonialForm.rating}/5</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Testimonial: *</label>
                      <textarea
                        value={testimonialForm.content}
                        onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                        rows="5"
                        placeholder="Ce spun clienții despre noi..."
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" onClick={() => {
                        setShowAddTestimonial(false);
                        setEditingTestimonial(null);
                        setTestimonialForm({ client_name: "", content: "", rating: 5, location: "" });
                      }}>Anulează</button>
                      <button type="submit" className="submit-btn">
                        {editingTestimonial ? "Salvează Modificările" : "Adaugă Testimonial"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Testimonials List */}
            <div className="testimonials-list">
              {testimonials.length === 0 ? (
                <div className="empty-state">Nu există testimoniale. Adaugă primul testimonial!</div>
              ) : (
                testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card">
                    <div className="testimonial-header">
                      <div>
                        <h3>{testimonial.client_name}</h3>
                        {testimonial.location && <span className="testimonial-location">📍 {testimonial.location}</span>}
                      </div>
                      <div className="testimonial-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} style={{color: i < testimonial.rating ? '#ffc107' : '#ddd'}} />
                        ))}
                      </div>
                    </div>
                    <div className="testimonial-content">
                      <FaQuoteRight style={{color: '#ddd', fontSize: '30px', marginBottom: '10px'}} />
                      <p>{testimonial.content}</p>
                    </div>
                    <div className="testimonial-meta">
                      <span className="testimonial-date">
                        {new Date(testimonial.created_at).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                    <div className="testimonial-actions">
                      <button className="edit-btn" onClick={() => editTestimonial(testimonial)}>
                        <FaEdit /> Editează
                      </button>
                      <button className="delete-btn" onClick={() => deleteTestimonial(testimonial.id)}>
                        <FaTrash /> Șterge
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
