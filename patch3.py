import re

with open('index.html', 'r') as f:
    html = f.read()

start_str = r'<div class="brewing-island-wrapper".*?</div>'
new_content = '''<div class="brewing-island-wrapper" style="width: 100%; height: 100vh; overflow: hidden; position: relative; background-color: #080C06;">
                <!-- Ambient blurred background for edge-to-edge immersion -->
                <div style="position: absolute; inset: -50px; background: url('assets/brewing-island.jpg') center/cover; filter: blur(40px) brightness(0.5); z-index: 1;"></div>
                <!-- Crisp contained image -->
                <img src="assets/brewing-island.jpg" alt="Matcha brewing island" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; object-position: center; z-index: 2;">
            </div>'''

html_replaced = re.sub(start_str, new_content, html, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(html_replaced)

print("Success")
