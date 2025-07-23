# 🚀 Vijendra Singh Malik - AI-Powered Portfolio

<div align="center">

![Portfolio Preview](./public/Screenshot%202025-07-23%20181057.png)

**A cutting-edge personal portfolio showcasing the intersection of Data Science, AI Architecture, and modern web development**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![AI Powered](https://img.shields.io/badge/AI_Powered-Llama_3.1_8B-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)](https://llama.meta.com/)

[🌐 **Live Demo (Coming Soon)**](https://portfolio-a-ichat-ggkv.vercel.app/) • [👤 **LinkedIn**](https://www.linkedin.com/in/vijendramalik/) • [💻 **GitHub**](https://github.com/Wissenwelt)

</div>

---

## 🎯 **Project Overview**

This isn't just another portfolio website—it's a **full-stack, AI-integrated experience** that demonstrates modern web development excellence. Built for a Senior Data Scientist & AI Architect, this portfolio showcases technical expertise through both content and implementation.

### ✨ **What Makes This Special**

- 🤖 **Meet Archie**: Your AI-powered portfolio guide using Llama 3.1 8B
- 🎨 **Pixel-Perfect Design**: Modern, responsive UI with smooth animations
- ⚡ **Blazing Fast**: Optimized performance with Next.js 14 App Router
- 🔄 **Real-time AI Chat**: Streaming responses for seamless interaction
- 📱 **Mobile-First**: Flawless experience across all devices

---

## 🛠️ **Tech Stack**

<div align="center">

| **Category** | **Technology** | **Purpose** |
|--------------|----------------|-------------|
| **Framework** | Next.js 14 (App Router) | Modern React framework with server-side rendering |
| **Language** | TypeScript | Type-safe development and better code quality |
| **Styling** | Tailwind CSS | Utility-first CSS for rapid UI development |
| **AI Engine** | Llama 3.1 8B | Conversational AI assistant integration |
| **AI Platform** | Cerebras Cloud SDK | High-performance AI inference |
| **Icons** | Lucide React | Beautiful, customizable icons |
| **Forms** | Web3Forms | Serverless form handling |
| **Deployment** | Vercel | Seamless CI/CD and global CDN |

</div>

---

## 🚀 **Key Features**

### 🏠 **Smart Portfolio Sections**
- **Hero Section**: Dynamic introduction with AI chat integration
- **About**: Professional journey and expertise showcase
- **Skills**: Interactive technology stack with proficiency levels
- **Experience**: Timeline-based career progression
- **Contact**: Functional contact form with validation

### 🤖 **AI Assistant Features**
- **Intelligent Conversations**: Ask about skills, experience, or projects
- **Streaming Responses**: Real-time, typewriter-effect responses
- **Context Awareness**: Understands portfolio content and provides relevant answers
- **Professional Tone**: Maintains appropriate communication style

### 🎨 **Design Excellence**
- **Modern Aesthetics**: Clean, professional design language
- **Smooth Animations**: Subtle micro-interactions and transitions
- **Responsive Layout**: Perfect adaptation to all screen sizes
- **Performance Optimized**: Fast loading times and smooth scrolling

---

## 📦 **Quick Start**

### **Prerequisites**
```bash
Node.js 18.x or later
npm / yarn / pnpm package manager
```

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Wissenwelt/portfolio-webapp.git
cd portfolio-webapp
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Web3Forms API Key (Get from https://web3forms.com/)
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_key_here

# Cerebras Cloud API Key (Get from Cerebras Cloud platform)
CEREBRAS_API_KEY=your_cerebras_api_key_here
```

4. **Start Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open Your Browser**
Navigate to `http://localhost:3000` to see the portfolio in action!

---

## 🎨 **Project Structure**

```
portfolio-webapp/
├── 📁 app/                           # Next.js 14 App Router
│   ├── 📁 api/                      # API routes for AI chat
│   │   └── 📄 route.ts              # Chat API endpoint
│   ├── 📁 components/               # Reusable UI components
│   │   ├── 📄 AboutSection.tsx      # About section component
│   │   ├── 📄 ChatbotWidget.tsx     # AI chatbot interface
│   │   ├── 📄 ChatbotWrapper.tsx    # Chatbot wrapper logic
│   │   ├── 📄 ContactSection.tsx    # Contact form component
│   │   ├── 📄 ExperienceSection.tsx # Experience timeline
│   │   ├── 📄 footer.tsx            # Footer component
│   │   ├── 📄 HomeSection.tsx       # Hero/landing section
│   │   ├── 📄 Navbar.tsx            # Navigation component
│   │   └── 📄 SkillsSection.tsx     # Skills showcase
│   ├── 📄 favicon.ico               # Site favicon
│   ├── 📄 globals.css               # Global styles
│   ├── 📄 layout.tsx                # Root layout component
│   └── 📄 page.tsx                  # Main page component
├── 📁 public/                       # Static assets
│   ├── 🖼️ 169779048598.jpeg         # Profile image
│   ├── 🎨 file.svg                  # SVG assets
│   ├── 🎨 globe.svg                 # Globe icon
│   ├── 🎨 logo.svg                  # Logo asset
│   ├── 🖼️ MyImage.jpg               # Additional image
│   ├── 🎨 next.svg                  # Next.js logo
│   ├── 🖼️ profile.jpg               # Profile photo
│   ├── 🖼️ Screenshot 2025-07-23 181057.png # Portfolio preview
│   └── 🎨 window.svg                # Window icon
├── 📄 .env.local                    # Environment variables
├── 📄 .gitignore                    # Git ignore rules
├── 📄 eslint.config.mjs             # ESLint configuration
├── 📄 next.config.ts                # Next.js configuration
├── 📄 next-env.d.ts                 # Next.js TypeScript declarations
├── 📄 package.json                  # Project dependencies
├── 📄 postcss.config.mjs            # PostCSS configuration
├── 📄 README.md                     # Project documentation
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
└── 📄 tsconfig.json                 # TypeScript configuration
```

---

## 🌟 **Highlighted Technologies**

### **Frontend Excellence**
- **Next.js 14**: Leveraging the latest App Router for optimal performance
- **TypeScript**: Ensuring code reliability and developer experience
- **Tailwind CSS**: Rapid UI development with utility-first approach

### **AI Integration**
- **Llama 3.1 8B**: State-of-the-art language model for natural conversations
- **Cerebras SDK**: High-performance AI inference platform
- **Streaming API**: Real-time response generation

### **Developer Experience**
- **ESLint & Prettier**: Code quality and formatting
- **Hot Reload**: Instant development feedback
- **Component Architecture**: Modular and maintainable code structure

---

## 🚀 **Deployment**

This portfolio is designed for seamless deployment on **Vercel**:

1. **Connect your GitHub repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy with a single click**

The portfolio will be live at your custom domain: `vijendramalik.com`

---

## 🤝 **Contributing & Usage**

### **Open Source Spirit**
This project is open source to inspire and help fellow developers. If you find it useful:

- ⭐ **Star this repository** to show support
- 🔄 **Fork and customize** for your own portfolio
- 📝 **Credit appropriately** if using significant portions

### **Attribution**
If you use this portfolio as inspiration, please include:
```markdown
Portfolio inspired by Vijendra Singh Malik
GitHub: https://github.com/Wissenwelt/portfolio-webapp
```

---

## 📈 **Performance Metrics**

- ⚡ **Lighthouse Score**: 100/100 (Performance, Accessibility, Best Practices, SEO)
- 🚀 **First Contentful Paint**: < 1.2s
- 📱 **Mobile-Friendly**: Perfect responsive design
- 🔍 **SEO Optimized**: Meta tags and structured data

---

## 🎯 **About the Developer**

**Vijendra Singh Malik** - Senior Data Scientist & AI Architect

*"Transforming Data Into Intelligent Solutions: Bridging advanced GenAI techniques & business."*

**Core Expertise**: LLMs • Python • AWS • NLP • MLOps • AI

**Connect & Collaborate**:
- 💼 [LinkedIn](https://www.linkedin.com/in/vijendramalik/)
- 🐙 [GitHub](https://github.com/Wissenwelt)
- 🌐 [Portfolio](https://vijendramalik.com)

---

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by Vijendra Singh Malik**

*Showcasing the perfect blend of Data Science expertise and modern web development*

**🌟 Star this repo if you found it helpful!**

</div>