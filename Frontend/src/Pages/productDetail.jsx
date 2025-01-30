import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import { Row, Col, Button, Nav, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart
import Header from '../Homepage/Header.jsx';
import Footer from '../Homepage/Footer.jsx';
import Reviews from './Reviews';
import Description from './description';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, cartCount } = useCart(); // Use addToCart and cartCount from context
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [inStock, setInStock] = useState(true);

  const socket = io('http://localhost:8000'); 

socket.on('stockUpdate', (data) => {
  console.log('Stock update received:', data);

  // Update the UI based on the stock update
  const productElement = document.getElementById(`product-${data.productId}`);
  if (productElement) {
    productElement.querySelector('.quantity').textContent = data.quantity;
    productElement.querySelector('.stock-status').textContent = data.inStock ? 'In Stock' : 'Out of Stock';
  }
});

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setInStock(data.inStock);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    fetch(`/api/products/${id}/reviews`)
      .then((res) => res.json())
      .then((data) => Reviews(data))
      .catch((err) => console.error('Error fetching reviews:', err));
  }, [id]);

  // Handle quantity changes
  const handleQuantityChange = (action) => {
    if (action === 'increment') setQuantity(quantity + 1);
    else if (action === 'decrement' && quantity > 1) setQuantity(quantity - 1);
  };

  // Handle purchase
  const handlePurchase = async () => {
    try {
      const response = await fetch(`/api/products/${id}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantityPurchased: quantity }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setInStock(updatedProduct.inStock);
        alert('Purchase successful!');
      } else {
        alert('Failed to purchase product.');
      }
    } catch (error) {
      console.error('Error purchasing product:', error);
    }
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = { ...product, quantity };
    addToCart(cartItem); // Use addToCart from context
    setIsAdded(true);
  };

  // Handle tab selection
  const handleTabSelect = (key) => setActiveTab(key);

  if (error) {
    return (
      <>
        <Header cartCount={cartCount} />
        <div className="container mt-4">
          <div className="alert alert-danger">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading || !product) {
    return (
      <>
        <Header cartCount={cartCount} />
        <div className="container mt-4 text-center">Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header cartCount={cartCount} />
      <div className="container mt-4">
        <Row>
          {/* Left Column */}
          <Col md={6}>
            <nav aria-label="breadcrumb" className="breadcrumb-nav mb-3">
              <ol className="breadcrumb" style={{ fontSize: '0.9rem' }}>
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="/products">Shop</a></li>
                <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
              </ol>
            </nav>
            {product.image ? (
              <img
                src={`http://localhost:8000${product.image}`}
                alt={product.name}
                className="img-fluid rounded shadow mb-2"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div className="image-placeholder">Image not available</div>
            )}
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {product.name}
            </h1>
          </Col>

          {/* Right Column */}
          <Col md={6}>
            <h4 className="product-title">{product.name}</h4>
            <p className="text-muted">{product.description}</p>
            <h4 className="product-price text-success">Ksh {product.price}</h4>
            <p className={inStock ? 'text-success' : 'text-danger'}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </p>
            <div className="quantity-controls my-3 d-flex align-items-center">
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange('decrement')}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="mx-2">{quantity}</span>
              <Button variant="outline-secondary" onClick={() => handleQuantityChange('increment')}>
                +
              </Button>
            </div>
            <Button
              variant="primary"
              onClick={handlePurchase}
              disabled={!inStock}
            >
              Buy Now
            </Button>
            <Button onClick={handleAddToCart} disabled={isAdded} className="mt-2">
              {isAdded ? 'Added to Cart' : 'Add to Cart'}
            </Button>
            <div className="product-tabs mt-4">
              <Tab.Container activeKey={activeTab}>
                <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabSelect}>
                  <Nav.Item>
                    <Nav.Link eventKey="description">Description</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="reviews">Reviews</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content className="mt-3">
                  {activeTab === 'description' ? <Description /> : <Reviews />}
                </Tab.Content>
              </Tab.Container>
            </div>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;