// return spawn('identify', ['-format', '%wx%h', tempLocalFile], {capture: ['stdout', 'stderr']})
const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
// Include a Service Account Key to use a Signed URL
// const gcs = require('@google-cloud/storage')({});
const {Storage} = require('@google-cloud/storage');
const storage = new Storage()
const admin = require('firebase-admin');
admin.initializeApp();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.ProcessImage = functions.storage.object().onFinalize((object) => {
  // File and directory paths.
  const filePath = object.name;
  const name = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    console.log('Already a Thumbnail.');
    return null;
  }

  // Cloud Storage files.
  const bucket = storage.bucket(object.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {
    contentType: contentType,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    // 'Cache-Control': 'public,max-age=3600',
  };

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    return file.download({destination: tempLocalFile});
  }).then(() => {
    console.log('The file has been downloaded to ADDED NEW LINE', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    return spawn('identify', ['-format', '%wx%h\n', tempLocalFile], {capture: ['stdout', 'stderr']});
  // }).then((capture) => {
  //   if (capture.stderr) {
  //     console.log('Shit errorrrr')
  //     console.error(capture.stderr)
  //   }
  //   const [width, height] = capture.stdout.split('x')
  //   console.log('width x height from identify', {width, height})
  //   return spawn('convert', [tempLocalFile, '-thumbnail', `${width-1}x${height-1}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  }).then((capture) => {
      if (capture.stderr) {
        console.log('Shit errorrrr')
        console.error(capture.stderr)
      }
    const [width, height] = capture.stdout.split('x');
      return {
        width, height
      }
    // console.log('Thumbnail created at', tempLocalThumbFile);
    // Uploading the Thumbnail.
    // return bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
  }).then((meta) => {
    console.log('--- CHECK IF GIF VOOR SPAN PROMISE')
    if (contentType === 'image/gif') {
      console.log('--- TRIGGER SPAWN')
      return new Promise((resolve, reject) => {
        spawn('identify', ['-format', '%wx%h\n', tempLocalFile], {capture: ['stdout', 'stderr']})
          .then(capture => {
            console.log('JONGE 2e SPAN', capture)
            if (capture.stderr) {
              console.log('Shit errorrrr')
              console.error(capture.stderr)
              return reject(capture.stderr)
            }
            console.log('OUPTUT SPAWN 2', capture.stdout)

            resolve(meta);
          })
      });
    }
    console.log('--- BOEIE HOEFT NIET META TERUG')
    return meta
  }).then((meta) => {
    if (contentType === 'image/gif') {
      console.log('===GIF FOUND IN PROCESSING!')

    }
    return meta;
  }).then((meta) => {
    console.log('Thumbnail uploaded to Storage at', thumbFilePath);
    // Once the image has been uploaded delete the local files to free up disk space.
    // fs.unlinkSync(tempLocalFile);
    // fs.unlinkSync(tempLocalThumbFile);
    // const [width, height] = dimensions;

    return admin.database().ref('slides').push({
      name,
      type: 'image',
      meta
    })

    // return {
    //   thumbFilePath,
    //   tempLocalFile,
    //   tempLocalThumbFile,
    // }
    // // Get the Signed URLs for the thumbnail and original image.
    // const config = {
    //   action: 'read',
    //   expires: '03-01-2500',
    // };
    // return Promise.all([
    //   thumbFile.getSignedUrl(config),
    //   file.getSignedUrl(config),
    // ]);
  }).then((results) => {
    console.log('Got Signed URLs.');
    // const thumbResult = results[0];
    // const originalResult = results[1];
    // const thumbFileUrl = thumbResult[0];
    // const fileUrl = originalResult[0]
    // console.log('resultsssss', results)

   // return admin.database().ref('thumb-slides').push({
   //    name,
   //    type: 'image',
   //    name: results.thumbFilePath
   //    // path: fileUrl,
   //    // thumbnail: thumbFileUrl
   //    // meta: { width, height }
   //  })
    // Add the URLs to the Database
    // return admin.database().ref('images').push({});
  }).then(() => console.log('Thumbnail URLs saved to database.'));
});
exports.GifTime = functions.storage.object().onFinalize((object) => {
  // File and directory paths.
  const filePath = object.name;
  const name = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  console.log('GOT AN IMAGE', contentType)
  return null
});
