import { useState, useEffect } from 'react';
import { Form, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import mpesa from '../Homepage/HomepageImages/mpesa.svg';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useGetPaypalClientIdQuery } from "../slices/transactionApiSlice";
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '../slices/OrderApiSlice';
import { toast } from 'react-toastify';

const Payment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // Fetch PayPal client ID and order details
    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();
    const { data: order, isLoading: loadingOrder, error: errorOrder } = useGetOrderByIdQuery(orderId);

    const [updateOrder] = useUpdateOrderMutation();

    const [validated, setValidated] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({ location: '', residence: '' });
    const [paymentMethod, setPaymentMethod] = useState('');

    // Set the PayPal client ID from fetched data or fallback to hardcoded one
    const clientId = paypal?.clientId || 'YOUR_FALLBACK_CLIENT_ID';

    useEffect(() => {
        if (order) {
            setShippingAddress(order.shippingAddress || { location: '', residence: '' });
            setPaymentMethod(order.paymentMethod || '');
        }
    }, [order]);

    const counties = [
        // Simplified county list for readability
        "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu"
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (!paymentMethod) {
                toast.error("Please select a payment method");
                return;
            }

            const updatedOrderData = {
                shippingAddress,
                paymentMethod,
                isPaid: paymentMethod === 'PayPal',
                datePaid: paymentMethod === 'PayPal' ? new Date() : null,
                orderStatus: paymentMethod === 'PayPal' ? 'Completed' : 'Pending',
            };

            try {
                await updateOrder({ id: orderId, ...updatedOrderData }).unwrap();
                if (paymentMethod === 'Cash on Delivery') {
                    navigate('/success');
                }
            } catch (error) {
                console.error('Error updating order:', error);
                toast.error('An error occurred while updating the order.');
            }
        }
        setValidated(true);
    };

    const createOrderPayPal = (data, actions) => {
        return actions.order.create({
            purchase_units: [{ amount: { value: order.totalAmount.toString() } }]
        });
    };

    const onApprove = () => {
        navigate('/success', { state: { orderId, isPaid: true, datePaid: new Date(), paymentMethod: 'PayPal' } });
    };

    const onError = (error) => {
        toast.error("Payment Failed");
        console.error("PayPal Payment Error:", error);
    };

    if (loadingOrder || loadingPayPal) {
        return <p>Loading...</p>; // Show loading state
    }

    if (errorOrder) {
        toast.error("Failed to fetch order details");
        return <p>Error loading order details</p>;
    }

    if (errorPayPal) {
        toast.error("Failed to load PayPal client ID");
        return <p>Error loading PayPal</p>;
    }

    return (
        <PayPalScriptProvider options={{ 'client-id': clientId, currency: 'USD' }}>
            <Header />
            <h2>Order# {orderId}</h2>
            <div className="checkout-container d-flex justify-content-center">
                <Row className="w-75">
                    <Col md={8}>
                        <Card className="p-3 mb-3">
                            <Card.Title className="text-center">Delivery Information</Card.Title>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control required type="text" placeholder="Enter Your Name" defaultValue={order.customerId?.name || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control required type="email" placeholder="Enter your email address" defaultValue={order.customerId?.email || ''} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formMobile">
                                            <Form.Label>Mobile</Form.Label>
                                            <Form.Control required type="text" placeholder="Enter mobile number" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formCity">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control as="select" required value={shippingAddress.location} onChange={(e) => setShippingAddress({ ...shippingAddress, location: e.target.value })}>
                                                <option value="">Select city</option>
                                                {counties.map((county, index) => (
                                                    <option key={index} value={county}>{county}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group controlId="formBuilding">
                                    <Form.Label>Building</Form.Label>
                                    <Form.Control type="text" placeholder="Enter building name" value={shippingAddress.residence} onChange={(e) => setShippingAddress({ ...shippingAddress, residence: e.target.value })} />
                                </Form.Group>
                                <Button type="submit" className="mt-3">Proceed to Payment</Button>
                            </Form>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="p-3">
                            <Card.Title className="text-center">Payment Method</Card.Title>
                            <ListGroup variant='flush'>
                                <ListGroup.Item className="text-center">
                                    <h2>Payment Method</h2>
                                    <p><strong>Method: </strong> PayPal</p>
                                    {clientId && (
                                        <PayPalButtons createOrder={createOrderPayPal} onApprove={onApprove} onError={onError} />
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center mb-2">
                                    <input type="radio" name="paymentMethod" id="cashOnDelivery" value="Cash on Delivery" onChange={(e) => setPaymentMethod(e.target.value)} />
                                    Cash on Delivery
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center mb-2">
                                    <input type="radio" name="paymentMethod" id="mpesa" disabled />
                                    <img src={mpesa} alt="Mpesa" width={24} height={24} className="me-2" />
                                    Mpesa
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Footer />
        </PayPalScriptProvider>
    );
};

export default Payment;
