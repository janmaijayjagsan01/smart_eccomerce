from flask import Blueprint, request, jsonify
from . import db
from .models import Order, OrderItem

order_bp = Blueprint('order', __name__)

@order_bp.route('/', methods=['GET'])
def get_orders():
    user_id = request.args.get('user_id', type=int)
    
    if user_id:
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.order_by(Order.created_at.desc()).all()
    
    result = []
    for order in orders:
        order_dict = order.to_dict()
        items = OrderItem.query.filter_by(order_id=order.id).all()
        order_dict['items'] = [item.to_dict() for item in items]
        result.append(order_dict)
    
    return jsonify({'orders': result}), 200

@order_bp.route('/<int:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get_or_404(id)
    order_dict = order.to_dict()
    items = OrderItem.query.filter_by(order_id=order.id).all()
    order_dict['items'] = [item.to_dict() for item in items]
    return jsonify({'order': order_dict}), 200

@order_bp.route('/create', methods=['POST'])
def create_order():
    data = request.get_json()
    
    user_id = data.get('user_id')
    items = data.get('items', [])
    shipping_address = data.get('shipping_address', '')
    
    if not user_id or not items:
        return jsonify({'message': 'user_id and items required'}), 400
    
    total_amount = sum(item['price'] * item['quantity'] for item in items)
    
    new_order = Order(
        user_id=user_id,
        total_amount=total_amount,
        status='pending',
        shipping_address=shipping_address
    )
    db.session.add(new_order)
    db.session.flush()
    
    for item in items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item['product_id'],
            product_name=item.get('product_name', ''),
            price=item['price'],
            quantity=item['quantity']
        )
        db.session.add(order_item)
    
    db.session.commit()
    
    order_dict = new_order.to_dict()
    order_items = OrderItem.query.filter_by(order_id=new_order.id).all()
    order_dict['items'] = [item.to_dict() for item in order_items]
    
    return jsonify({'message': 'Order created', 'order': order_dict}), 201

@order_bp.route('/<int:id>/status', methods=['PUT'])
def update_status(id):
    data = request.get_json()
    order = Order.query.get_or_404(id)
    
    if 'status' in data:
        order.status = data['status']
    
    db.session.commit()
    return jsonify({'message': 'Status updated', 'order': order.to_dict()}), 200

@order_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'order-service'}), 200