# Vinh Tieng | Portfolio Website

Welcome to the source code of my personal portfolio – built using [Nuxt 3](https://nuxt.com) and [Nuxt Content](https://content.nuxtjs.org).  
This site showcases my projects, experience, and writing on modern web development.

## 🚀 Features

- ✅ Built with **Nuxt 3**
- ✍️ Powered by **Nuxt Content** for blog and markdown content
- 💡 Fully **SSG (Static Site Generated)** – optimized for SEO and performance
- 🎨 Tailwind CSS for styling
- 🌙 Dark mode support
- 📱 Responsive and mobile-first
- 📸 Optimized image loading (blurred placeholder, lazy loading)
- 🔗 SEO-ready meta tags, Open Graph, and Twitter cards

---

## 📁 Project Structure

```bash
.
├── content/         # Blog posts or articles (markdown files)
├── components/      # Vue components used across the app
├── pages/           # App routes including index.vue, /about, /projects, etc.
├── assets/          # Static assets (images, logos)
├── public/          # Public files (favicon, og images)
├── app.config.ts    # App-level config (title, meta)
├── nuxt.config.ts   # Nuxt configuration
└── ...
```

## 🛠️ Setup & Development

1. Clone the repository:

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview static site
npm run preview
```

## 📝 Writing Content with Nuxt Content

To create a new blog post, add a markdown file in the `content/` directory.
The filename will be used as the slug for the post. For example, `content/my-first-post.md` will be accessible at `/my-first-post`.

### Example Markdown File

```markdown
---
title: My First Post
description: This is my first blog post.
date: 2023-10-01
tags: [nuxt, vue, web-development]
image: /images/my-first-post.jpg
---
# My First Post
This is the content of my first post. You can write in Markdown format.
```
You can use frontmatter to define metadata for your posts, such as title, description, date, tags, and image.
The content of the post follows the frontmatter and can be written in Markdown format.

## 📫 Contact
If you have any questions, suggestions, or contributions, feel free to reach out to me via [email](mailto:vinhtieng123@gmail.com)

