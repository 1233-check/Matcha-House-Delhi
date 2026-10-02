import base64
with open('assets/spill.png', 'rb') as f:
    print(base64.b64encode(f.read()).decode('utf-8')[:100])
