from abc import ABC, abstractmethod

from django.utils import timezone


class PaymentStrategyError(Exception):
    pass


class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, order, payment_result):
        pass

    def validate_payment_status(self, payment_result):
        payment_status = payment_result.get('status') if payment_result else None

        if payment_status and payment_status.upper() not in ['COMPLETED', 'APPROVED']:
            raise PaymentStrategyError('Payment was not completed')

    def mark_order_as_paid(self, order):
        if order.isPaid:
            raise PaymentStrategyError('Order is already paid')

        order.isPaid = True
        order.paidAt = timezone.now()
        order.save()

        return order


class PixPaymentStrategy(PaymentStrategy):
    def pay(self, order, payment_result):
        self.validate_payment_status(payment_result)
        return self.mark_order_as_paid(order)


class CreditCardPaymentStrategy(PaymentStrategy):
    def pay(self, order, payment_result):
        self.validate_payment_status(payment_result)
        return self.mark_order_as_paid(order)


class BoletoPaymentStrategy(PaymentStrategy):
    def pay(self, order, payment_result):
        self.validate_payment_status(payment_result)
        return self.mark_order_as_paid(order)


class PaymentContext:
    def __init__(self, strategy):
        self.strategy = strategy

    def pay(self, order, payment_result):
        return self.strategy.pay(order, payment_result)


PAYMENT_STRATEGIES = {
    'pix': PixPaymentStrategy,
    'cartao de credito': CreditCardPaymentStrategy,
    'credit card': CreditCardPaymentStrategy,
    'boleto': BoletoPaymentStrategy,
}


def get_payment_strategy(payment_method):
    strategy_class = PAYMENT_STRATEGIES.get((payment_method or '').strip().lower())

    if not strategy_class:
        raise PaymentStrategyError('Payment method is not supported')

    return strategy_class()
