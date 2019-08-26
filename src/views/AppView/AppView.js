import Search from './search/search';
import Slider from './slider/slider';
import SliderNavigation from './slider-navigation/sliderNavigation';
import Warnings from './warnings/warnings';


export default class AppView {
  constructor() {
    this.search = Search;
    this.slider = Slider;
    this.sliderNavigation = SliderNavigation;
    this.warnings = Warnings;
  }

  init() {
    const header = document.createElement('header');
    const main = document.createElement('main');

    header.appendChild(this.search.renderSearchBar());
    main.appendChild(this.slider.renderSlider());
    main.appendChild(this.sliderNavigation.renderSliderNavigation());
    main.appendChild(this.warnings.renderNotFoundWarning());
    main.appendChild(this.warnings.renderSameRequestWarning());

    document.body.appendChild(header);
    document.body.appendChild(main);
  }

  renderVideos(videosData) {
    this.slider.addVideosToSlider(videosData);
  }

  clearSliderFromVideos() {
    this.slider.emptySlider();
  }

  changeVideosTotalInSlider(number) {
    this.slider.changeVideosTotal(number);
  }

  showSliderNavigation() {
    this.sliderNavigation.showSliderNavigation();
  }

  hideSliderNavigation() {
    return this.sliderNavigation.hideSliderNav();
  }

  updateSliderNav(position) {
    this.sliderNavigation.updateSliderNavigation(position);
  }
}
