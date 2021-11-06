const fs = require('fs'),
    path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, function (err, items) {

    for (let i = 0; i < items.length; i++) {
        const ext = path.extname(items[i]);
        const name = path.basename(items[i], ext);

        fs.stat(path.join(__dirname, `secret-folder/${items[i]}`), function (err, stats) {
            if (stats.isFile()) console.log(`${name} - ${ext.slice(1)} - ${stats['size']}b`);
        })
    }
})



