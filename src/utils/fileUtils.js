const fs = require('fs/promises');
const path = require('path');

const save = (name, file) => {
    return fs.writeFile(path.resolve('.') + name, file);
}

module.exports = {
    save
}