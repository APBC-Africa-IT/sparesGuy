import React, { useState } from 'react';
import { Container, Card, Table, Button, Modal, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';
import styled from 'styled-components';

const Notifications = () => {
    // State Management
    const [notifications, setNotifications] = useState([
        { id: 1, title: "System Update", message: "A new update has been applied to the system.", audience: "all", date: "2024-01-30 10:00 AM" },
        { id: 2, title: "Scheduled Maintenance", message: "The system will undergo maintenance tonight.", audience: "admins", date: "2024-01-28 8:00 PM" }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [currentNotification, setCurrentNotification] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Handle Modal
    const handleShow = (notification) => {
        setCurrentNotification(notification);
        setShowModal(true);
    };
    const handleClose = () => setShowModal(false);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = notifications.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <StyledContainer fluid>
            <StyledCard>
                <Card.Body>
                    <Row className="align-items-center mb-4">
                        <Col>
                            <StyledHeader>Notifications</StyledHeader>
                        </Col>
                    </Row>

                    {/* Notifications Table */}
                    <StyledTable responsive hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Message</th>
                                <th>Audience</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((notification) => (
                                <tr key={notification.id}>
                                    <td>{notification.title}</td>
                                    <td>{notification.message}</td>
                                    <td>{notification.audience}</td>
                                    <td>{notification.date}</td>
                                    <td>
                                        <ActionButton
                                            variant="info"
                                            onClick={() => handleShow(notification)}
                                        >
                                            <FaBell /> View
                                        </ActionButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center">
                        <Pagination>
                            <Pagination.First onClick={() => paginate(1)} />
                            <Pagination.Prev onClick={() => paginate(Math.max(1, currentPage - 1))} />
                            {[...Array(Math.ceil(notifications.length / itemsPerPage))].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => paginate(Math.min(Math.ceil(notifications.length / itemsPerPage), currentPage + 1))} />
                            <Pagination.Last onClick={() => paginate(Math.ceil(notifications.length / itemsPerPage))} />
                        </Pagination>
                    </div>
                </Card.Body>
            </StyledCard>

            {/* Notification Details Modal */}
            <StyledModal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Notification Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentNotification && (
                        <>
                            <p><strong>Title:</strong> {currentNotification.title}</p>
                            <p><strong>Message:</strong> {currentNotification.message}</p>
                            <p><strong>Audience:</strong> {currentNotification.audience}</p>
                            <p><strong>Date:</strong> {currentNotification.date}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </StyledModal>
        </StyledContainer>
    );
};

// Styled Components
const StyledContainer = styled(Container)`
    margin-top: 20px;
`;

const StyledCard = styled(Card)`
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledHeader = styled.h3`
    color: #333;
`;

const StyledTable = styled(Table)`
    margin-top: 20px;
`;

const ActionButton = styled(Button)`
    margin-right: 5px;
`;

const StyledModal = styled(Modal)`
    .modal-header {
        background-color: #f8f9fa;
    }
`;

export default Notifications;
