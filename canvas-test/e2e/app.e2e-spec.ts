import { CanvasTestPage } from './app.po';

describe('canvas-test App', function() {
  let page: CanvasTestPage;

  beforeEach(() => {
    page = new CanvasTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
