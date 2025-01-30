import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import styled from 'styled-components';

// Styled Components
const PageTitle = styled.h2`
  color: #DAA520;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
`;

const OrderTable = styled(Table)`
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  thead {
    background-color: #f8f9fa;
  }

  thead th {
    padding: 16px;  /* Increased padding for spacing */
    font-size: 16px; /* Slightly larger text */
    font-weight: bold;
    letter-spacing: 0.5px; /* Adds spacing between letters */
    text-align: center;
  }

  tbody td {
    padding: 14px;  /* Increased padding */
    font-size: 15px;
    text-align: center;
  }

  tbody tr:hover {
    background-color: #f1f1f1;
  }

  .table th, .table td {
    vertical-align: middle;
  }
`;


const OrderBadge = styled(Badge)`
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;

  &.badge-success {
    background-color: #28a745;
  }
  &.badge-warning {
    background-color: #ffc107;
    color: #000;
  }
  &.badge-danger {
    background-color: #dc3545;
  }
`;

const ActionButton = styled(Button)`
  background-color: #DAA520;
  border: none;
  color: #FFFFFF;
  font-size: 14px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: #c7911f;
    color: #FFFFFF;
  }
  margin-right: 8px;
`;

const OrderImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin-right: 10px;
`;

const OrderItem = ({ order, onUpdateStatus }) => (
  <tr>
    <td>{order.orderNumber}</td>
    <td>{order.customerName}</td>
    <td>{order.orderDate}</td>
    <td>
      <OrderBadge
        className={
          order.status === 'Completed' ? 'badge-success' :
          order.status === 'Pending' ? 'badge-warning' : 'badge-danger'
        }
      >
        {order.status}
      </OrderBadge>
    </td>
    <td>
      <ActionButton onClick={() => onUpdateStatus(order)}>
        <FaEdit /> Update Status
      </ActionButton>
    </td>
  </tr>
);

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setUpdatedStatus(order.status);
    setShowModal(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      setOrders(orders.map(order =>
        order.id === selectedOrder.id ? { ...order, status: updatedStatus } : order
      ));
      setShowModal(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <PageTitle>Customer Orders</PageTitle>
          <OrderTable striped bordered hover>
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Customer</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <OrderItem key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
              ))}
            </tbody>
          </OrderTable>
        </Col>
      </Row>

      {/* Modal for updating order status */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleSaveStatus}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default OrderPage;
