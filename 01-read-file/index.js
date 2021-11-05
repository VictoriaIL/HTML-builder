const fs = require('fs'), path = require('path'), process = require('process');

const filePath = path.join(__dirname, 'text.txt');

fs.createReadStream(filePath, {encoding: 'utf-8'})
    .on('data', (data) => {
        process.stdout.write(data);
    });
