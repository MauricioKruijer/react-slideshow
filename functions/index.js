const functions = require('firebase-functions');
const path = require('path');

exports.ProcessImage = functions.storage.object().onFinalize(object => {
  const {
    bucket,
    name,
    contentType,
    metageneration
  } = object;

  console.log({
    bucket,
    name,
    contentType,
    metageneration
  });

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Get the file name.
  const fileName = path.basename(name);

  console.log('filename', fileName);

  return null;
})
