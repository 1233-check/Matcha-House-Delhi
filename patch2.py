import re

with open('index.html', 'r') as f:
    html = f.read()

start_str = r'<div class="live-feed-backdrop".*?</section>'
new_content = '''<div class="brewing-island-wrapper" style="width: 100%; height: 100vh; overflow: hidden;">
            <img src="assets/brewing-island.jpg" alt="Matcha brewing island" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
        </div>
    </section>'''

html_replaced = re.sub(start_str, new_content, html, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(html_replaced)

print("Success")
