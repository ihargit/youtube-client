export default class AppModel {
  constructor(state) {
    this.state = state;
    this.nextPageToken = '';
  }

  static extractVideosData(data, dataViewCount) {
    const videosData = [];
    let dataViewCountCounter = 0;
    data.items.forEach((video) => {
      const vid = {};

      vid.thumbnailUrl = video.snippet.thumbnails.medium.url;
      vid.thumbnailWidth = video.snippet.thumbnails.medium.width;
      vid.title = video.snippet.title;
      vid.videoId = video.id.videoId;
      vid.channelTitle = video.snippet.channelTitle;
      vid.publishedAt = video.snippet.publishedAt;
      vid.description = video.snippet.description;
      vid.viewCount = dataViewCount.items[dataViewCountCounter].statistics.viewCount;
      dataViewCountCounter += 1;

      videosData.push(vid);
    });
    dataViewCountCounter = 0;
    return videosData;
  }

  static compileFetchViewCountUrl(fetchedVideosData, userKey) {
    const videosIds = [];
    fetchedVideosData.items.forEach(videoData => videosIds.push(videoData.id.videoId));
    const url = `https://www.googleapis.com/youtube/v3/videos?key=${userKey}&part=statistics&fields=items(statistics(viewCount))&id=${videosIds.toString()}`;
    return url;
  }

  async getVideosData(keyWord, userKey) {
    let { url } = this.state;
    url += keyWord;

    if (this.nextPageToken !== '') {
      url = `${url}&pageToken=${this.nextPageToken}`;
    }

    const responce = await fetch(url);
    const data = await responce.json();

    if (data.nextPageToken) {
      this.nextPageToken = data.nextPageToken;
    } else {
      this.nextPageToken = '';
    }

    const viewCountUrl = AppModel.compileFetchViewCountUrl(data, userKey);

    const responceViewCount = await fetch(viewCountUrl);
    const dataViewCount = await responceViewCount.json();

    return AppModel.extractVideosData(data, dataViewCount);
  }
}
