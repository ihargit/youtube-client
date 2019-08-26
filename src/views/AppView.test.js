import AppView from './AppView';

describe('AppView.prototype.render', () => {
  it('Should be an instance of Function', () => {
    expect(AppView.prototype.render).toBeInstanceOf(Function);
  });

  it('Should render correctly', () => {
    const context = {
      titles: [
        'Video about JS',
        'Another video ...',
        'I need another video',
      ],
    };

    AppView.prototype.render.call(context);

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
