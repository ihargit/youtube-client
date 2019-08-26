import AppModel from '../models/AppModel';
import AppView from '../views/AppView';

export default class App {
  constructor() {
    this.userKey = 'AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y';
    this.videosInRequest = 15;
    this.videosPerPage = 0;
    this.state = {
      url: `https://www.googleapis.com/youtube/v3/search?key=${this.userKey}&type=video&fields=nextPageToken,items(id(videoId),snippet(publishedAt,title,description,channelTitle,thumbnails(medium)))&part=snippet&maxResults=${this.videosInRequest}&q=`,
    };
    this.keyWord = '';
    this.prevKeyWord = '';
    this.model = new AppModel(this.state);
    this.view = new AppView();
  }

  async addVideosToSlider(keyWord) {
    const videosData = await this.model.getVideosData(keyWord, this.userKey);
    if (videosData.length > 0) {
      this.view.renderVideos(videosData);
      return true;
    }
    document.querySelector('.not-found').classList.remove('hidden');
    setTimeout(() => document.querySelector('.not-found').classList.add('hidden'), 3000);
    return false;
  }

  async redrawSliderFromScratch(searchInput) {
    this.prevKeyWord = this.keyWord;
    this.keyWord = searchInput.value; // previosly was this.keyWord !== ''
    if (this.keyWord && this.prevKeyWord !== this.keyWord) {
      const sliderWrapper = document.querySelector('.slider-wrapper');
      const navHidden = await this.view.hideSliderNavigation();
      if (navHidden) {
        this.view.clearSliderFromVideos();
        this.view.updateSliderNav(0);
        this.view.changeVideosTotalInSlider(this.videosInRequest);
        document.documentElement.style.setProperty('--position', '0');
        const videosAdded = await this.addVideosToSlider(this.keyWord);
        if (videosAdded) {
          sliderWrapper.classList.add('fade-in');
          await this.view.showSliderNavigation();
          setTimeout(() => {
            sliderWrapper.classList.remove('fade-in');
            document.querySelector('.slider-navigation').classList.remove('fade-in');
          }, 1000);
        }
        this.videosPerPage = getComputedStyle(document.documentElement).getPropertyValue('--videos-per-page');
      }
    } else {
      document.querySelector('.same-request').classList.remove('hidden');
      setTimeout(() => document.querySelector('.same-request').classList.add('hidden'), 2000);
    }
  }

  uploadMoreVideosIfNeeded() {
    const videosTotal = Number(getComputedStyle(document.documentElement).getPropertyValue('--videos-total'));
    const vidPerPage = Number(getComputedStyle(document.documentElement).getPropertyValue('--videos-per-page'));
    const position = Number(getComputedStyle(document.documentElement).getPropertyValue('--position'));

    if ((videosTotal - vidPerPage * position) < 14) {
      this.addVideosToSlider(this.keyWord);
      this.view.changeVideosTotalInSlider(videosTotal + this.videosInRequest);
    }
  }

  addEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchInputButton = document.querySelector('.search-input-button');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    let sliderGrabStatus = 0;
    let closestVideoTop;
    let sliderSwipeReady = false;
    let startCursorPosition;
    let currentCursorPositition;
    let cursorShiftX;

    function updateSliderNavigation(currentPos) {
      document.getElementById('current').innerText = currentPos + 1;
      document.querySelector('.tooltip-next').innerText = currentPos + 2;
      if (currentPos > 0) {
        document.querySelector('.tooltip-prev').innerText = currentPos;
        if (document.querySelector('.nav-prev').classList.contains('hidden')) {
          document.querySelector('.nav-prev').classList.remove('hidden');
        }
      } else {
        document.querySelector('.nav-prev').classList.add('hidden');
      }
    }

    function updatePagePosition(dif) {
      const currentPosition = getComputedStyle(document.documentElement).getPropertyValue('--position');
      let newPosition;
      if (currentPosition >= 0) {
        if (dif > 0) {
          newPosition = Number(currentPosition) + 1;
        } else {
          newPosition = Number(currentPosition) - 1;
          if (newPosition < 0) {
            newPosition = 0;
          }
        }
        document.documentElement.style.setProperty('--position', newPosition);
        setTimeout(() => {
          updateSliderNavigation(Math.floor(newPosition));
        }, 250);
      }
    }

