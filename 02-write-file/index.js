const fs = require('fs'),
    path = require('path'),
    process = require('process'),
    os = require('os'),
    readline = require('readline');

const filePath = path.join(__dirname, 'text-task2.txt');

fs.open(filePath, 'w', (err) => {
    if (err) throw err;
    console.log(`${os.EOL} Hello! Please enter text: ${os.EOL}`);
    rl.prompt();
});


let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
});

rl.on('line', (input) => {
    input = input.toLowerCase();
    if (input === 'exit') {
        console.log(`${os.EOL}Your text has been added in the file!${os.EOL}`);
        process.exit();
    }
    fs.appendFile(filePath, `${input}${os.EOL}`, (err) => {
        if (err) throw err;
    })
    rl.prompt();
});

rl.on('SIGINT', () => {
    console.log(`${os.EOL}Your text has been added in the file!${os.EOL}`);
    process.exit();
})





