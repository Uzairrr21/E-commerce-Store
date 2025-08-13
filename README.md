<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&pause=1000&color=F70000&center=true&vCenter=true&width=600&lines=Ecommerce+Store+%F0%9F%92%B3;Full+Stack+MERN+Application;Professional+and+Scalable"/>
</div>

---

# 🛒 Ecommerce Store

<div align="center">
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Author-Uzairrr21-orange?style=for-the-badge"/>
</div>

---

## 📧 Contact
- **Email:** uzairmoazzam21@gmail.com
- **GitHub:** [Uzairrr21](https://github.com/Uzairrr21)

---

## 🚀 Overview
A modern, scalable, and feature-rich ecommerce platform built with the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates best practices in full-stack development, authentication, state management, and responsive UI.

---

## 🏗️ Project Structure
```
ecommerce-store/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## 🖥️ Frontend (React)
- **Tech:** React, Context API, CSS
- **Features:**
  - Product listing, details, and search
  - Cart management
  - User authentication (login/register)
  - Order checkout and history
  - Admin panel for product management
  - Error boundaries and 404 handling
- **Key Components:**
  - `ProductList`, `Product`, `Cart`, `Checkout`, `OrderHistory`, `AdminPanel`, `Login`, `Register`, `UserProfile`, `Header`, `ErrorBoundary`, `NotFound`
- **State Management:**
  - Context API (`AppContext.js`) for global state
- **Styling:**
  - Responsive design with custom CSS

---

## 🛠️ Backend (Node.js & Express)
- **Tech:** Node.js, Express, MongoDB (Mongoose)
- **Features:**
  - RESTful API for products, users, orders
  - JWT authentication & authorization
  - Error handling middleware
  - Modular controllers and routes
- **Key Files:**
  - `server.js`: Entry point
  - `models/`: Mongoose schemas (`Product.js`, `User.js`, `Order.js`)
  - `controllers/`: Business logic
  - `routes/`: API endpoints
  - `middleware/`: Auth & error handling
  - `config/db.js`: MongoDB connection

---

## 🔒 Authentication & Security
- **JWT-based authentication** for secure login/register
- **Role-based access** for admin features
- **Password hashing** with bcrypt
- **Error handling** for robust API responses

---

## 🗄️ Database (MongoDB)
- **Models:**
  - `User`: Authentication, profile
  - `Product`: Catalog, details
  - `Order`: Cart, checkout, history
- **Connection:**
  - Configured in `config/db.js`

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Uzairrr21/ecommerce-store.git
cd ecommerce-store

# Backend setup
cd backend
npm install
# Create .env file (see below)
npm start

# Frontend setup
cd ../frontend
npm install
npm start
```

---

## ⚙️ Environment Variables
Create a `.env` file in both `backend/` and `frontend/` folders. Example for backend:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## 📋 API Endpoints
- **Products:** `/api/products` (CRUD)
- **Users:** `/api/users` (register, login, profile)
- **Orders:** `/api/orders` (place, view history)

---

## 🖌️ Animations & UI
- **Animated SVG banners** in README
- **Modern, responsive UI** in frontend
- **Loading spinners** and transitions in React components

---

## 🧑‍💻 Author
- **GitHub:** [Uzairrr21](https://github.com/Uzairrr21)
- **Email:** uzairmoazzam21@gmail.com

---

## 🌟 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
This project is licensed under the MIT License.

---

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&pause=1000&color=00F700&center=true&vCenter=true&width=600&lines=Thank+You+for+visiting+the+project!+%F0%9F%91%8B"/>
</div>

---

<div align="center">
  <img src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" width="300"/>
</div>
