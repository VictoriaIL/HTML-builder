const fs = require('fs');
const path = require('path');
const dir = './06-build-page/project-dist';
const componentsPath = path.join(__dirname, 'components');
const dirStyles = path.join(__dirname, 'styles');
const stylesFilePath = path.join(__dirname, 'project-dist', 'style.css');
const assetsDir = path.join(__dirname, 'assets');
const assetsDirCopy = path.join(__dirname, 'project-dist', 'assets');

/*.........Tags............*/
fs.mkdir(dir, {recursive: true}, (err) => {
    if (err) {
        throw err;
    }
});

const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
const writeStream = fs.createWriteStream(path.join(path.join(__dirname, 'project-dist'), 'index.html'));


readStream.on('data', async (data) => {

    let htmlAsString = data.toString();
    const templateTags = htmlAsString.match(/{{.+}}/gi);

    fillHTML();


    function fillHTML() {
        fs.readdir(componentsPath, (err, files) => {
            files.forEach((file, index) => replaceTagByComponent(file, index))
        });

    }

    function replaceTagByComponent(file, currentIndexOfFile) {
        if (file) {
            fs.readFile(path.join(componentsPath, file), (err, data) => {
                replaceDataByTag(file, data, currentIndexOfFile)
            });
        }
    }

    function replaceDataByTag(file, data, currentIndexOfFile) {
        setTimeout(() => {
            htmlAsString = htmlAsString.replace(new RegExp('{{' + file.split('.')[0] + '}}', 'g'), data.toString())
            if (currentIndexOfFile === templateTags.length - 1) {
                writeStream.write(htmlAsString)
            }
        }, 1000)

    }

})

/*.........Styles............*/

fs.open(stylesFilePath, 'w', (err) => {
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
                    fs.appendFile(stylesFilePath, mass.join('\n'), (err) => {
                        if (err) throw err;
                    })
                });

            }
        })
    }

})


/*.........Assets............*/

fs.access(assetsDirCopy, (err) => {
    if (err) {
        copyDir(assetsDir, assetsDirCopy);
    } else {
        fs.rm(assetsDirCopy, {recursive: true}, (err) => {
            if (err) {
                throw err;
            }
            copyDir(assetsDir, assetsDirCopy);
        })
    }

    function copyDir(dirPath, copyDirPath) {
        fs.mkdir(copyDirPath, {recursive: true}, (err) => {
            if (err) {
                throw err;
            }
            fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
                files.forEach((file) => {
                    if (file.isFile()) {
                        const filePath = path.join(dirPath, file.name);
                        const copyPath = path.join(copyDirPath, file.name);
                        fs.copyFile(filePath.toString(), copyPath.toString(), (err) => {
                        });
                    } else {
                        copyDir(path.join(dirPath, file.name), path.join(copyDirPath, file.name));
                    }
                })
            })
        });

    }
})
