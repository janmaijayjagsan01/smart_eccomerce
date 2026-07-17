from flask import Blueprint, request, jsonify
from . import db
from .models import CartItem

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
def get_cart():
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({'message': 'user_id required'}), 400
    
    items = CartItem.query.filter_by(user_id=user_id).all()
    return jsonify({'cart_items': [item.to_dict() for item in items]}), 200

@cart_bp.route('/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    
    user_id = data.get('user_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not user_id or not product_id:
        return jsonify({'message': 'user_id and product_id required'}), 400
    
    existing = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    
    if existing:
        existing.quantity += quantity
        db.session.commit()
        return jsonify({'message': 'Cart updated', 'item': existing.to_dict()}), 200
    
    new_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
    db.session.add(new_item)
    db.session.commit()
    
    return jsonify({'message': 'Added to cart', 'item': new_item.to_dict()}), 201

@cart_bp.route('/update/<int:item_id>', methods=['PUT'])
def update_cart_item(item_id):
    data = request.get_json()
    item = CartItem.query.get_or_404(item_id)
    
    if 'quantity' in data:
        if data['quantity'] <= 0:
            db.session.delete(item)
            db.session.commit()
            return jsonify({'message': 'Item removed from cart'}), 200
        item.quantity = data['quantity']
    
    db.session.commit()
    return jsonify({'message': 'Cart updated', 'item': item.to_dict()}), 200

@cart_bp.route('/remove/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    item = CartItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item removed from cart'}), 200

@cart_bp.route('/clear', methods=['DELETE'])
def clear_cart():
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({'message': 'user_id required'}), 400
    
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({'message': 'Cart cleared'}), 200

@cart_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'cart-service'}), 200