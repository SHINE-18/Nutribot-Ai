# 🥦 NutriBot-Ai — Your Personal AI Food Assistant

Hey there! 👋  
Welcome to NutriBot-Ai, a project I built during the **AI GTU IBM SkillsBuild Summer Internship 2025**.

The goal?  
To help people like you and me figure out how healthy a food item is, get personalized advice, and make smarter food decisions — all with the power of AI.

---

## 🌐 Live Demo


- 💻 GitHub Repo: [NutriBot-Ai on GitHub](https://github.com/SHINE-18/Nutribot-Ai)

---

## 🚀 Features

- User-friendly sign-in and sign-up (Convex Auth)
- <img width="1919" height="1079" alt="Screenshot 2025-07-21 172430" src="https://github.com/user-attachments/assets/17015154-af12-4979-8d0f-a24655bfb754" />

- Anonymous sign-in option for quick access
- Personalized food analysis powered by OpenAI GPT
- Health score (1–10) and smart alternatives
- <img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/a46a8956-92bc-4fd3-b301-87a751cb39f9" />

- Real-time chat interface with AI nutritionist
- <img width="1919" height="1018" alt="Screenshot 2025-07-21 174031" src="https://github.com/user-attachments/assets/e099e0ba-7afe-4631-93ff-2fa2a865d047" />


- Profile setup for personalized advice (allergies, goals, conditions)
- <img width="1919" height="1079" alt="Screenshot 2025-07-21 172615" src="https://github.com/user-attachments/assets/c4a4d18f-ca31-402e-ae26-fa6d9e91020f" />

- History tracking and food query logs
- <img width="1919" height="871" alt="Screenshot 2025-07-21 174118" src="https://github.com/user-attachments/assets/a94df2e3-804c-411b-8f17-c0e89b45073e" />

---

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Sonner (for notifications)

**Backend:**
- Convex (Reactive DB)
- Convex Auth
- OpenAI API (GPT-4o-mini)
- LangGraph (AI agent workflows)

---

## 📦 Getting Started

### Prerequisites

- Node.js (v16+)
- npm (Node package manager)
  
💬 Usage Guide
Sign in or use anonymous mode
Set up your health profile: age, weight, conditions, goals
Ask anything like:
"Is Diet Coke healthy?"
"Suggest something better than Maggi"
"Compare Milk vs Almond Milk"
Your answers + food history is saved for future review

🌍 SDG Goal Alignment
This project aligns with United Nations SDG 3: Good Health & Well-being, empowering users to make smarter food decisions through personalized, AI-powered nutrition insights.

🤝 Contributing
We welcome contributions!
Steps:
Fork the repo
Create a branch (git checkout -b feature-name)
Make changes
Push & submit PR
Please follow the existing code style and test changes.

📄 License
This project is licensed under the MIT License.
See the LICENSE file for more details.

🙋 About Me
Hi, I’m Shine Gamit, a Computer Engineering student at VGEC.
I built NutriBotAI as a solo project during the IBM SkillsBuild Internship using real-world AI tools like Convex, LangGraph, and OpenAI.
💡 Made with AI, curiosity, and purpose.


### Installation

```bash
git clone https://github.com/SHINE-18/Nutribot-Ai.git
cd Nutribot-Ai
npm install
npx convex dev (Backend)
npm run dev (Frontend- Vite+dev)

OPENAI_API_KEY=your_openai_key
CONVEX_DEPLOYMENT=your_convex_project_url


