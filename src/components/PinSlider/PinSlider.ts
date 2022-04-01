import L from 'leaflet';
import { SliderCache } from './t';
// import image from '../../assets/red-pin.png';
/**
 * Cached slider properties for ext functions
 *
 * Constructor is used for possible specific Pins in future
 */
const cache: SliderCache = {
  cached: false,
};

export class PinSlider<T> {
  options = {
    sliderWidth: 800,
    sliderHeight: 600,
    beforeImg: '',
    afterImg: '',
    line: true,
    lineColor: '',
    map: {} as L.Map,
  };
  isPhone = false;
  // there is only one modify-only slider
  slider = document.getElementById('slider')!;

  constructor(options: T) {
    this.isPhone = window.hasOwnProperty('ontouchstart');
    this.moveHandler = this.moveHandler.bind(this);

    this.slider.style.display = 'flex';
    this.options = { ...this.options, ...options };

    this.init();
  }

  addListener() {
    if (this.isPhone) {
      cache.sliderBtn.ontouchstart = this.startSlide.bind(this);
      cache.sliderBtn.ontouchend = this.endSlide.bind(this);
    } else {
      cache.sliderBtn.onmousedown = this.startSlide.bind(this);
      cache.sliderBtn.onmouseup = this.endSlide.bind(this);
    }
  }

  startSlide(e: any) {
    this.options.map.dragging.disable();
    this.isPhone
      ? cache.sliderWrap.addEventListener('touchmove', this.moveHandler)
      : cache.sliderWrap.addEventListener('mousemove', this.moveHandler);
  }
  endSlide(e: any) {
    this.options.map.dragging.enable();
    const sliderWrap = cache.sliderWrap;
    this.isPhone
      ? sliderWrap.removeEventListener('touchmove', this.moveHandler)
      : sliderWrap.removeEventListener('mousemove', this.moveHandler);
  }

  moveHandler(e: any) {
    // TODO: button triggers +1 unnecessary event
    if (e.path[0].className === 'slider-btn') return;
    const cursorOffset = e.layerX + 'px';

    cache.sliderBtn.style.left = cursorOffset;
    // hide/unhide 2nd image
    cache.afterImgWrap.style.width = cursorOffset;
  }

  async init() {
    const { beforeImg, afterImg, line, lineColor, sliderWidth, sliderHeight } =
      this.options;

    // little bit messy to setup all slider related html here, but this setup runs only once
    if (!cache.cached) {
      const sliderWrap = document.createElement('div');
      const afterImgWrap = document.createElement('div');
      const beforeImgWrap = document.createElement('div');
      const sliderBtn = document.createElement('div');
      const beforeImage = document.createElement('img');
      const afterImage = document.createElement('img');
      const closeSliderBtn = document.createElement('span');

      sliderWrap.className = 'slider-wrap';
      beforeImage.className = 'before-img';
      afterImage.className = 'after-img';
      sliderBtn.className = 'slider-btn';
      afterImgWrap.className = 'after-img-wrap';
      beforeImgWrap.className = 'before-img-wrap';
      closeSliderBtn.className = 'close-slider-btn';

      closeSliderBtn.addEventListener('click', () => { 
        this.closeSlider();
      })

      afterImgWrap.appendChild(afterImage);
      beforeImgWrap.appendChild(beforeImage);
      sliderWrap.append(beforeImgWrap, afterImgWrap, sliderBtn, closeSliderBtn);
      this.slider.appendChild(sliderWrap);

      Object.assign(cache, {
        sliderWrap,
        afterImgWrap,
        sliderBtn,
        beforeImage,
        afterImage,
        cached: true,
      });
    }

    this.slider.style.marginTop = `-${sliderHeight / 2}px`; // center vertically
    Object.assign(cache, {
      sliderWidth,
      sliderHeight,
    });
    cache.beforeImage.src = beforeImg;
    cache.afterImage.src = afterImg;

    await this.loadSliderImages([cache.beforeImage, cache.afterImage]);

    if (!line) cache.sliderBtn.style.background = 'none';
    else if (lineColor) cache.sliderBtn.style.background = lineColor;

    [cache.beforeImage, cache.afterImage].forEach((img, i) =>
      this.adjustImageSize(img)
    );

    // defaults
    cache.afterImgWrap.style.width = '50%';
    cache.sliderBtn.style.left = '50%';
    Object.assign(cache.sliderWrap.style, {
      width: `${cache.sliderWidth + 10}px`, // + padding
      height: `${cache.sliderHeight + 10}px`,
    });

    this.addListener();
  }

  closeSlider() {
    this.slider.style.display = 'none';
    this.options.map.dragging.enable();
  }

  adjustImageSize(image: HTMLImageElement) {
    const [widthDiff, heightDiff] = [
      image.width - cache.sliderWidth,
      image.height - cache.sliderHeight,
    ];
    const [width, height] =
      widthDiff > heightDiff
        ? [
            widthDiff > 0 ? cache.sliderWidth : image.width,
            image.height / (image.width / cache.sliderWidth),
          ]
        : [
            image.width / (image.height / cache.sliderHeight),
            heightDiff > 0 ? cache.sliderHeight : image.height,
          ];
    // place image at the center of the parent container
    image.style.marginLeft = `${(cache.sliderWidth - width) / 2}px`;
    image.style.marginTop = `${(cache.sliderHeight - height) / 2}px`;

    /** Examples for 2 images💁:
     * 70x40 & 50x50
     * 70-50(width - maxWidth) > 40-50(height - maxHeight)
     * so 50 is needed width and height is:
     * 40(img height) / (70/50)(needed propotion)
     *
     * 70x40 & 150x30
     * 70-150(width - maxWidth) > 40-30(height - maxHeight)
     * so 30 is needed height and width is:
     * 70(img width) / (40/30)(needed propotion)
     */

    Object.assign(image, {
      width,
      height,
    });
  }

  async loadSliderImages(images: HTMLImageElement[]) {
    await Promise.all(images.map((img) => img.decode()));
    console.log('images loaded ✔️');
  }
}

(() => {
  return {
    getCache() {
      return cache;
    },
  };
})();
