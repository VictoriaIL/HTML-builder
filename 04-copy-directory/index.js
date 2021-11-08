const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'files');
const dir = './04-copy-directory/files-copy';


fs.access(dir, (err) => {
    if (err) {
        copyFile();
    } else {
        fs.rm(dir, {recursive: true}, (err) => {
            if (err) {
                throw err;
            }
            copyFile();
        })
    }

    function copyFile(){
        fs.mkdir(dir, {recursive: true}, (err) => {
            if (err) {
                throw err;
            }
            fs.readdir(filePath, (err, files) => {
                files.forEach(file => {
                    fs.copyFile(path.join(__dirname, '/files/' + file), path.join(__dirname, 'files-copy/' + file), (err) => {
                    });
                });
            });
        });
    }
});
