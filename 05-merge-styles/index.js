const fs = require('fs'),
    path = require('path');

const dirPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.open(bundleFilePath, 'w', (err) => {
    if (err) throw err;
});

fs.readdir(dirPath, function (err, items) {

    for (let i = 0; i < items.length; i++) {
        const ext = path.extname(items[i]);

        fs.stat(path.join(__dirname, `styles/${items[i]}`), function (err, stats) {
            if (stats.isFile() &&  ext === '.css') {
                let mass = [];
                const readStream = fs.createReadStream(path.join(__dirname, `styles/${items[i]}`), {encoding: 'utf-8'});
                    readStream.on('data', (data) => {
                        mass.push(data.toString());
                    });
                    readStream.on('end', () => {
                        fs.appendFile(bundleFilePath, mass.join('\n'), (err) => {
                            if (err) throw err;
                        })
                    });

            }
        })
    }

})
