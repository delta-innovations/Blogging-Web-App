# 🌌 NIVOX - A Quantum-Inspired Personal Blog Platform ✍️
<img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/53357ed85a59fa8173e3e4c096f1e46a4fffc4d5/frontend/src/app/favicon.ico" alt="NIVOX Logo" width="100" height="100">

**🌌NIVOX** is a cutting-edge, full-stack personal blog platform crafted with the MERN Stack (MongoDB, Express.js, React via Next.js, Node.js). It empowers creators to weave their stories through seamless CRUD operations—create, read, update, and delete blog posts—within a futuristic, quantum-inspired realm. 🔐 Fueled by secure JWT authentication, 🚀 optimized with Next.js server-side rendering (SSR) for blazing performance, and 🎨 adorned with a sleek aesthetic powered by Tailwind CSS and custom quantum animations (like latticeDrift and depthGlow), NIVOX is where advanced technology meets boundless creative expression. Step into a blogging experience that feels like traversing the cosmos! 🌠

---
## 🚀 Tech Stack & Tools Used

### Frontend:

- **Next.js** (App Router for navigation, SSR, and static site generation)
- **Tailwind CSS** (Utility-first styling with custom colors: depth-black, lumen-white, lumen-cyan, lumen-magenta)
- **React Hook Form & Zod** (Form handling and validation for blog posts)
- **Tanstack Query** (Data fetching and state management for blog CRUD)
- **Lottie-web** (For animated buttons and icons)
- **Custom Animations** (Quantum-inspired effects like fluxPulse, orbit, quantumPulse)

---

### Backend:

- **Node.js & Express.js** (For handling API routes)
- **JWT** (For authentication)
- **MongoDB & Mongoose** (For database management)
- **Redis** (For caching and performance optimization)

---

### Development & Deployment:

- **Webpack Dev Server** (Live reloading via Next.js)
- **Babel** (Modern JavaScript support via Next.js)
- **Git & GitHub** (Version control)
- **Vercel** (Optional deployment platform for Next.js)
- **Render** (Deployment platform for backend)

---

## 💡 Features

- ✅ **User Authentication:** Secure login/register with JWT.
- ✅ **CRUD Operations:** Create, edit, delete, and view blog posts.
- ✅ **Quantum-Inspired Design:** Infinite-depth lattice backgrounds, glowing effects, and orbiting particles in the navbar.
- ✅ **Copy/Paste Restrictions:** Disabled globally except on create/edit pages to protect content.
- ✅ **Server-Side Rendering:** Optimized performance with Next.js SSR.
- ✅ **Responsive Design:** Mobile-friendly layout with Tailwind CSS.
- ✅ **Dynamic Animations:** Custom effects like latticeDrift, depthGlow, and paneRise for a futuristic UI.
- ✅ **Error Handling:** Robust form validation and user feedback.
- ✅ **MongoDB for scalable database storage**
- ✅ **Redis for caching and performance boost**
---
# 🔒 Security
- ✅ **JWT Authentication:** Secure user sessions with JSON Web Tokens.
- ✅ **Rate Limiting:** Protects against abuse with express-rate-limit (100 requests per 15 minutes per IP).
- ✅ **Data Sanitization:** Uses express-mongo-sanitize and xss-clean to prevent injection attacks.
- ✅ **Helmet:** Adds security headers to protect against common vulnerabilities.
- ✅ **Copy/Paste Protection:** Disabled globally (except on create/edit pages) to safeguard content.

