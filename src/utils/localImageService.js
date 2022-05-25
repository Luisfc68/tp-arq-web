const { save, find, remove } = require('./fileUtils');
const path = require('path');

const mealImagesPath = '/public/images/meals/';

const saveMealImage = (fileName, buffer) => {
    return save(`${mealImagesPath}${fileName}`, buffer);
}

const getMealImage = (meal) => {
    const directory = path.join(path.resolve('.'), mealImagesPath);
    return find(directory, meal)
        .then(fileName => fileName? directory+fileName : null);
}

const deleteMealImage = (meal) => {
    return getMealImage(meal)
        .then(imagePath => imagePath? remove(imagePath) : null);
}

module.exports = {
    meals: {
        saveImage: saveMealImage,
        getImage: getMealImage,
        deleteImage: deleteMealImage
    }
}