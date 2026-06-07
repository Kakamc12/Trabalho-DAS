import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'
import {
    DEFAULT_PAYMENT_METHOD,
    PAYMENT_METHODS,
    isSupportedPaymentMethod,
} from '../constants/paymentMethods'

function PaymentScreen({ history }) {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState(
        isSupportedPaymentMethod(cart.paymentMethod) ? cart.paymentMethod : DEFAULT_PAYMENT_METHOD
    )

    if (!shippingAddress.address) {
        history.push('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />

            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        {PAYMENT_METHODS.map(method => (
                            <Form.Check
                                key={method.value}
                                type='radio'
                                label={method.label}
                                id={method.value}
                                name='paymentMethod'
                                value={method.value}
                                checked={paymentMethod === method.value}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >

                            </Form.Check>
                        ))}
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
