# 💬 ChatGPT to MDX/MD Converter

Save your chats for Obsidian
A beautiful, modern web application that converts your exported ChatGPT conversation JSON files into clean, readable MDX or Markdown files.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

- 📤 **Easy Upload** - Simply drag and drop or select your ChatGPT export JSON file
- 🎯 **Dual Format Support** - Export to MDX (with frontmatter) or standard Markdown
- 🔍 **Smart Filtering** - Search through conversations by title
- ✅ **Batch Selection** - Select multiple conversations and download as a ZIP
- 🎨 **Beautiful UI** - Clean, modern interface with Tailwind CSS
- ⚡ **Lightning Fast** - Built with Next.js and React 19
- 📦 **ZIP Export** - Download multiple conversations at once
- 🌐 **Cloudflare Ready** - Deploy to Cloudflare Pages with ease

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd chatgpt_to_mdx
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### Exporting from ChatGPT

1. Go to ChatGPT Settings → Data Controls
2. Click "Export data"
3. Wait for the email with your data export
4. Extract the `conversations.json` file

### Converting to MDX/MD

1. Open the application
2. Choose your preferred output format (MDX or MD)
3. Upload your `conversations.json` file
4. Use the filter to search for specific conversations (optional)
5. Select conversations you want to export
6. Click "Download" to get your files

### Output Formats

#### MDX Format (with frontmatter)

```mdx
---
title: "Conversation Title"
date: "2024-11-05T19:50:35.972Z"
id: "conversation-id"
---

# Conversation Title

## User

Your question here...

## Assistant

AI response here...
```

#### MD Format (standard markdown)

```md
# Conversation Title

**Date:** 2024-11-05T19:50:35.972Z
**ID:** conversation-id

---

## User

Your question here...

## Assistant

AI response here...
```

## 🛠️ Built With

- **[Next.js 16](https://nextjs.org/)** - React framework
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Styling
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[JSZip](https://stuk.github.io/jszip/)** - ZIP file generation

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint

# Cloudflare Deployment
npm run preview      # Preview Cloudflare build
npm run deploy       # Deploy to Cloudflare Pages
```

## 🌍 Deployment

### Cloudflare Pages

This project is optimized for Cloudflare Pages deployment:

```bash
npm run deploy
```

### Vercel

Can also be deployed to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and React
- Icons by [Lucide](https://lucide.dev/)
- Inspired by the need to preserve ChatGPT conversations in a readable format

## 📧 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

Made with ☕ and code + ❤️ by [dedkola](https://github.com/dedkola)
