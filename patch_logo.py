import re

with open('index.html', 'r') as f:
    html = f.read()

html = html.replace(
    '<div class="logo">Matcha House Delhi</div>',
    '<a href="#home" class="logo"><img src="assets/logo.png" alt="Matcha House Logo" class="logo-img"> Matcha House Delhi</a>'
)

with open('index.html', 'w') as f:
    f.write(html)

with open('styles.css', 'r') as f:
    css = f.read()

# Make .logo a flex container
css = css.replace(
    '.logo {\n    font-size: 1.8rem;\n    color: var(--color-matcha-dark);\n    letter-spacing: 2px;\n    z-index: 1001;\n    font-family: var(--font-heading);\n}',
    '.logo {\n    font-size: 1.8rem;\n    color: var(--color-matcha-dark);\n    letter-spacing: 2px;\n    z-index: 1001;\n    font-family: var(--font-heading);\n    display: flex;\n    align-items: center;\n    gap: 0.75rem;\n    text-decoration: none;\n}\n\n.logo-img {\n    height: 40px;\n    width: auto;\n}'
)

with open('styles.css', 'w') as f:
    f.write(css)

print("Success")
