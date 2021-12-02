import { seasons } from './getScaledBenchmarkCutlines';
import { getScreeningWindow } from '../../../services/screeningWindowService';

//TODO: This is a really simple implementation
//make this more accurate in the future

export default function getSeason(date = new Date()) {
  let windowDate = new Date(date);
  let window = getScreeningWindow(windowDate);
  switch(window){
    case 'MOY':
      return seasons.WINTER;
    case 'EOY':
      return seasons.SPRING;
    case 'BOY':
      return seasons.FALL;
  }
}