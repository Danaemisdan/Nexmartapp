const fs = require('fs');

const jsonStr = fs.readFileSync('bumpa_api_utf8.json', 'utf8').replace(/^\uFEFF/, '');
const collection = JSON.parse(jsonStr);

let output = '# Bumpa API Specification Summary\n\n';

function parseItem(item, path = '') {
    if (item.item) {
        item.item.forEach(subItem => parseItem(subItem, path + item.name + ' > '));
    } else {
        output += `## ${path}${item.name}\n`;
        if (item.request) {
            const req = item.request;
            const method = req.method;
            let url = '';
            if (req.url) {
                if (typeof req.url === 'string') {
                    url = req.url;
                } else if (req.url.raw) {
                    url = req.url.raw;
                }
            }
            output += `**Method:** ${method}\n`;
            output += `**URL:** ${url}\n\n`;

            if (req.header && req.header.length > 0) {
                output += `**Headers:**\n`;
                req.header.forEach(h => {
                    output += `- ${h.key}: ${h.value}\n`;
                });
                output += '\n';
            }

            if (req.body && req.body.mode === 'raw') {
                output += `**Request Body:**\n\`\`\`json\n${req.body.raw}\n\`\`\`\n\n`;
            }
        }
        
        if (item.response && item.response.length > 0) {
            output += `**Example Response (${item.response[0].code} ${item.response[0].status}):**\n`;
            let resBody = item.response[0].body;
            // Trim very long responses
            if (resBody && resBody.length > 2000) {
                resBody = resBody.substring(0, 2000) + '\n... (truncated)';
            }
            output += `\`\`\`json\n${resBody}\n\`\`\`\n\n`;
        }
        output += '---\n\n';
    }
}

collection.item.forEach(item => parseItem(item));

fs.writeFileSync('bumpa_api_summary.md', output);
console.log('Done!');
