const fs = require('fs/promises');
const path = require('path');

const save = (name, file) => {
    return fs.writeFile(path.resolve('.') + name, file);
}

const find = (directory, name) => {
    return fs.readdir(directory)
        .then(files => files.filter(file => file.startsWith(name))[0]);
}

const remove = (path, file) => fs.unlink(`${path}/${file}`);

module.exports = {
    save,
    find,
    remove
}