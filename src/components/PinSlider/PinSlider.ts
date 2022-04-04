import L from 'leaflet';
import { SliderCache, SliderMedia } from './types';
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
    data: [{}],
    baseImg: '',
    afterImg: '',
    video: '',
    line: true,
    lineColor: '',
    map: {} as L.Map,
  };
  currentIndex = 0;
  currentMedia = {};
  isPhone = false;
  // one modify-only slider
  slider = document.getElementById('slider')!;

  constructor(options: T) {
    this.isPhone = window.hasOwnProperty('ontouchstart');
    this.moveHandler = this.moveHandler.bind(this);

    this.slider.style.display = 'flex';

    this.init();
  }

  addListener() {
    // const sliderBtn = document.getElementsByClassName('slider-btn')[0];
    const sliderBtn = cache.sliderBtn;
    if (this.isPhone) {
      sliderBtn.ontouchstart = this.startSlide.bind(this);
      sliderBtn.ontouchend = this.endSlide.bind(this);
    } else {
      sliderBtn.onmousedown = this.startSlide.bind(this);
      sliderBtn.onmouseup = this.endSlide.bind(this);
    }
  }

  startSlide(e: any) {
    this.options.map.dragging.disable();
    const sliderWrap = cache.sliderWrap;
    this.isPhone
      ? sliderWrap.addEventListener('touchmove', this.moveHandler)
      : sliderWrap.addEventListener('mousemove', this.moveHandler);
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
    debugger;
    if (e.path[0].className === 'slider-btn') return;
    const cursorOffset = e.layerX + 'px';

    cache.sliderBtn.style.left = cursorOffset;
    // hide/unhide 2nd image
    cache.afterImgWrap.style.width = cursorOffset; // use it through currentElement[currentIndex]
  }

  /**
   * init function
   * create slider container, barebone structure with navigation and controllers
   * NOTE: #slider | .slider-wrapper | navigation etc.
   * insert all the required functionality to handle different types of materials
   *
   */

  async init() {
    const { baseImg, afterImg, line, lineColor, sliderWidth, sliderHeight } =
      this.options;

    if (!cache.cached) {
      const sliderWrap = document.createElement('div');
      const closeSliderBtn = document.createElement('span');
      const sliderBtn = document.createElement('div');
      sliderWrap.className = 'slider-wrap';
      closeSliderBtn.className = 'close-slider-btn';
      sliderBtn.className = 'slider-btn';

      Object.assign(sliderWrap.style, {
        width: `${this.options.sliderWidth + 10}px`,
        height: `${this.options.sliderHeight + 10}px`,
      });

      closeSliderBtn.addEventListener('click', () => {
        this.closeSlider();
      });

      this.slider.append(sliderWrap, sliderBtn, closeSliderBtn); // TODO: closeButton
      // slider btn - add to DOM, but toggle display for comparisons
      this.slider.style.marginTop = `-${sliderHeight / 2}px`; // center vertically
      Object.assign(cache, {
        sliderWrap,
        closeSliderBtn,
        sliderBtn,
        cached: true,
      });
    }

    this.initMedia([
      {
        type: 'comparison',
        baseImage: 'https://i.stack.imgur.com/ipp4N.png',
        afterImage:
          'https://i.pinimg.com/originals/ea/69/dc/ea69dc6226e72a33f82d3add20b470df.jpg',
      },
    ]);
    this.addListener();
  }

  closeSlider() {
    // this.slider.innerHTML = '';
    this.slider.style.display = 'none';
    this.options.map.dragging.enable();
  }

  initMedia(data: SliderMedia[]) {
    data.forEach((d: SliderMedia) => {
      switch (d.type) {
        case 'comparison':
          const baseImage = this.adjustImageSizeHTML(d.baseImage);
          const afterImage = this.adjustImageSizeHTML(d.afterImage);
          const images = `
            <div class="base-img-wrap">
            ${baseImage.outerHTML}
            </div>
            <div class="after-img-wrap" style="width: 50%;">
            ${afterImage.outerHTML}
            </div>
          `;
          cache[this.currentIndex].images = images;
          cache.sliderWrap.innerHTML = images;
          break;
        case 'video':
          this.slider.innerHTML = `${d.video}`;
          break;
        case 'image':
          const image = this.adjustImageSizeHTML(d.baseImage);
          cache.sliderWrap.innerHTML = `
            <div class="base-img-wrap">
            ${image.outerHTML}
            </div>
          `;
          break;
      }
    });
  }

  setupComparisonViewer() {}

  setupVideoPlayer() {}

  adjustImageSizeHTML(src: string) {
    const image = document.createElement('img');
    image.className = 'base-img';
    image.src = src;

    const [widthDiff, heightDiff] = [
      image.width - this.options.sliderWidth,
      image.height - this.options.sliderHeight,
    ];
    const [width, height] =
      widthDiff > heightDiff
        ? [
            widthDiff > 0 ? this.options.sliderWidth : image.width,
            image.height / (image.width / this.options.sliderWidth),
          ]
        : [
            image.width / (image.height / this.options.sliderHeight),
            heightDiff > 0 ? this.options.sliderHeight : image.height,
          ];
    // place image at the center of the parent container
    image.style.marginLeft = `${(this.options.sliderWidth - width) / 2}px`;
    image.style.marginTop = `${(this.options.sliderHeight - height) / 2}px`;
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

    return image;
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
