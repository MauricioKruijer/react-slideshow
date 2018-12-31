const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage()
const admin = require('firebase-admin');
admin.initializeApp();

const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

const ffmpeg = require('fluent-ffmpeg');

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
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Cloud Storage files.
  const bucket = storage.bucket(object.bucket);
  const file = bucket.file(filePath);

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    return file.download({destination: tempLocalFile});
  }).then(() => {
    console.log('The file has been downloaded to NO new line', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    return spawn('identify', ['-format', '%wx%h\n', tempLocalFile], {capture: ['stdout', 'stderr']});
  }).then((capture) => {
    if (capture.stderr) {
      console.log('Shit errorrrr')
      console.error(capture.stderr)
    }

    const [width, tempHeight] = capture.stdout.split('x');

    const heightFix = tempHeight.split('\n')
    const height = heightFix[0];

    return {
      width: parseInt(width),
      height: parseInt(height),
    }
  }).then((meta) => {
    if (contentType === 'image/gif') {
      return new Promise((resolve, reject) => {
        spawn('identify', ['-format', '%T\n', tempLocalFile], {capture: ['stdout', 'stderr']})
          .then(capture => {
            if (capture.stderr) {
              console.log('Shit errorrrr')
              console.error(capture.stderr)
              return reject(capture.stderr)
            }

            const sizes = capture.stdout.split(/\n/);
            let frameCount = 0;

            sizes.forEach(size => {
              if (parseInt(size, 10)) {
                frameCount+= parseInt(size, 10);
              }
            })

            resolve({
              ...meta,
              duration: frameCount * 10
            });
          })
      });
    }

    return {
      ...meta,
      duration: 5000
    };
  }).then((meta) => {
    console.log('Push meta to slides store', meta);
    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempLocalFile);

    return admin.database().ref('slides').push({
      name,
      type: 'image',
      meta
    })
  });
});

exports.ProcessVideo = functions.storage.object().onFinalize((object) => {
  const filePath = object.name;
  const name = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, `final_${fileName}`));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('video/')) {
    console.log('This is not a video.');
    return null;
  }

  if (fileName.startsWith('final_')) {
    return console.log('Already converted.');
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
    console.log('files', {
      fromFirebase: tempLocalFile,
      newTarget: tempLocalThumbFile,
    })
    return new Promise((resolve, reject) => {
      ffmpeg(tempLocalFile)
        .noAudio()
        .on('start', function (commandLine) {
          console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('end', function () {
          console.log('Finished processing', `final_${fileName}.mp4`);
          resolve(`final_${fileName}.mp4`)
        })
        .output(`${tempLocalThumbFile}.mp4`)
        .run();
    })
  }).then(newupload => {
    console.log("UPLOAD CONVERTED FILE ", newupload, `${tempLocalThumbFile}.mp4`)

    return bucket.upload(`${tempLocalThumbFile}.mp4`, {
      destination: thumbFilePath + '.mp4',
      metadata: metadata,
    });
  }).then((capture) => {
    console.log("=== heb  je iets PROBEWEEE ===")
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(tempLocalFile, function(err, metadata) {
        if (err) {
          console.log('error in probe')
          console.error('error in probe')
          reject('error')
          return;
        }

        metadata.streams.forEach(stream => {
          if (stream.codec_type === 'video') {
            return resolve({
              width: stream.width,
              height: stream.height,
              duration: Math.ceil(stream.duration) * 1000
            })
          }
        })
      });
    });
    // console.log('Thumbnail created at', finalLocalThumbFile);
    // Uploading the Thumbnail.
    // return bucket.upload(finalLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
  }).then((meta) => {
    console.log('==!! UPLOAD TO ', `final_${fileName}.mp4`)
    return admin.database().ref('slides').push({
      name:`files/final_${fileName}.mp4`,
      type: 'video',
      meta
    })
  })
});