    searchInputButton.addEventListener('click', () => {
      this.redrawSliderFromScratch(searchInput);
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' && document.activeElement === searchInput) {
        this.redrawSliderFromScratch(searchInput);
      }
    });

    document.addEventListener('touchstart', (event) => {
      // event.preventDefault();
      const elementBelow = document.elementFromPoint(event.changedTouches[0].clientX,
        event.changedTouches[0].clientY);

      if (elementBelow.closest('.slider-wrapper') && !elementBelow.closest('.video-top')) {
        sliderSwipeReady = true;
        startCursorPosition = event.changedTouches[0].clientX;
        document.querySelector('.slider-wrapper').classList.remove('smooth-transform');
      }
    });

    document.addEventListener('mousedown', (event) => {
      const elementBelow = document.elementFromPoint(event.clientX, event.clientY);

      if (elementBelow.closest('.slider-wrapper') && !elementBelow.closest('.video-top')) {
        sliderSwipeReady = true;
        startCursorPosition = event.clientX;
        document.querySelector('.slider-wrapper').classList.remove('smooth-transform');
      }

      // change cursor on video when grabbing
      if (!elementBelow.closest('.video-top')) {
        if (elementBelow.closest('.slider-wrapper')) {
          sliderWrapper.classList.add('grabbing');
          sliderGrabStatus = 1;
          if (elementBelow.closest('.video-inner')) {
            closestVideoTop = elementBelow.closest('.video-inner').querySelector('.video-top');
            closestVideoTop.style.cursor = 'grabbing';
            closestVideoTop.style.transform = 'none';
            closestVideoTop.style.boxShadow = 'none';
            sliderGrabStatus = 2;
          }
        }
      }

      if (elementBelow.closest('.nav-next')) {
        elementBelow.closest('.nav-next').querySelector('.tooltip').classList.add('tooltip-show');
      }

      if (elementBelow.closest('.nav-prev')) {
        elementBelow.closest('.nav-prev').querySelector('.tooltip').classList.add('tooltip-show');
      }
    });

    document.addEventListener('touchend', () => {
      if (sliderSwipeReady) {
        document.querySelector('.slider-wrapper').classList.add('smooth-transform');
        if (Math.abs(cursorShiftX) > 150) {
          if ((startCursorPosition + cursorShiftX) < startCursorPosition) {
            document.documentElement.style.setProperty('--drag-mouse', '0rem');
            updatePagePosition(1);
            this.uploadMoreVideosIfNeeded();
          } else {
            document.documentElement.style.setProperty('--drag-mouse', '0rem');
            updatePagePosition(-1);
          }
        } else {
          document.documentElement.style.setProperty('--drag-mouse', '0rem');
        }
        sliderSwipeReady = false;
      }
    });

    document.addEventListener('mouseup', (event) => {
      const elementBelow = document.elementFromPoint(event.clientX, event.clientY);

      if (sliderSwipeReady) {
        document.querySelector('.slider-wrapper').classList.add('smooth-transform');
        if (Math.abs(cursorShiftX) > 150) {
          if ((startCursorPosition + cursorShiftX) < startCursorPosition) {
            document.documentElement.style.setProperty('--drag-mouse', '0rem');
            updatePagePosition(1);
            this.uploadMoreVideosIfNeeded();
          } else {
            document.documentElement.style.setProperty('--drag-mouse', '0rem');
            updatePagePosition(-1);
          }
        } else {
          document.documentElement.style.setProperty('--drag-mouse', '0rem');
        }
        sliderSwipeReady = false;
      }

      if (elementBelow) {
        if (elementBelow.closest('.nav-next')) {
          updatePagePosition(1);
          this.uploadMoreVideosIfNeeded();
        }
        if (elementBelow.closest('.nav-prev')) {
          updatePagePosition(-1);
        }
      }

      if (sliderGrabStatus > 0) {
        sliderWrapper.classList.remove('grabbing');
        if (sliderGrabStatus === 2) {
          closestVideoTop.style.cursor = '';
          closestVideoTop.style.transform = '';
          closestVideoTop.style.boxShadow = '';
        }
        sliderGrabStatus = 0;
      }

      if (document.querySelector('.tooltip-prev').classList.contains('tooltip-show')) {
        setTimeout(() => {
          document.querySelector('.tooltip-prev').classList.remove('tooltip-show');
        }, 50);
      }

      if (document.querySelector('.tooltip-next').classList.contains('tooltip-show')) {
        setTimeout(() => {
          document.querySelector('.tooltip-next').classList.remove('tooltip-show');
        }, 50);
      }
    });

    document.querySelector('.slider-wrapper').addEventListener('touchmove', (event) => {
      // event.preventDefault();
      if (sliderSwipeReady) {
        currentCursorPositition = event.changedTouches[0].clientX;
        cursorShiftX = currentCursorPositition - startCursorPosition;
        document.documentElement.style.setProperty('--drag-mouse', `${cursorShiftX}px`);
      }
    });

    document.querySelector('.slider-wrapper').addEventListener('mousemove', (event) => {
      if (sliderSwipeReady) {
        currentCursorPositition = event.clientX;
        cursorShiftX = currentCursorPositition - startCursorPosition;
        document.documentElement.style.setProperty('--drag-mouse', `${cursorShiftX}px`);
      }
    });

    window.addEventListener('resize', () => {
      const currentVideosPerPage = getComputedStyle(document.documentElement).getPropertyValue('--videos-per-page');
      if (currentVideosPerPage !== this.videosPerPage) {
        const currentPosition = getComputedStyle(document.documentElement).getPropertyValue('--position');
        const newPosition = this.videosPerPage * currentPosition / currentVideosPerPage;
        document.documentElement.style.setProperty('--position', newPosition);
        this.videosPerPage = currentVideosPerPage;
        updateSliderNavigation(Math.floor(newPosition));
      }
    });
  }

  start() {
    this.view.init();
    this.addEventListeners();
  }
}
