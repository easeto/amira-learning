import {benchmarkValues,spanishBenchmarkValues} from '../values/benchmarks';
import { scaleScore, scaleORF } from './scaling';
import {locales} from "Constants/constants";

// TODO abstract and consolidate these constants
export const benchmarkTypes = {
  WCPM: 'WCPM',
  Lexile: 'Lexile',
  AREA: 'AREA',
  EVS: 'EVS',
  DRA: 'DRA',
  PSF: 'PSF',
  NWF: 'NWF',
  ESRI: 'ESRI',
}
export const seasons = {
  FALL: 'fall',
  WINTER: 'winter',
  SPRING: 'spring',
}

function getDistrictBenchmarks(benchmark, type, season,customBenchmarks) {
  let grade = benchmark.grade;
  let value = benchmark.value;
  let districtCutlines = customBenchmarks.district.cutlines.map(cutline => {
    let field = cutline.grades[grade].seasons.find(seasonField => {
      // TODO use same enum throughout UI so that this toLowerCase is unnecessary
      return seasonField.id.toLowerCase() == season;
    });
    let scaledValue = scaleORF(field.value, customBenchmarks.district.meta.scale, type);
    return {
      value: scaledValue,
      label: cutline.label,
      id: benchmark.value,
    }
  });
  return districtCutlines;
}

function scaleValue(value, currentType, destinationType) {
  return value;
}

function getNationalNormBenchmarks(grade, type, season, locale) {
  if(benchmarkTypes[type]) {
    const percentiles = [25, 50, 75]; // for MVP, same percentiles for every metric
    let benchmarks = percentiles.map((perc) => {
      let values = (locale === (locales.ES_MX)) ? spanishBenchmarkValues : benchmarkValues;
      let rawBench = values.find(b => b.Grade === grade && b.Percentile === perc);
      let lookupValue = type;
      let benchmarkValue = rawBench[lookupValue + '_' + season];
      let suffix = locale === (locales.ES_MX) ? 'th %' : 'th PR';
      return {
        id: type + '_' + season + '_' + grade,
        label: perc + suffix,
        value: benchmarkValue,
      }
    });
    return benchmarks;
  } else {
    return [];
  }
}

export function getScaledBenchmarkCutlines(benchmark, type, season, customBenchmarks) {
  let cutlines = [];
  if(benchmark && (benchmark.grade || benchmark.grade == 0)) {
    let benchmarkType = benchmark.value.substring(0, benchmark.value.length - 2);
    switch(benchmarkType) { // TODO add a case here for custom benchmark
      case 'District':
        cutlines = getDistrictBenchmarks(benchmark, type, season, customBenchmarks);
        break;
      case 'Spanish':
        cutlines = getNationalNormBenchmarks(benchmark.grade,type,season,locales.ES_MX);
        break;
      case 'NationalNorms':
      default:
        cutlines = getNationalNormBenchmarks(benchmark.grade,type,season);
        break;
    }
  }

  // TODO: improve error handling, and null benchmark state passing
  let cutoffs;
  if(cutlines.length > 0) {
    cutoffs = {
      POOR: cutlines[0].value,
      AVERAGE: cutlines[1].value,
      GOOD: cutlines[2].value,
    };
  } else {
    cutoffs = {
      POOR: -1000,
      AVERAGE: -999,
      GOOD: -998,
    }
  }

  return { cutoffs, cutlines };
}

export default {
  getScaledBenchmarkCutlines,
  benchmarkTypes,
  seasons,
}