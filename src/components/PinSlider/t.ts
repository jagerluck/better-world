export interface IPinSlider {
  sliderWidth: number;
  sliderHeight: number;
  sliderWrap: HTMLDivElement;
  afterImgWrap: HTMLDivElement;
  sliderBtn: HTMLElement;
  beforeImage: HTMLImageElement;
  afterImage: HTMLImageElement;
}

export interface SliderCache extends Partial<IPinSlider> {
  cached: boolean;
}
