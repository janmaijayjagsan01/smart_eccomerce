# Smart Mart 🛒

A microservices-based e-commerce application built with Flask, React, Docker, and Kubernetes.

## 🏗️ Architecture

| Service | Port | Description |
|---------|------|-------------|
| auth-service | 5001 | User authentication (JWT) |
| product-service | 5002 | Product catalog |
| cart-service | 5003 | Shopping cart |
| order-service | 5004 | Order management |
| payment-service | 5005 | Mock payment processing |
| PostgreSQL | 5432 | Database |
| React Frontend | 5173 | User interface |

## 🚀 Quick Start

### Local Development (Docker Compose)

```bash
# Clone and navigate
git clone &lt;your-repo&gt;
cd smart-mart-ecommerce

# Start all services
docker-compose up --build

# Access
Frontend: http://localhost:5173
APIs: http://localhost:5001-5005