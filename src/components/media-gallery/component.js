import React, { Component } from 'react';
import './style.css';

class MediaGallery extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="app-media-gallery">
        <img src={this.props.resources[0].url} />
      </div>
    );
  }
}

export default MediaGallery;