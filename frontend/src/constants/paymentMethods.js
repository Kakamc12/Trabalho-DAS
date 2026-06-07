export const PAYMENT_METHODS = [
    { value: 'pix', label: 'Pix' },
    { value: 'cartao', label: 'Cartao de Credito' },
    { value: 'boleto', label: 'Boleto' },
]

export const DEFAULT_PAYMENT_METHOD = PAYMENT_METHODS[0].value

export const isSupportedPaymentMethod = (paymentMethod) =>
    PAYMENT_METHODS.some(method => method.value === paymentMethod)

export const getPaymentMethodLabel = (paymentMethod) => {
    const method = PAYMENT_METHODS.find(method => method.value === paymentMethod)
    return method ? method.label : paymentMethod
}
