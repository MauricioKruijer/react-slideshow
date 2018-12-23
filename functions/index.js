const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const {Storage} = require('@google-cloud/storage');
const spawn = require('child-process-promise').spawn;
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const os = require('os');

const storage = new Storage();

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

  // Create random filename with same extension as uploaded file.
  const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(name);
  const tempLocalFile = path.join(os.tmpdir(), randomFileName);

  console.log('getting in to shit', {
    randomFileName,
    tempLocalFile
  })
  let metadata;
  // Download file from bucket.
  return storage.bucket(bucket).file(name).download({destination: tempLocalFile}).then(() => {
    console.log('prep to run identify command from imagick')
    // Get Metadata from image.
    return spawn('identify', ['-format', '%wx%h', tempLocalFile], {capture: ['stdout', 'stderr']})
  }).then((result) => {
    console.log('format stuff please')
    console.log('stderr checken', result.stderr)
    if (result.stderr) {
      return false;
    }

    // Save metadata to realtime datastore.
    metadata = result.stdout;
    // metadata = imageMagickOutputToObject(result.stdout);
    console.log(metadata);
    const [width, height] = metadata.split('x')
    console.log('Zonder quotes',
      {
        width,
        height
      }
    )

    const werktDit = {
      name,
      type: 'image',
      meta: { width, height }
    };

    admin.database().ref('slides').push(werktDit)
    return true
    // const safeKey = makeKeyFirebaseCompatible(name);
    // return admin.database().ref(safeKey).set(metadata);
  }).then(() => {
    // console.log('Wrote to:', name, 'data:', metadata);
    return null;
  }).then(() => {
    // Cleanup temp directory after metadata is extracted
    // Remove the file from temp directory
    return fs.unlinkSync(tempLocalFile)
  }).then(() => {
    console.log('cleanup successful!');
    return null;
  });
})

/**
 * Convert the output of ImageMagick's `identify -verbose` command to a JavaScript Object.
 */
function imageMagickOutputToObject(output) {
  let previousLineIndent = 0;
  const lines = output.match(/[^\r\n]+/g);
  lines.shift(); // Remove First line
  lines.forEach((line, index) => {
    const currentIdent = line.search(/\S/);
    line = line.trim();
    if (line.endsWith(':')) {
      lines[index] = makeKeyFirebaseCompatible(`"${line.replace(':', '":{')}`);
    } else {
      const split = line.replace('"', '\\"').split(': ');
      split[0] = makeKeyFirebaseCompatible(split[0]);
      lines[index] = `"${split.join('":"')}",`;
    }
    if (currentIdent < previousLineIndent) {
      lines[index - 1] = lines[index - 1].substring(0, lines[index - 1].length - 1);
      lines[index] = new Array(1 + (previousLineIndent - currentIdent) / 2).join('}') + ',' + lines[index];
    }
    previousLineIndent = currentIdent;
  });
  output = lines.join('');
  output = '{' + output.substring(0, output.length - 1) + '}'; // remove trailing comma.
  output = JSON.parse(output);
  console.log('Metadata extracted from image', output);
  return output;
}

/**
 * Makes sure the given string does not contain characters that can't be used as Firebase
 * Realtime Database keys such as '.' and replaces them by '*'.
 */
function makeKeyFirebaseCompatible(key) {
  return key.replace(/\./g, '*');
}
