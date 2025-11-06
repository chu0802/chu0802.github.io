# Blog System Documentation

This blog system provides an easy way to create and display blog posts using Markdown files. It features a clean, modern design that matches the rest of your homepage.

## Features

- 📝 **Markdown Support** - Write posts in simple Markdown format using [Marked.js](https://marked.js.org/)
- 🎨 **Syntax Highlighting** - Beautiful code blocks with [Highlight.js](https://highlightjs.org/)
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔍 **Search Functionality** - Filter posts by title, excerpt, or tags
- 🌙 **Dark Mode** - Automatic dark mode support
- 🖼️ **Image Modal** - Click images to view them in full size
- 🏷️ **Tags System** - Organize posts with tags
- ⏱️ **Reading Time** - Display estimated reading time for each post

## File Structure

```
blog/
├── index.json              # Blog post index (required)
├── sample-blog-post.md     # Sample markdown post
└── your-post.md            # Your markdown posts
```

## Adding a New Blog Post

### Step 1: Create a Markdown File

Create a new `.md` file in the `blog/` directory. For example, `my-first-post.md`:

```markdown
# My First Blog Post

This is the content of my blog post. You can use all standard Markdown features:

## Headers
**Bold text**, *italic text*, and `inline code`.

- Lists
- Are
- Supported

\`\`\`python
def hello():
    print("Code blocks work too!")
\`\`\`
```

### Step 2: Update the Blog Index

Edit `blog/index.json` to add your post metadata:

```json
[
  {
    "id": "my-first-post",
    "title": "My First Blog Post",
    "excerpt": "A brief description of what this post is about.",
    "date": "2025-11-06",
    "author": "Your Name",
    "file": "blog/my-first-post.md",
    "image": "path/to/optional-image.jpg",
    "tags": ["tutorial", "getting-started"],
    "readTime": "5 min read"
  }
]
```

#### Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier for the post (use kebab-case) |
| `title` | ✅ | The title of your blog post |
| `excerpt` | ⚠️ | Short description shown in the blog list |
| `date` | ✅ | Publication date (YYYY-MM-DD format) |
| `author` | ⚠️ | Author name (displayed on single post view) |
| `file` | ✅ | Path to the markdown file |
| `image` | ⚠️ | Header image URL (optional) |
| `tags` | ⚠️ | Array of tag strings |
| `readTime` | ⚠️ | Estimated reading time |

### Step 3: Test Your Post

1. Open `blog.html` in your browser
2. Your post should appear in the blog list
3. Click "Read More" to view the full post

## Markdown Tips

### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
`Inline code`
```

### Links and Images
```markdown
[Link text](https://example.com)
![Alt text](path/to/image.jpg)
```

### Code Blocks
````markdown
```python
def example():
    return "Python code with syntax highlighting"
```
````

### Lists
```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list
2. Second item
3. Third item
```

### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Tables
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

## Customization

### Changing Colors

The blog uses CSS variables defined in `assets/css/fancy-styles.css`. You can customize:

- `--primary-color` - Main accent color
- `--accent-color` - Secondary accent color
- `--text-color` - Body text color
- `--heading-color` - Header text color

### Adding More Features

The blog script is located at `assets/js/custom-blog-script.js`. You can extend it to add:

- Categories
- Comments system
- Social sharing buttons
- Related posts
- RSS feed
- And more!

## Troubleshooting

### Posts not showing up?

1. Check that `blog/index.json` is valid JSON
2. Verify the file path in the `file` field is correct
3. Make sure the markdown file exists
4. Check browser console for errors

### Images not loading?

1. Use relative paths from the root: `blog/images/photo.jpg`
2. Or use absolute URLs: `https://example.com/image.jpg`
3. Verify the image file exists at the specified path

### Code highlighting not working?

The blog uses Highlight.js which supports many languages. Make sure to specify the language in your code blocks:

````markdown
```javascript
// Your code here
```
````

## Support

For issues or questions, please check:
- [Marked.js Documentation](https://marked.js.org/)
- [Highlight.js Documentation](https://highlightjs.org/)
- Your browser's developer console for errors

Happy blogging! 📝✨
