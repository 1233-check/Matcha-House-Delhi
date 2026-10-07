import re

with open('index.html', 'r') as f:
    html = f.read()

html = html.replace(
    '<a href="#home" class="logo"><img src="assets/logo.png" alt="Matcha House Logo" class="logo-img"> Matcha House Delhi</a>',
    '<a href="#home" class="logo"><img src="assets/logo.png" alt="Matcha House Logo" class="logo-img"></a>'
)

with open('index.html', 'w') as f:
    f.write(html)

print("HTML Updated")
