import React from 'react';
import { getWordMetadata, getWordMetadataList, isValidPHON } from './WordMetadataService';
import {getStudentReadingLevel, getStudentGradeLevel, readingLevels, detectRushing} from './readerCharacteristics';
import {getRandomInt} from '../library';
import {logSessionInfo} from './logger';
import {stopWords} from '../constants/interventionStrings';

import { getUserData } from './API';

var stemmer = require("stemmer");



// This section contains accessors for strings used in the interventions
// These belong here because the things we say to the student are interventions in and of themselves
function cleanWord(inWord) {
  return (inWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`'~()""?!]/g, "").toLowerCase());
}

export function isStopWord(word) {
  let inWord = cleanWord(word);
  return ((getUserData().locale === 'en-us') ? (stopWords[getStudentReadingLevel()].indexOf(inWord) >= 0) : (spanishStopWords.indexOf(inWord) >= 0));
}

