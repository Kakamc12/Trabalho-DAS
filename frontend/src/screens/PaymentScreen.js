import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

function PaymentScreen({ history }) {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('Pix')

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
                        <Form.Check
                            type='radio'
                            label='Pix'
                            id='pix'
                            name='paymentMethod'
                            value='Pix'
                            checked={paymentMethod === 'Pix'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >

                        </Form.Check>

                        <Form.Check
                            type='radio'
                            label='Cartao de Credito'
                            id='credit-card'
                            name='paymentMethod'
                            value='Cartao de Credito'
                            checked={paymentMethod === 'Cartao de Credito'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >

                        </Form.Check>

                        <Form.Check
                            type='radio'
                            label='Boleto'
                            id='boleto'
                            name='paymentMethod'
                            value='Boleto'
                            checked={paymentMethod === 'Boleto'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >

                        </Form.Check>
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
