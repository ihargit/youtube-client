export default class SliderNavigation {
  static renderSliderNavigation() {
    const sliderNav = document.createElement('div');
    sliderNav.classList.add('slider-navigation');
    sliderNav.style.visibility = 'hidden';
    sliderNav.innerHTML = `<button class="nav-prev hidden" id="prev" type="button">
      <i class="fa fa-arrow-left nav-icon-prev"></i>
      <span class="tooltip tooltip-prev"><span>
    </button>
    <button class="nav-current" id="current" type="button">1</button>
    <button class="nav-next" id="next" type="button">
      <i class="fa fa-arrow-right nav-icon-next"></i>
      <span class="tooltip tooltip-next">2<span>
    </button>`;
    return sliderNav;
  }

  static hideSliderNav() {
    document.querySelector('.slider-navigation').style.visibility = 'hidden';
    return true;
  }

  static showSliderNavigation() {
    const nav = document.querySelector('.slider-navigation');
    nav.style.visibility = '';
    nav.classList.add('fade-in');
  }

  static updateSliderNavigation(currentPos) {
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
}
