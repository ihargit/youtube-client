export default class Search {
  static renderSearchBar() {
    const searchBar = document.createElement('div');
    searchBar.classList.add('search-input-wrapper', 'fade-in');
    searchBar.innerHTML = `<input class="search-input" id="search-input" name="search" type="text" placeholder="What video to find on YouTube?" autofocus>
    <button class="search-input-button" type="button">
      <i class="fa fa-search"></i>
    </button>`;
    return searchBar;
  }
}
