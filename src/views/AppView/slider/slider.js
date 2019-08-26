import Video from './video/video';

export default class Slider {
  constructor() {
    this.video = Video;
  }

  static renderSlider() {
    const sliderWrapper = document.createElement('ul');
    sliderWrapper.classList.add('slider-wrapper', 'smooth-transform');
    return sliderWrapper;
  }

  static addVideosToSlider(allVideosData) {
    const videos = new DocumentFragment();
    const sliderWrapper = document.querySelector('.slider-wrapper');
    allVideosData.forEach((oneVideoData) => {
      videos.append(video.renderVideo(oneVideoData));
    });
    sliderWrapper.append(videos);
  }

  static emptySlider() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    while (sliderWrapper.firstChild) {
      sliderWrapper.removeChild(sliderWrapper.firstChild);
    }
  }

  static changeVideosTotal(number) {
    document.documentElement.style.setProperty('--videos-total', number);
  }
}
