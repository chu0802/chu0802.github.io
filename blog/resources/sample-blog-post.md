# Welcome to My Blog

This is a sample blog post to demonstrate the **Markdown parsing** capabilities of this blog system. The blog page is styled to match the rest of the homepage with a clean, modern design.

## Features

This blog system includes several powerful features:

1. **Markdown Parsing** - Write posts in simple Markdown format
2. **Code Syntax Highlighting** - Beautiful code blocks with syntax highlighting
3. **Responsive Design** - Works great on all devices
4. **Search Functionality** - Easily find posts by title, excerpt, or tags
5. **Dark Mode Support** - Automatic dark mode that matches your site preferences
6. **Math Equations** - Support for LaTeX math equations using MathJax

## Math Equations

You can write inline math like $E = mc^2$ or display math equations:

$$
\frac{d}{dx}\left( \int_{0}^{x} f(u)\,du\right)=f(x)
$$

Here's a more complex example:

$$
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}
$$

The quadratic formula:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## Code Examples

Here's an example of how code looks with syntax highlighting:

```python
def hello_world():
    """A simple Python function"""
    print("Hello, World!")
    return True

if __name__ == "__main__":
    hello_world()
```

JavaScript example:

```javascript
const greet = (name) => {
  console.log(`Hello, ${name}!`);
  return `Welcome to the blog, ${name}`;
};

greet("visitor");
```

## Lists and Formatting

### Unordered Lists

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered Lists

1. Step one
2. Step two
3. Step three

### Task Lists

- [x] Create blog page
- [x] Add Markdown support
- [x] Style the page
- [ ] Write more blog posts

## Blockquotes

> "The best way to predict the future is to invent it."
> 
> — Alan Kay

## Tables

Here's a sample table:

| Feature | Supported | Notes |
|---------|-----------|-------|
| Markdown | ✅ | Full GFM support |
| Code Highlighting | ✅ | Via Highlight.js |
| Images | ✅ | Clickable modal view |
| Math | ✅ | Support inline math and display math equations |

## Images

You can add images using standard Markdown syntax. Click on images to view them in a modal:

![Example Image](blog/images/Cos_vs_mask_ratio.png)

## Links

You can easily add [links to other pages](index.html) or [external resources](https://github.com/chu0802).

## Emphasis

You can use *italics*, **bold**, ***bold italics***, ~~strikethrough~~, and `inline code`.

## Horizontal Rules

Use horizontal rules to separate sections:

---

## Adding Your Own Posts

To add your own blog posts:

1. Create a new `.md` file in the `blog/` directory
2. Write your content using Markdown syntax
3. Update the `blog/index.json` file with your post metadata:

```json
{
  "id": "your-post-id",
  "title": "Your Post Title",
  "excerpt": "A short description of your post",
  "date": "2025-11-06",
  "author": "Your Name",
  "file": "blog/your-post.md",
  "image": "path/to/image.jpg",
  "tags": ["tag1", "tag2"],
  "readTime": "5 min read"
}
```

## Conclusion

This blog system provides a simple yet powerful way to share your thoughts and ideas. The Markdown format makes it easy to write and format your posts, while the modern design ensures they look great on any device.

Happy blogging! 🎉
