import React, { Component } from 'react';
import FirebaseContext from '../Firebase/Context';
import FileUploader from 'react-firebase-file-uploader';

import './upload.css';

class Upload extends Component {
  state = {
    username: '',
    avatar: '',
    isUploading: false,
    progress: 0,
    avatarURL: '',
  };

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

  handleProgress = progress => this.setState({ progress });

  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });

    this.props.firebase.storage
      .ref('files')
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({ avatarURL: url });
        this.saveFile(url);
      });
  };

  saveFile(url) {
    this.props.firebase.db.ref('files').push({
      url: url,
    });
  }

  render() {
    const { firebase } = this.props;
    const { avatarURL, isUploading } = this.state;

    return (
      <div className="upload">
        <h1>Upload your best image</h1>
        <form>
          <FileUploader
            accept="video/*,image/*"
            name="avatar"
            randomizeFilename
            storageRef={firebase.storage.ref('files')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
            metadata={{ cacheControl: 'max-age=300' }}
          />

          {/* {!isUploading ? <button type="submit">Submit</button> : null} */}

          {avatarURL ? <p>✅</p> : !isUploading ? <span className="rotate">♻️</span> : null}
        </form>
      </div>
    );
  }
}

export default props => (
  <FirebaseContext.Consumer>
    {firebase => <Upload firebase={firebase} {...props} />}
  </FirebaseContext.Consumer>
);
