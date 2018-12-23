import React, { Component } from 'react';
import FirebaseContext from "../Firebase/Context";
import FileUploader from 'react-firebase-file-uploader'

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
      .then(url => this.setState({ avatarURL: url }));
  };

  componentDidMount() {
    this.props.firebase.db.ref(`slides`).push({
      type: 'image',
      url: 'nu met push'
    });
  }

  render() {
    console.log('hoi')
    console.log(this.props.firebase)
    return (
      <div>
        UPLOAD PAGEEE
        <form>
          <label>Username:</label>
          <input
            type="text"
            value={this.state.username}
            name="username"
            onChange={this.handleChangeUsername}
          />
          <label>Avatar:</label>
          {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
          {this.state.avatarURL && <img src={this.state.avatarURL} />}

          <FileUploader
            accept="video/*,image/*"
            name="avatar"
            randomizeFilename
            storageRef={this.props.firebase.storage.ref('files')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
        </form>
      </div>
    );
  }
}

export default (props) => <FirebaseContext.Consumer>
  { firebase => <Upload firebase={firebase} {...props}/> }
</FirebaseContext.Consumer>
