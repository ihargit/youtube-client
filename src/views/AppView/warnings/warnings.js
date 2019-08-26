export default class Warnings {
  static renderNotFoundWarning() {
    const nfound = document.createElement('div');
    nfound.classList.add('warning', 'not-found', 'hidden', 'fade-in');
    nfound.innerHTML = '<b>Nothing</br>found</b>';
    return nfound;
  }

  static renderSameRequestWarning() {
    const nfound = document.createElement('div');
    nfound.classList.add('warning', 'same-request', 'hidden', 'fade-in');
    nfound.innerHTML = '<b>The same</br>(or empty)</br>request</b>';
    return nfound;
  }
}
