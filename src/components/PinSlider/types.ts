export interface IPinSlider {
  sliderWidth: number;
  sliderHeight: number;
  sliderWrap: HTMLDivElement;
  afterImgWrap: HTMLDivElement;
  sliderBtn: HTMLElement;
  baseImage: HTMLImageElement;
  afterImage: HTMLImageElement;
}

export interface SliderCache extends Partial<IPinSlider> {
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
