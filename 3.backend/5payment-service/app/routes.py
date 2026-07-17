from flask import Blueprint, request, jsonify
import random
import string
from . import db
from .models import Payment

payment_bp = Blueprint('payment', __name__)

def generate_transaction_id():
    return 'TXN' + ''.join(random.choices(string.digits, k=12))

@payment_bp.route('/process', methods=['POST'])
def process_payment():
    data = request.get_json()
    
    order_id = data.get('order_id')
    user_id = data.get('user_id')
    amount = data.get('amount')
    payment_method = data.get('payment_method', 'card')
    
    if not all([order_id, user_id, amount]):
        return jsonify({'message': 'order_id, user_id, amount required'}), 400
    
    # Mock payment processing
    transaction_id = generate_transaction_id()
    
    # 90% success rate for demo
    is_success = random.random() < 0.9
    
    new_payment = Payment(
        order_id=order_id,
        user_id=user_id,
        amount=amount,
        payment_method=payment_method,
        status='completed' if is_success else 'failed',
        transaction_id=transaction_id
    )
    
    db.session.add(new_payment)
    db.session.commit()
    
    if is_success:
        return jsonify({
            'message': 'Payment successful',
            'payment': new_payment.to_dict()
        }), 200
    else:
        return jsonify({
            'message': 'Payment failed',
            'payment': new_payment.to_dict()
        }), 400

@payment_bp.route('/', methods=['GET'])
def get_payments():
    user_id = request.args.get('user_id', type=int)
    order_id = request.args.get('order_id', type=int)
    
    query = Payment.query
    
    if user_id:
        query = query.filter_by(user_id=user_id)
    if order_id:
        query = query.filter_by(order_id=order_id)
    
    payments = query.order_by(Payment.created_at.desc()).all()
    return jsonify({'payments': [p.to_dict() for p in payments]}), 200

@payment_bp.route('/<int:id>', methods=['GET'])
def get_payment(id):
    payment = Payment.query.get_or_404(id)
    return jsonify({'payment': payment.to_dict()}), 200

@payment_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'payment-service'}), 200