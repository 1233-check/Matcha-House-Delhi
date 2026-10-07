with open('styles.css', 'r') as f:
    css = f.read()

css = css.replace(
'''.logo-img {
    height: 80px;
    transform: scale(1.4);
    width: auto;
}''',
'''.logo-img {
    height: 40px;
    transform: scale(2.2);
    transform-origin: left center;
    width: auto;
}'''
)

with open('styles.css', 'w') as f:
    f.write(css)

print("CSS updated")
