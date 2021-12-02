
import {COPY_STRINGS} from './translatedCopy';

// A few notes about our string constants:
// 1. You'll see some commented out lines. These are left in for when we have the student's name.
//    Until that time, we want to preserve the intent to start using their name during the dialog.
// 2. There are some tokens in these strings that will be replaced by higher-order functions.
//    The convention is ${pX} where X = 0 for the first replacement, 1 for the 2nd, etc.
//    See library.js for the method that does the replacement. Why not ES6 templates, you ask?
//    Long story short - they try to resolve the template too early in the lifecycle for us to use
//    them in a file like this where we want to keep our strings all in one place.

export const stopWords = {
  proficient: [
    'back',
    'big',
    'call',
    'came',
    'can',
    'cat',
    'come',
    'dad',
    'day',
    'dog',
    'get',
    'go',
    'got',
    'going',
    'last',
    'made',
    'make',
    'mom',
    'new',
    'next',
    'now',
    'old',
    'play',
    'put',
    'said',
    'see',
    'take',
    'three',
    'time',
    'two',
    'us',
    'went',
    'will',
    'yes',
    'a',
    'all',
    'am',
    'an',
    'and',
    'any',
    'are',
    'aren\'t',
    'as',
    'at',
    'be',
    'because',
    'been',
    'both',
    'but',
    'by',
    'can\'t',
    'did',
    'didn\'t',
    'do',
    'does',
    'doing',
    'don\'t',
    'down',
    'during',
    'each',
    'few',
    'for',
    'from',
     'Goes',
    'had',
    'hadn\'t',
    'has',
    'have',
    'having',
    'he',
    'he\'d',
    'he\'ll',
    'he\'s',
    'her',
    'here',
    'here\'s',
    'hers',
    'him',
    'his',
    'how',
    'how\'s',
    'i',
    'i\'d',
    'i\'ll',
    'i\'m',
    'i\'ve',
    'if',
    'in',
    'into',
    'is',
    'isn\'t',
    'it',
    'it\'s',
    'its',
    'let\'s',
    'me',
    'more',
    'most',
    'my',
    'no',
    'nor',
    'not',
    'of',
    'off',
    'on',
    'One',
    'once',
    'only',
    'or',
    'our',
    'ours',
    'out',
    'over',
    'own',
    'same',
    'she',
    'she\'d',
    'she\'ll',
    'she\'s',
    'should',
    'so',
    'some',
    'such',
    'than',
    'that',
    'that\'s',
    'the',
    'them',
    'then',
    'they',
    'this',
    'those',
    'to',
    'up',
    'very',
    'was',
    'we',
    'we\'d',
    'we\'ll',
    'we\'re',
    'we\'ve',
    'were',
    'what',
    'what\'s',
    'when',
    'when\'s',
    'who',
    'who\'s',
    'why',
    'why\'s',
    'with',
    'won\'t',
    'yet',
    'you',
    'you\'d',
    'your',
    'yours',
  ],
  capable: [
    'back',
    'big',
    'call',
    'came',
    'can',
    'cat',
    'come',
    'dad',
    'day',
    'dog',
    'get',
    'go',
    'got',
    'last',
    'look',
    'made',
    'make',
    'mom',
    'new',
    'next',
    'now',
    'old',
    'play',
    'put',
    'said',
    'see',
    'take',
    'three',
    'time',
    'two',
    'us',
    'went',
    'will',
    'yes',
    'a',
    'all',
    'am',
    'an',
    'and',
    'any',
    'are',
    'as',
    'at',
    'be',
    'been',
    'both',
    'but',
    'by',
    'can\'t',
    'could',
    'did',
    'didn\'t',
    'do',
    'does',
    'doesn\'t',
    'don\'t',
    'down',
    'each',
    'few',
    'for',
    'from',
    'go',
    'goes',
    'had',
    'hadn\'t',
    'has',
    'he',
    'he\'d',
    'he\'ll',
    'he\'s',
    'her',
    'here',
    'here\'s',
    'hers',
    'him',
    'his',
    'how',
    'how\'s',
    'i',
    'i\'d',
    'i\'ll',
    'i\'m',
    'i\'ve',
    'if',
    'in',
    'into',
    'is',
    'isn\'t',
    'it',
    'it\'s',
    'its',
    'let\'s',
    'me',
    'more',
    'most',
    'my',
    'no',
    'nor',
    'not',
    'of',
    'off',
    'on',
	'one',
    'once',
    'only',
    'or',
    'our',
    'ours',
    'out',
    'over',
    'own',
    'same',
    'she',
    'she\'d',
    'she\'ll',
    'she\'s',
    'so',
    'some',
    'such',
    'than',
    'that',
    'that\'s',
    'the',
    'them',
    'then',
    'they',
    'this',
    'to',
    'too',
    'up',
    'us',
    'very',
    'was',
    'we',
    'we\'d',
    'we\'ll',
    'we\'re',
    'we\'ve',
    'were',
    'what',
    'what\'s',
    'when',
    'when\'s',
    'who',
    'who\'s',
    'why',
    'why\'s',
    'with',
    'won\'t',
    'would',
    'yet',
    'you',
    'you\'d',
    'you\'ll',
    'you\'re',
    'you\'ve',
    'your',
    'yours',
  ],
  beginner: [
    'us',
    'a',
    'am',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'by',
    'but',
    'did',
    'do',
    'for',
    'go',
    'had',
    'has',
    'he',
    'i',
    'if',
    'in',
    'is',
    'it',
    'it\'s',
    'its',
    'me',
    'my',
    'no',
    'not',
    'of',
    'on',
    'or',
    'so',
    'the',
    'to',
    'too',
    'up',
    'us',
    'was',
    'we',
    'you',
   ]
};

export const spanishStopWords = [
  'de',
  'la',
  'que',
  'el',
  'en',
  'y',
  'a',
  'los',
  'del',
  'se',
  'las',
  'por',
  'un',
  'con',
  'no',
  'una',
  'su',
  'al',
  'lo',
  'más',
  'sus',
  'le',
  'ya',
  'o',
  'sí',
  'muy',
  'sin',
  'me',
  'hay',
  'nos',
  'uno',
  'les',
  'ni',
  'ese',
  'eso',
  'e',
  'mí',
  'qué',
  'yo',
  'él',
  'esa',
  'mi',
  'mis',
  'tú',
  'te',
  'ti',
  'tu',
  'tus',
  'os',
  'mío',
  'mía',
  'he',
  'has',
  'ha',
  'han',
  'soy',
  'es',
  'son',
  'sea',
  'era',
  'fui',
  'fue'
];