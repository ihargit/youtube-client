export default class Video {
  static truncateString(string, length) {
    const lengthNeeded = length;
    let cutString = string;
    if (cutString.length > lengthNeeded) {
      cutString = `${cutString.substring(0, lengthNeeded)}...`;
    }
    return cutString;
  }

  static renderVideo(videoData) {
    const symbolsInVideoDescription = 43;
    const symbolsInVideoTitle = 15;
    const videoHtml = document.createElement('li');
    videoHtml.classList.add('video');
    videoHtml.innerHTML = `<div class="video-inner">
      <div class="video-top">
        <a class="video-image-link" href="https://youtu.be/${videoData.videoId}" target="_blank">
        <img class="video-thumbnail" src="${videoData.thumbnailUrl}"
        alt="${videoData.title}" width="${videoData.thumbnailWidth}">
        </a>
        <div class="video-title">
        <a class="video-link" href="https://youtu.be/${videoData.videoId}" target="_blank">
          ${this.truncateString(videoData.title, symbolsInVideoDescription)}
        </a>
        </div>
      </div>
      <div class="video-info">
        <div class="video-info-statistics">
          <div class="video-channel">
            <i class="fa fa-user statistics-icon"></i>
            ${this.truncateString(videoData.channelTitle, symbolsInVideoTitle)}
          </div>
          <div class="video-publishing-date">
            <i class="fa fa-calendar statistics-icon"></i>
            <time datetime="${videoData.publishedAt}">${videoData.publishedAt.slice(0, 10)}</time>
          </div>
          <div class="video-view-count">
            <i class="fa fa-eye statistics-icon"></i>
            ${videoData.viewCount}
          </div>
        </div>
        <div class="video-description">
        ${this.truncateString(videoData.description, 100)}
        </div>
      </div>
    </div>`;
    return videoHtml;
  }
}
