from flask import Blueprint, request, jsonify
from . import db
from .models import Product

product_bp = Blueprint('product', __name__)

@product_bp.route('/', methods=['GET'])
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Product.query
    
    if category:
        query = query.filter_by(category=category)
    
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))
    
    products = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'products': [p.to_dict() for p in products.items],
        'total': products.total,
        'pages': products.pages,
        'current_page': page
    }), 200

@product_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify({'product': product.to_dict()}), 200

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Product.category).distinct().all()
    return jsonify({'categories': [c[0] for c in categories if c[0]]}), 200

@product_bp.route('/featured', methods=['GET'])
def get_featured():
    featured = Product.query.order_by(Product.rating.desc()).limit(6).all()
    return jsonify({'products': [p.to_dict() for p in featured]}), 200

@product_bp.route('/', methods=['POST'])
def create_product():
    data = request.get_json()
    
    new_product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        category=data.get('category', ''),
        image_url=data.get('image_url', ''),
        stock_quantity=data.get('stock_quantity', 0)
    )
    
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify({'message': 'Product created', 'product': new_product.to_dict()}), 201

@product_bp.route('/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'category' in data:
        product.category = data['category']
    if 'image_url' in data:
        product.image_url = data['image_url']
    if 'stock_quantity' in data:
        product.stock_quantity = data['stock_quantity']
    
    db.session.commit()
    return jsonify({'message': 'Product updated', 'product': product.to_dict()}), 200

@product_bp.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200

@product_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'product-service'}), 200