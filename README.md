# vue-translate-app

A simple yet powerful Vue.js app that translates text using MyMemory API with fallback support from RapidAPI, includes speech synthesis, and stores translation history. Styled with dark mode support for a better experience.

## 🚀 Features

- 🌐 Translate any text between supported languages
- 🧠 Translation memory using MyMemory API
- 🔁 Fallback to RapidAPI if MyMemory fails
- 🔊 Speech synthesis for translated text
- 📜 Translation history with option to clear
- 🌙 Dark mode layout and clean UI

## 🛠️ Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/zatchone/Translate-app.git
cd Translate-app

npm install
npm run serve

VITE_RAPID_API_KEY=your_api_key in .env file
