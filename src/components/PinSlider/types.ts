export interface IPinSlider {
  sliderWidth: number;
  sliderHeight: number;
  sliderWrap: HTMLDivElement;
  afterImgWrap: HTMLDivElement;
  sliderBtn: HTMLElement;
  closeSliderBtn: HTMLElement;
  baseImage: HTMLImageElement;
  afterImage: HTMLImageElement;
  videoEl: HTMLVideoElement;
  prevSlideBtn: HTMLImageElement;
  nextSlideBtn: HTMLImageElement;
}

export interface SliderCache extends Partial<IPinSlider> {
  [k: number]: any; // pins with cached media
  cached: boolean;
}

export type MediaType = 'image' | 'comparison' | 'video'; 
export type SliderMedia = {
  type: MediaType;
  video?: any;
  baseImage?: string;
  afterImage?: string;
}

export type SliderData = {

}
