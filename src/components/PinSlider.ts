import L, { DomEvent } from "leaflet";

const cache: Record<string, any> = {};

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
    preventDefault: (e: any) => DomEvent.preventDefault(e)
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
    console.log(e, marginX);
    cache.beforeImgWrap.style.width = e.pageX - marginX + 'px';
  }

  init() {
    const { beforeImg, afterImg, width, height, line, lineColor } =
      this.options;
    if (!beforeImg || !afterImg) return;

    if (!cache.cached) {
      const sliderWrap = document.createElement('div');
      const beforeImgWrap = document.createElement('div');
      const sliderBtn = document.createElement('div');
      const beforeImage = document.createElement('img');
      const afterImage = document.createElement('img');

      sliderWrap.className = 'slider-wrap';
      beforeImage.className = 'before-img';
      sliderBtn.className = 'slider-btn';

      beforeImage.src = beforeImg;
      afterImage.src = afterImg;

      console.group(beforeImage);

      if (!line) sliderBtn.style.background = 'none';
      else if (lineColor) sliderBtn.style.background = lineColor;

      sliderWrap.append(
        beforeImgWrap.appendChild(beforeImage),
        afterImage,
        sliderBtn
      );
      this.slider.appendChild(sliderWrap);

      Object.assign(cache, {
        sliderWrap,
        beforeImgWrap,
        sliderBtn,
        beforeImage,
        afterImage,
        marginX: 0,
        cached: true,
      });
    }

    Object.assign(this.slider.style, {
      width: `${width}px`,
      height: `${height}px`,
    });

    this.addListener();
  }
}

(() => {
  return {
    getCache() {
      return cache;
    }
  }
})();
