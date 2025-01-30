import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { 
  BsTelephone, 
  BsInstagram, 
  BsTwitter, 
  BsFacebook, 
  BsLinkedin,
  BsArrowUp 
} from "react-icons/bs";
import { FiMail, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [bouncingIcon, setBouncingIcon] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIconClick = (iconName) => {
    setBouncingIcon(iconName);
    setTimeout(() => setBouncingIcon(null), 300); // Remove bounce effect after 300ms
  };

  return (
    <Container fluid style={{ backgroundColor: '#000000', color: '#FFFFFF', paddingTop: '3rem' }}>
      <Container>
        <Row className="gy-4">
          {/* Company Info */}
          <Col lg={3} md={6}>
            <h3 style={{ color: '#DAA520', marginBottom: '1.5rem' }}>MY SPARES GUY</h3>
            <div className="d-flex align-items-center mb-3">
              <FiMapPin className="me-2" style={{ color: '#DAA520' }} />
              <a 
                href="https://www.google.com/maps/place/Ngara,+Nairobi" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#FFFFFF', textDecoration: 'none' }}
              >   11122-Ngara, Nairobi
              </a>
            </div>
            <div className="social-icons d-flex gap-3 mb-3">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform, index) => {
                const icons = {
                  Facebook: <BsFacebook />,
                  Twitter: <BsTwitter />,
                  Instagram: <BsInstagram />,
                  LinkedIn: <BsLinkedin />
                };
                return (
                  <a 
                    key={index}
                    href={`https://www.${platform.toLowerCase()}.com`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => handleIconClick(platform)}
                    style={{ 
                      cursor: 'pointer', 
                      fontSize: '1.5rem',
                      color: '#DAA520',
                      transition: 'transform 0.3s ease'
                    }}
                    className="social-icon"
                  >
                    {icons[platform]}
                  </a>
                );
              })}
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={3} md={6}>
            <h3 style={{ color: '#DAA520', marginBottom: '1.2rem' }}>Quick Links</h3>
            <Row>
              {['Home', 'Shop', 'About', 'Contact Us'].map((link, index) => (
                <Col xs={6} className="mb-2" key={index}>
                  <Link 
                    to={`/${link.replace(/\s+/g, '')}`}  // Convert to camelCase
                    style={{ 
                      color: '#FFFFFF', 
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    className="hover-gold"
                  >
                    {link}
                  </Link>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6}>
            <h3 style={{ color: '#DAA520', marginBottom: '1.5rem' }}>Contact Us</h3>
            <div className="mb-3">
              <a 
                href="tel:+2547123456" 
                style={{ color: '#FFFFFF', textDecoration: 'none' }}
                className="d-flex align-items-center hover-gold"
              >
                <BsTelephone className="me-2" style={{ color: '#DAA520' }} />
                +2547123456
              </a>
            </div>
            <div className="mb-3">
              <a 
                href="mailto:apbcafricait@gmail.com"
                style={{ color: '#FFFFFF', textDecoration: 'none' }}
                className="d-flex align-items-center hover-gold"
              >
                <FiMail className="me-2" style={{ color: '#DAA520' }} />
                apbcafricait@gmail.com
              </a>
            </div>
          </Col>

          {/* Newsletter */}
          <Col lg={3} md={6}>
            <h3 style={{ color: '#DAA520', marginBottom: '1.5rem' }}>Newsletter</h3>
            <p>Get $10 off your first order</p>
            <Form className="mt-3">
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Enter your email"
                  aria-label="Email address"
                  style={{ 
                    backgroundColor: 'transparent',
                    border: '1px solid #DAA520',
                    color: '#FFFFFF'
                  }}
                />
                <Button 
                  variant="outline-warning"
                  style={{ 
                    backgroundColor: '#DAA520',
                    border: 'none',
                    color: '#000000'
                  }}
                >
                  Subscribe
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        <hr style={{ borderColor: '#DAA520', margin: '2rem 0' }} />

        {/* Footer Bottom */}
       

        {/* Scroll to Top Button */}
        <Button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#DAA520',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '0.8',
            transition: 'opacity 0.3s ease'
          }}
        >
          <BsArrowUp />
        </Button>

        <style>
          {`
            .hover-gold:hover {
              color: #DAA520 !important;
            }
            
            .social-icon:hover {
              transform: scale(1.1); /* Grows the icon slightly on hover */
            }

            .bounce {
              animation: bounce 0.3s forwards;
            }

            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
              }
              40% {
                transform: translateY(-10px);
              }
              60% {
                transform: translateY(-5px);
              }
            }
            
            .scroll-top-button:hover {
              opacity: 1 !important;
            }
            
            @media (max-width: 768px) {
              .social-icons {
                justify-content: center;
              }
            }
          `}
        </style>
      </Container>
    </Container>
  );
};

export default Footer;