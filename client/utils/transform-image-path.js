const transformImagePath = (path, folder) => {
    let imagePathParts = path.split('/');
    const imageName = imagePathParts[imagePathParts.length - 1];
    imagePathParts[imagePathParts.length - 1] = folder;
    imagePathParts.push(imageName);
    return imagePathParts.join('/');
};

export default transformImagePath;
