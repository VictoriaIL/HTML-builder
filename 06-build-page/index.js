const fs = require('fs');
const path = require('path');
const dirProjectDist = './06-build-page/project-dist';
const componentsDirPath = path.join(__dirname, 'components');
const dirStyles = path.join(__dirname, 'styles');
const stylesBundleFile = path.join(__dirname, 'project-dist', 'style.css');
const assetsDir = path.join(__dirname, 'assets');
const assetsDirCopy = path.join(__dirname, 'project-dist', 'assets');

/*.........Tags............*/
fs.mkdir(dirProjectDist, {recursive: true}, (err) => {
    if (err) {
        throw err;
    }
});

const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
const writeStream = fs.createWriteStream(path.join(path.join(__dirname, 'project-dist'), 'index.html'));


 readStream.on('data', async (chunk) => {

    let htmlAsString = chunk.toString();
    const templateTags = htmlAsString.match(/{{.+}}/gi);

   await  fs.readdir(componentsDirPath, (err, files) => {

        files.forEach((file, index) => {
            fs.createReadStream(path.join(path.join(__dirname, 'components'), file), {encoding: 'utf-8'})
                .on('data', (data) => {
                        htmlAsString = htmlAsString.replace(new RegExp('{{' + file.split('.')[0] + '}}', 'g'), data.toString());
                        if (index === templateTags.length - 1) {
                            writeStream.write(htmlAsString)
                        }
                    }
                )
        });
    });

})

/*.........Styles............*/

fs.open(stylesBundleFile, 'w', (err) => {
    if (err) throw err;
});

fs.readdir(dirStyles, function (err, items) {

    for (let i = 0; i < items.length; i++) {
        const ext = path.extname(items[i]);

        fs.stat(path.join(__dirname, `styles/${items[i]}`), function (err, stats) {
            if (stats.isFile() && ext === '.css') {
                let mass = [];
                const readStream = fs.createReadStream(path.join(__dirname, `styles/${items[i]}`), {encoding: 'utf-8'});
                readStream.on('data', (data) => {
                    mass.push(data.toString());
                });
                readStream.on('end', () => {
                    fs.appendFile(stylesBundleFile, mass.join('\n'), (err) => {
                        if (err) throw err;
                    })
                })
            }
        })
    }
})


/*.........Assets............*/

fs.access(assetsDirCopy, (err) => {
    if (err) {
        newDir(assetsDir, assetsDirCopy);
    } else {
        fs.rm(assetsDirCopy, {recursive: true}, (err) => {
            if (err) {
                throw err;
            }
            newDir(assetsDir, assetsDirCopy);
        })
    }

    function newDir(dirPath, newDirPath) {
        fs.mkdir(newDirPath, {recursive: true}, (err) => {
            if (err) {
                throw err;
            }
            fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
                files.forEach((file) => {
                    if (file.isFile()) {
                        const filePath = path.join(dirPath, file.name);
                        const newPath = path.join(newDirPath, file.name);
                        fs.copyFile(filePath.toString(), newPath.toString(), (err) => {
                        });
                    } else {
                        newDir(path.join(dirPath, file.name), path.join(newDirPath, file.name));
                    }
                })
            })
        })
    }
})
