const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Wrap live-feed-section in live-feed-wrapper
html = html.replace(
    '<section id="secret-ritual" class="live-feed-section" aria-label="Live Ceremonial Tea Bar Feed">',
    '<div class="live-feed-wrapper">\n        <section id="secret-ritual" class="live-feed-section" aria-label="Live Ceremonial Tea Bar Feed">'
);

html = html.replace(
    '</section>\n\n    <!-- Editorial "Our Story" Section -->',
    '</section>\n    </div>\n\n    <!-- Editorial "Our Story" Section -->'
);

fs.writeFileSync('index.html', html);
