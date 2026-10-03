const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startStr = '<div class="live-feed-backdrop" aria-hidden="true"></div>';
const endStr = '</div>\n        </div>\n    </section>';

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = `<div class="brewing-island-wrapper" style="width: 100%; height: 100vh; overflow: hidden;">
                <img src="assets/brewing-island.jpg" alt="Matcha brewing island" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
            </div>\n    </section>`;
    html = html.substring(0, startIndex) + newContent + html.substring(endIndex + endStr.length);
    fs.writeFileSync('index.html', html);
    console.log("Success");
} else {
    console.log("Not found");
}
