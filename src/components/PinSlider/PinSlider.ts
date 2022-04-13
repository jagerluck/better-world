import L from 'leaflet';
import { SliderCache, SliderMedia } from './types';
/**
 * Cached slider properties for ext functions
 */
const cache: SliderCache = {
  cached: false,
};

export class PinSlider<T> {
  options = {
    id: 0,
    sliderWidth: 800,
    sliderHeight: 600,
    data: [{}],
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
    cache[this.options.id][this.currentIndex].afterImgWrap.style.width = cursorOffset;
  }

  async init() {
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

      this.slider.append(sliderWrap);

      // center
      this.slider.style.marginTop = `-${this.options.sliderHeight / 2}px`;
      Object.assign(cache, {
        sliderWrap,
        closeSliderBtn,
        sliderBtn,
        cached: true,
      });
    }

    // TODO: this.initMedia(pinData.data)
    this.initMedia([
      {
        type: 'comparison',
        baseImage: 'https://i.stack.imgur.com/ipp4N.png',
        afterImage:
          'https://i.pinimg.com/originals/ea/69/dc/ea69dc6226e72a33f82d3add20b470df.jpg',
      },
      {
        type: 'image',
        baseImage:
          'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80',
      },
    ]);
    this.addListener();
  }

  closeSlider() {
    cache.sliderWrap.innerHTML === '';
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
          cache[this.options.id][i] = { baseImgWrap };

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
          this.slider.innerHTML = `${d.video}`; // TODO
          break;
        default:
          break;
      }
    });

    // initial setup ------------------
    this.viewSlider();
  }

  viewSlider() {
    // separate this logic into method to activate navigation
    debugger;
    cache.sliderWrap.append(
      cache[this.options.id][this.currentIndex].baseImgWrap,
      cache[this.options.id][this.currentIndex].afterImgWrap,
      cache.sliderBtn,
      cache.closeSliderBtn
    );
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

(() => {
  return {
    getCache() {
      return cache;
    },
  };
})();
