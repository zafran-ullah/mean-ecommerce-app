# 🛒 MEAN Stack E-Commerce App

A full-stack e-commerce web application built with Angular, Node.js, Express, and MongoDB. This project supports user authentication, product management, shopping cart, and checkout functionality — with plans for AWS deployment and DevOps tooling.

---

## 📦 Tech Stack

- **Frontend:** Angular, Angular Material, RxJS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens), Role-based access
- **DevOps (Planned):** AWS EC2, S3, CodePipeline, CloudFront, MongoDB Atlas

---

## 🚀 Features

### 🧑‍💻 User Features
- User Registration & Login
- Browse Products, Search & Filter
- View Product Details
- Add to Cart & Checkout
- View Order History

### 🛠 Admin Features
- Admin Login
- Product CRUD (Create, Read, Update, Delete)
- Order Management
- Role-based access control

### 🧾 Future Enhancements
- Stripe/PayPal Payment Integration
- SSR with Angular Universal
- AWS Deployment with CI/CD
- Unit & E2E Testing (Jasmine, Protractor)

---

## 📁 Project Structure

`
mean-ecommerce-app/
  ├── frontend/ # Angular SPA
  │ └── src/app/
  │ ├── components/
  │ ├── pages/
  │ ├── services/
  │ ├── guards/
  │ └── models/
  │
  ├── backend/ # Express API
  │ ├── routes/
  │ ├── models/
  │ ├── controllers/
  │ ├── middleware/
  │ └── server.js


---

## 🧪 Getting Started

### 🔧 Prerequisites
- Node.js v18+
- Angular CLI
- MongoDB (local or Atlas)
- Git

---

### 🖥 Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mean-ecommerce-app.git
cd mean-ecommerce-app

2. Run the Backend

cd backend
npm install
cp .env.example .env     # Add your MONGO_URI and JWT_SECRET
npm run dev

3. Run the Frontend

cd frontend
npm install
ng serve

###🔐 Environment Variables
backend/.env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret

###🧱 Built With
Angular
Node.js
Express
MongoDB
Angular Material
AWS (planned)

###🐳 Planned AWS Deployment (DevOps Roadmap)
Tool	Purpose
S3 + CloudFront	Host frontend (Angular)
EC2 / Elastic Beanstalk	Host backend API
MongoDB Atlas	Managed NoSQL database
AWS CodePipeline	CI/CD for automated deployment
Route53 + SSL	Custom domain & HTTPS
Secrets Manager	Secure storage of API keys & DB creds

###🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first.

###📄 License
MIT

---

