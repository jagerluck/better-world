import L from 'leaflet';
import { SliderCache, SliderMedia } from './types';
/**
 * Cached slider properties for ext functions
 */
const cache: SliderCache = {
  cached: false,
};

export class PinSlider<T extends { data: SliderMedia[] }> {
  options = {
    id: 0,
    sliderWidth: 800,
    sliderHeight: 600,
    data: {} as SliderMedia[],
    line: true,
    lineColor: '',
    map: {} as L.Map,
  };
  currentIndex = 0;
  maxIndex = 0;
  isPhone = false;
  // one modify-only slider
  slider = document.getElementById('slider')!;

  constructor(_options: T) {
    this.isPhone = window.hasOwnProperty('ontouchstart');
    this.moveHandler = this.moveHandler.bind(this);

    Object.assign(this.options, _options);
    this.slider.style.display = 'flex';

    this.init();
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

  startSlide(_e: any) {
    this.options.map.dragging.disable();
    const sliderWrap = cache.sliderWrap;
    this.isPhone
      ? sliderWrap.addEventListener('touchmove', this.moveHandler)
      : sliderWrap.addEventListener('mousemove', this.moveHandler);
  }
  endSlide(_e: any) {
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
    // hide/reveal 2nd image
    cache[this.options.id][this.currentIndex].afterImgWrap.style.width =
      cursorOffset;
  }

  async init() {
    if (!cache.cached) {
      const sliderWrap = document.createElement('div');
      const closeSliderBtn = document.createElement('span');
      const sliderBtn = document.createElement('div');
      const prevSlideBtn = document.createElement('span');
      const nextSlideBtn = document.createElement('span');
      
      // TODO: hover over box-shadow
      // const wrapSlide = document.createElement('div');
      // wrapSlide.className = 'testing';
      
      prevSlideBtn.className = 'prev-slide-btn';
      nextSlideBtn.className = 'next-slide-btn';
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
      prevSlideBtn.addEventListener('click', () => {
        this.prevSlide();
      });
      nextSlideBtn.addEventListener('click', () => {
        this.nextSlide();
      });

      this.slider.appendChild(sliderWrap);
      // center
      this.slider.style.marginTop = `-${this.options.sliderHeight / 2}px`;
      Object.assign(cache, {
        sliderWrap,
        closeSliderBtn,
        sliderBtn,
        prevSlideBtn,
        nextSlideBtn,
        cached: true,
      });
    }

    this.initMedia(this.options.data);
    this.addListener();
  }

  closeSlider() {
    cache.sliderWrap.innerHTML === '';
    cache.sliderBtn.style.left = '50%';
    this.slider.style.display = 'none';
    this.options.map.dragging.enable();
  }

  initMedia(data: SliderMedia[]) {
    cache[this.options.id] = {};

    data.forEach((d: SliderMedia, i) => {
      switch (d.type) {
        case 'image':
        case 'comparison':
          const [baseImage] = this.adjustImageSizesHTML(d.baseImage);
          const baseImgWrap = document.createElement('div');
          baseImgWrap.className = 'before-img-wrap';
          baseImgWrap.appendChild(baseImage);
          cache[this.options.id][i] = {
            type: d.type,
            baseImgWrap,
          };

          if ('comparison' === d.type) {
            const [afterImage] = this.adjustImageSizesHTML(d.afterImage);
            const afterImgWrap = document.createElement('div');
            afterImgWrap.className = 'after-img-wrap';
            afterImgWrap.appendChild(afterImage);
            Object.assign(cache[this.options.id][i], {
              afterImgWrap,
            });
          }
          break;
        case 'video':
          this.slider.innerHTML = `${'d.video'}`; // TODO
          break;
        default:
          break;
      }
    });

    this.maxIndex = Object.keys(cache[this.options.id]).length;
    // initial setup ------------------
    this.viewSlide();
  }

  nextSlide() {
    const nextIndex = this.currentIndex + 1;
    this.currentIndex = !cache[this.options.id][nextIndex] ? 0 : nextIndex;
    this.viewSlide();
  }
  prevSlide() {
    const prevIndex = this.currentIndex - 1;
    this.currentIndex = !cache[this.options.id][prevIndex]
      ? this.maxIndex - 1
      : prevIndex;
    this.viewSlide();
  }

  viewSlide() {
    console.log(this.currentIndex, this.maxIndex);
    cache.sliderWrap.innerHTML = '';
    switch (cache[this.options.id][this.currentIndex].type) {
      case 'image':
        cache.sliderWrap.append(
          cache[this.options.id][this.currentIndex].baseImgWrap,
          cache.prevSlideBtn,
          cache.nextSlideBtn,
          cache.closeSliderBtn
        );
        break;
      case 'comparison':
        cache.sliderWrap.append(
          cache[this.options.id][this.currentIndex].baseImgWrap,
          cache[this.options.id][this.currentIndex].afterImgWrap,
          cache.sliderBtn,
          cache.prevSlideBtn,
          cache.nextSlideBtn,
          cache.closeSliderBtn
        );
        break;
      case 'video':
    }
  }

  setupVideoPlayer() {}

  adjustImageSizesHTML(...srcs: string[]) {
    return srcs.map((src) => {
      const image = document.createElement('img');
      image.src = src;
      image.className = 'base-img';

      // @ts-ignore
      const pin = this;
      image.addEventListener('load', function () {
        const [widthDiff, heightDiff] = [
          this.width - pin.options.sliderWidth,
          this.height - pin.options.sliderHeight,
        ];
        const [width, height] =
          widthDiff > heightDiff
            ? [
                widthDiff > 0 ? pin.options.sliderWidth : this.width,
                this.height / (this.width / pin.options.sliderWidth),
              ]
            : [
                this.width / (this.height / pin.options.sliderHeight),
                heightDiff > 0 ? pin.options.sliderHeight : this.height,
              ];
        // place image at the center of the parent container
        this.style.marginLeft = `${(pin.options.sliderWidth - width) / 2}px`;
        this.style.marginTop = `${(pin.options.sliderHeight - height) / 2}px`;

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
        Object.assign(this, {
          width,
          height,
        });
      });

      return image;
    });
  }
}

// keep cache in memory
(() => {
  return {
    getCache() {
      return cache;
    },
  };
})();
