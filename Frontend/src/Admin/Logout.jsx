import React, { useState } from 'react';
import { Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const LogoutButton = styled(Button)`
  background-color: #DAA520;
  border: none;
  color: #FFFFFF;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 5px;
  &:hover {
    background-color: #c7911f;
  }
`;

const PageTitle = styled.h2`
  color: #DAA520;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ConfirmationText = styled.p`
  font-size: 1.1rem;
  color: #000000;
  text-align: center;
`;

const Icon = styled(FaExclamationTriangle)`
  color: #DAA520;
  font-size: 3rem;
  display: block;
  margin: 0 auto 20px;
`;

const Logout = () => {
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();

  // Handle the logout action
  const handleLogout = () => {
    // Remove authentication details
    localStorage.removeItem('authToken'); // Remove stored token
    localStorage.removeItem('user'); // Remove user details if stored

    // Optional: Clear sessionStorage if used
    sessionStorage.clear();

    // Redirect to login page
    navigate('/login');
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center flex-column">
      <PageTitle>Admin Logout</PageTitle>

      {/* Logout Button */}
      <LogoutButton onClick={toggleModal}>
        <FaSignOutAlt style={{ marginRight: '8px' }} />
        Logout
      </LogoutButton>

      {/* Logout Confirmation Modal */}
      <Modal show={showModal} onHide={toggleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            <Icon />
            Are you sure you want to log out?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ConfirmationText>
            You will be logged out of your admin session. Any unsaved data may be lost.
          </ConfirmationText>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Logout;
