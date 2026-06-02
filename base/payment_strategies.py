from abc import ABC, abstractmethod

from django.utils import timezone


class PaymentStrategyError(Exception):
    pass


class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, order, payment_result):
        pass


class PixPaymentStrategy(PaymentStrategy):
    def pay(self, order, payment_result):
        if order.isPaid:
            raise PaymentStrategyError('Order is already paid')

        payment_status = payment_result.get('status') if payment_result else None

        if payment_status and payment_status.upper() not in ['COMPLETED', 'APPROVED']:
            raise PaymentStrategyError('Pix payment was not completed')

        order.isPaid = True
        order.paidAt = timezone.now()
        order.save()

        return order


class PaymentContext:
    def __init__(self, strategy):
        self.strategy = strategy

    def pay(self, order, payment_result):
        return self.strategy.pay(order, payment_result)


PAYMENT_STRATEGIES = {
    'pix': PixPaymentStrategy,
}


def get_payment_strategy(payment_method):
    strategy_class = PAYMENT_STRATEGIES.get((payment_method or '').strip().lower())

    if not strategy_class:
        raise PaymentStrategyError('Payment method is not supported')

    return strategy_class()
