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
  currentMedia = {};
  isPhone = false;
  // one modify-only slider
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

    // messy to setup all slider related html here. runs once though
    if (!cache.cached) {
      const sliderWrap = document.createElement('div');
      const baseImgWrap = document.createElement('div');
      const closeSliderBtn = document.createElement('span');
      const baseImage = document.createElement('img');
      sliderWrap.className = 'slider-wrap';
      baseImage.className = 'base-img';
      baseImgWrap.className = 'base-img-wrap';
      closeSliderBtn.className = 'close-slider-btn';

      const afterImgWrap = document.createElement('div');
      const sliderBtn = document.createElement('div');
      const afterImage = document.createElement('img');
      afterImage.className = 'after-img';
      sliderBtn.className = 'slider-btn';
      afterImgWrap.className = 'after-img-wrap';

      closeSliderBtn.addEventListener('click', () => {
        this.closeSlider();
      });

      // this.setupComparisonViewer();

      baseImgWrap.appendChild(baseImage);
      afterImgWrap.appendChild(afterImage);
      sliderWrap.append(baseImgWrap, afterImgWrap, sliderBtn);
      this.slider.append(sliderWrap, closeSliderBtn); // TODO: closeButton

      Object.assign(cache, {
        sliderWrap,
        afterImgWrap,
        sliderBtn,
        baseImage,
        afterImage,
        cached: true,
      });
    }

    this.slider.style.marginTop = `-${sliderHeight / 2}px`; // center vertically
    Object.assign(cache, {
      sliderWidth,
      sliderHeight,
    });
    cache.baseImage.src = baseImg;
    cache.afterImage.src = afterImg;

    await this.loadSliderImages([cache.baseImage, cache.afterImage]);

    if (!line) cache.sliderBtn.style.background = 'none';
    else if (lineColor) cache.sliderBtn.style.background = lineColor;

    [cache.baseImage, cache.afterImage].forEach((img, i) =>
      this.adjustImageSize(img)
    );

    cache.afterImgWrap.style.width = '50%';
    cache.sliderBtn.style.left = '50%';

    Object.assign(cache.sliderWrap.style, {
      width: `${cache.sliderWidth + 10}px`, // + padding
      height: `${cache.sliderHeight + 10}px`,
    });

    this.addListener();
  }

  closeSlider() {
    // this.slider.innerHTML = '';
    this.slider.style.display = 'none';
    this.options.map.dragging.enable();
  }

  initMedia(data: any) {
    data.forEach((d: SliderMedia) => {
      switch (d.type) {
        case 'comparison':
          const baseImage = this.adjustImageSizeHTML(d.baseImage);
          const afterImage = this.adjustImageSizeHTML(d.afterImage);
          this.slider.innerHTML += `
          <div class="slider-wrap" style="width: ${
            cache.sliderWidth + 10
          }px; height: ${cache.sliderHeight + 10}px;">
            <div class="base-img-wrap">
            ${baseImage.outerHTML}
            </div>
            <div class="after-img-wrap" style="width: 50%;">
            ${afterImage.outerHTML}
            </div>
            <div class="slider-btn" style="background: rgb(51, 51, 51)"></div>
          </div>`;
          break;
        case 'video':
          this.slider.innerHTML += `
          <div class="slider-wrap" style="width: ${
            cache.sliderWidth + 10
          }px; height: ${cache.sliderHeight + 10}px;">
          </div>`
          break;
        case 'image':
          const image = this.adjustImageSizeHTML(d.baseImage);
          this.slider.innerHTML += `
          <div class="slider-wrap" style="width: ${
            cache.sliderWidth + 10
          }px; height: ${cache.sliderHeight + 10}px;">
            <div class="base-img-wrap">
            ${image.outerHTML}
            </div>
          </div>`;
          break;
      }
    });
  }

  setupComparisonViewer() {}

  setupVideoPlayer() {}

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

  adjustImageSizeHTML(src: string) {
    const image = document.createElement('img');
    image.className = 'base-img';
    image.src = src;

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
