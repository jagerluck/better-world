import L, { DomEvent } from 'leaflet';

const cache: Record<string, any> = {};
const sliderDefaults = {
  maxWidth: 850,
  maxHeight: 500,
};

const adjustImageSize = (
  image: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
) => {
  const [widthDiff, heightDiff] = [
    image.width - maxWidth,
    image.height - maxHeight,
  ];
  const [width, height] =
    widthDiff > heightDiff
      ? [
          widthDiff > 0 ? maxWidth : image.width,
          image.height / (image.width / maxWidth),
        ]
      : [
          image.width / (image.height / maxHeight),
          heightDiff > 0 ? maxHeight : image.height,
        ];

  /** Examples:
   * 70x40 vs 50x50
   * 70-50(width - maxWidth) > 40-50(height - maxHeight)
   * so 50 is needed width and height is:
   * 40(img height) / (70/50)(needed propotion)
   *
   * 70x40 vs 150x30
   * 70-150(width - maxWidth) > 40-30(height - maxHeight)
   * so 30 is needed height and width is:
   * 70(img width) / (40/30)(needed propotion)
   */

  Object.assign(image, {
    width,
    height,
  })
};

export class PinSlider<T> {
  options = {
    width: '',
    height: '',
    beforeImg: null,
    afterImg: null,
    line: true,
    lineColor: '',
    nameId: 'slider',
    stopPropagation: (e: any) => DomEvent.stopPropagation(e),
    preventDefault: (e: any) => DomEvent.preventDefault(e),
  };
  isPhone = false;
  // there is only one modify-only slider
  slider = document.getElementById('slider')!;

  constructor(options: T) {
    this.isPhone = window.hasOwnProperty('ontouchstart');
    this.moveHandler = this.moveHandler.bind(this);

    this.options = { ...this.options, ...options };

    this.init();
  }

  closeSlider() {
    this.slider.innerHTML = '';
    this.slider.style.display = 'none';
  }

  addListener() {
    const sliderBtn = cache.sliderBtn;

    if (this.isPhone) {
      sliderBtn.ontouchstart = this.startSlide.bind(this);
      sliderBtn.ontouchend = this.endSlide.bind(this);
    } else {
      sliderBtn.onmousedown = this.startSlide.bind(this);
      sliderBtn.onmouseup = this.endSlide.bind(this);
    }
  }

  stopEvent(e: L.LeafletMouseEvent) {
    this.options.stopPropagation(e);
    this.options.preventDefault(e);
  }

  startSlide(e: any) {
    console.log(e);
    this.stopEvent(e);
    const sliderWrap = cache.sliderWrap;
    const sliderBtn = cache.sliderBtn;

    const slideEvent = e.originalEvent;
    cache.marginX = e.pageX - e.screenX;
    // cache.marginX = e.pageX - sliderBtn.offsetLeft;
    this.isPhone
      ? sliderWrap.addEventListener('touchmove', this.moveHandler)
      : sliderWrap.addEventListener('mousemove', this.moveHandler);
  }

  endSlide(e: any) {
    console.log('stopped hey');
    this.stopEvent(e);
    const sliderWrap = cache.sliderWrap;
    this.isPhone
      ? sliderWrap.removeEventListener('touchmove', this.moveHandler)
      : sliderWrap.removeEventListener('mousemove', this.moveHandler);
  }

  moveHandler(e: any) {
    let marginX = cache.marginX;
    cache.sliderBtn.style.left = e.screenX + 'px';
    // change position of an image
    // cache.beforeImgWrap.style.width = e.pageX - marginX + 'px';
  }

  init() {
    const { beforeImg, afterImg, width, height, line, lineColor } =
      this.options;
    if (!beforeImg || !afterImg) return;

    if (!cache.cached) {
      const sliderWrap = document.createElement('div');
      const afterImgWrap = document.createElement('div');
      const beforeImgWrap = document.createElement('div');
      const sliderBtn = document.createElement('div');
      const beforeImage = document.createElement('img');
      const afterImage = document.createElement('img');

      sliderWrap.className = 'slider-wrap';
      beforeImage.className = 'before-img';
      afterImage.className = 'after-img';
      sliderBtn.className = 'slider-btn';
      afterImgWrap.className = 'after-img-wrap';
      beforeImgWrap.className = 'before-img-wrap';

      beforeImage.src = beforeImg;
      afterImage.src = afterImg;

      if (!line) sliderBtn.style.background = 'none';
      else if (lineColor) sliderBtn.style.background = lineColor;

      const [maxWidth, maxHeight] = [
        Math.min(
          afterImage.naturalWidth,
          beforeImage.naturalWidth,
          sliderDefaults.maxWidth
        ),
        Math.min(
          afterImage.naturalHeight,
          beforeImage.naturalHeight,
          sliderDefaults.maxHeight
        ),
      ];

      [beforeImage, afterImage].forEach((img) => adjustImageSize(img, maxWidth, maxHeight));

      afterImgWrap.appendChild(afterImage);
      beforeImgWrap.appendChild(beforeImage);
      sliderWrap.append(beforeImgWrap, afterImgWrap, sliderBtn);
      this.slider.appendChild(sliderWrap);

      Object.assign(sliderWrap.style, {
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
        // width: `fit-content`,
        // height: `fit-content`,
      });

      Object.assign(cache, {
        sliderWrap,
        afterImgWrap,
        sliderBtn,
        beforeImage,
        afterImage,
        marginX: 0,
        cached: true,
      });
    }

    // Object.assign(this.slider.style, {
    //   width: `${width}px`,
    //   height: `${height}px`,
    //   // width: `fit-content`,
    //   // height: `fit-content`,
    // });

    this.addListener();
  }
}

(() => {
  return {
    getCache() {
      return cache;
    },
  };
})();
