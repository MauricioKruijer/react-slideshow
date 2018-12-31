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

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0, avatarURL: '' });

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

          {avatarURL ?
              <div style={{paddingTop: '90px'}}>
                <span className="emoji">🍾</span>
                <h1>Upload another</h1>
             </div>
            : isUploading ?
              <div style={{paddingTop: '90px'}}>
                <span className="emoji rotate">✈️️</span>
                <h1>Uploading...</h1>
              </div> : null}
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
