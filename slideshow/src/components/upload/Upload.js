import React, { Component } from 'react';
import FirebaseContext from "../Firebase/Context";
import FileUploader from 'react-firebase-file-uploader'

import './upload.css';

class Upload extends Component {
  state = {
    username: "",
    avatar: "",
    isUploading: false,
    progress: 0,
    avatarURL: ""
  };

  handleChangeUsername = event => this.setState({ username: event.target.value });

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

  handleProgress = progress => this.setState({ progress });

  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });

    this.props.firebase
      .storage
      .ref('files')
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({ avatarURL: url })
        this.saveFile(url)
      });
  };

  saveFile(url) {
    this.props.firebase.db.ref('files').push({
      url: url
    })
  }

  render() {
    return (
      <div className="upload">
        <h1>Upload your best image</h1>
        <form>
          <FileUploader
            accept="video/*,image/*"
            name="avatar"
            randomizeFilename
            storageRef={this.props.firebase.storage.ref('files')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
            metadata={{cacheControl: 'max-age=300'}}
          />

          {this.state.avatarURL
            ? <img alt="" src={this.state.avatarURL} height={300}  />
            : <p>Drag your files here or click in this area.</p>
          }

          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <Upload firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