---
# 🌐 Demo
Experience NIVOX live! Visit the deployed application at:
- [NIVOX](https://nivox.vercel.app)
Explore the quantum-inspired design, create your own blog posts, and test the CRUD functionality firsthand.

---
## 📸 Screenshots

- **Logo**:  
  <img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/53357ed85a59fa8173e3e4c096f1e46a4fffc4d5/frontend/src/app/favicon.ico" alt="NIVOX Logo" width="50" height="50">
- **Homepage**: <img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/main/assets/hoem.png" alt="Homepage" width="200">
- **All Blogs**: <img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/main/assets/blogs.png" alt="Navbar" width="200">
- **Create Post**: <img src="https://raw.githubusercontent.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/main/assets/createblog.png" alt="Create Post" width="200">

---
# 📂 Project Setup & Installation

### Prerequisites:
- **Node.js** (v16+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas)
- **Git** (For cloning the repository)
- **npm** or **yarn** (Package manager)

### Backend Setup:

### 1️⃣ Clone the repository:

```bash
git clone https://github.com/sureshbarach2001/NIVOX-Personal-Blog-Platform.git
cd NIVOX-Personal-Blog-Platform
cd backend
```

### 2️⃣ Install dependencies:

```bash
npm install
```

### 3️⃣ Set up environment variables:

**Create** a **.env** file in the **backend** directory and add:

```env
PORT=5000
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
MONGO_URI=your-mongo-uri
REDIS_URL=your-redis-url
```

- Replace your-access-secret and your-refresh-secret with secure random strings (e.g., generate with openssl rand -hex 32).
- Replace your-mongo-uri with your MongoDB connection string (e.g., mongodb://localhost:27017/nivox or a MongoDB Atlas URI).
- Replace your-redis-url with your Redis connection string (e.g., redis://localhost:6379 or a Redis Cloud URI).

### 4️⃣ Start the Back-end server:

```bash
npm start
```

- The backend API will run on http://localhost:5000.

---

---

### Frontend Setup

### 1️⃣ Navigate to Frontend:

- Open New Terminal

```bash
cd NIVOX-Personal-Blog-Platform
cd frontend
```

### 2️⃣ Install dependencies:

```bash
npm install
```

### 3️⃣ Configure next.config.js:

- Create or update **frontend/next.config.js** to allow the external logo:

```bash
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.grok.com", "github.com"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
```

### 3️⃣ Start the development server:

```bash
npm run dev
```

### 4️⃣ This will start the frontend on http://localhost:3000

### 🚀 Access the application:

- **Frontend:** Open your browser and navigate to http://localhost:3000.
- **Backend API:** Accessible at http://localhost:5000/api.
---
# 🚀 Deployment
### Backend Deployment (Render):
**Push to GitHub:** Ensure your backend code is in a GitHub repository.

**Connect to Render:**
- Create a new Web Service on Render.
- Link your GitHub repository.
- Set the build command to npm install and start command to npm start.
- Add environment variables (e.g., PORT, MONGO_URI, ACCESS_TOKEN_SECRET) in Render's dashboard.

**Deploy:** Render will build and deploy your backend (e.g., https://nivox-personal-blog-platform-backend.onrender.com).

### Frontend Deployment (Vercel):
**Push to GitHub:** Ensure your frontend code is in the same or a separate GitHub repository.

**Connect to Vercel:**
- Install the Vercel CLI: npm install -g vercel.
- Run vercel in the frontend directory and follow the prompts to link your GitHub repository.
- Set environment variables (e.g., NEXT_PUBLIC_API_URL=https://nivox-personal-blog-platform-backend.onrender.com) in Vercel’s dashboard.

**Deploy:** Vercel will deploy your frontend (e.g., https://nivox.vercel.app).

---
# 🚀 API Endpoints

- Blogs:

  - **GET /api/blogs:** Fetch all blog posts.
  - **GET /api/blogs/:id:** Fetch a single blog post.
  - **POST /api/blogs:** Create a blog post (JWT required).
  - **PUT /api/blogs/:id:** Update a blog post (JWT required).
  - **DELETE /api/blogs/:id:** Delete a blog post (JWT required).

- Authentication:
  - **POST /api/auth/register:** Register a new user.
  - **POST /api/auth/login:** Login and receive JWT tokens.
---
# 📊 Project Status
- **Current Status:** Beta (Actively maintained and developed).
- **Version:** 1.0.0
- **Last Updated:** March 16, 2025
- **Release**: [v1.0.0](https://github.com/sureshbarach2001/NIVOX-Personal-Blog-Platform/releases/tag/v1.0.0)
---
# ⚠️ Known Issues
- **CORS Issues in Production:** Due to Render's proxy behavior, you might encounter CORS errors when fetching blog data. Ensure the backend's CORS configuration includes the frontend origin (https://nivox.vercel.app) and that Render isn't stripping headers. See this section for deployment details.
- **Browser Compatibility:** Some quantum-inspired animations (e.g., latticeDrift) may not render smoothly on older browsers like IE11. Recommended browsers: Chrome, Firefox, Edge (latest versions).
- **Redis Caching:** Currently implemented for basic performance boosts; further optimization is planned (see Future Enhancements).
---
# 🛠️ Contributing
**Fork the Repository:** Click the "Fork" button on GitHub.
**Clone Your Fork:**
```bash
git clone https://github.com/sureshbarach2001/NIVOX-Personal-Blog-Platform.git
```
**Create a Branch:**
```bash
git checkout -b feature/your-feature-name
```
**Make Changes:** Implement your feature or bug fix.
**Commit and Push:**
```bash
git add .
git commit -m "Add your feature description"
git push origin feature/your-feature-name
```
**Open a Pull Request:** Go to the original repository and create a pull request with a detailed description of your changes.

Please ensure your code follows the project's coding style and includes appropriate tests if applicable.



---
## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
## 📚 Acknowledgments

- **Next.js Documentation:** For SSR and App Router guidance.
- **Tailwind CSS:** For rapid, beautiful styling.
- **MongoDB & Mongoose:** For robust database support.
- **Render & Vercel:** For seamless deployment.
---
## 📂 Tags

#mern #nextjs #express #nodejs #mongodb #fullstack #blog #webdev #jwt #tailwindcss #react #quantumdesign #nivox

---
## 🎨 Design Highlights

- **Navbar:** Features orbiting particles that follow mouse movement, with glowing lumen-cyan accents.
- **Background:** Infinite-depth lattice animation with lumen-white particles pulsing across a depth-black canvas.
- **Forms:** Glowing edges and subtle animations (paneRise, depthEdge) for a futuristic feel.
- **Security:** Copy/paste and right-click disabled outside create/edit pages to protect content.

---
## 🔧 Future Enhancements

- **Caching Optimization:** Expand Redis usage for additional performance boosts.
- **User Notifications:** Integrate React Hot Toast for real-time feedback.
- **Rich Text Editor:** Upgrade the blog content field with a WYSIWYG editor (e.g., TinyMCE or Quill).
- **Dark/Light Mode:** Add theme toggling for user preference.
- **Analytics:** Implement basic usage tracking with a service like Matomo.
- **Multi-Language Support:** Enable internationalization (i18n) for broader reach.
---
# 📞 Contact
- [**Portfolio**](https://sureshbarach2001.vercel.app/)
- [**GitHub:**](https://github.com/sureshbarach2001)
- [**Email:**](mailto:sainnk4831@gmail.com)
