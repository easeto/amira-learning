import {parseSkipTranslationTags} from './util.js';
const taggedTranslationTextWithDistractor = "<speak>Read each word as I show it to you. For example, here you <mark name=\"gesture: start\"/> would say: <break time=\"0.25s\"/> <mark name=\"skipTranslation: start\"/>told.<mark name=\"skipTranslation: end\"/> Now it's your turn.</speak>";
const taggedTranslationTextWithTagAtBeginning = '<speak><mark name="skipTranslation: start"/>Read <mark name="skipTranslation:end"/>each word as I show it to you. For example, here you <mark name="gesture: start"/> would say: <break time="0.25s"/> <mark name="skipTranslation: start"/>told.<mark name="skipTranslation: end"/> Now it\'s your turn.</speak><mark name="skipTranslation:start"/><mark name="skipTranslation: end"/>';

test('parseSkipTranslationTags: tagged text with distractor gesture tag', () => {
  expect(parseSkipTranslationTags(taggedTranslationTextWithDistractor))
    .toEqual([
      {textToSpeak: 'Read each word as I show it to you. For example, here you <mark name="gesture: start"/> would say: <break time="0.25s"/> ', skipTranslation: false},
      {textToSpeak: 'told.', skipTranslation: true},
      {textToSpeak: ' Now it\'s your turn.', skipTranslation: false}
    ]);  
});

test('parseSkipTranslationTags: tagged text with distractor gesture tag', () => {
  expect(parseSkipTranslationTags(taggedTranslationTextWithTagAtBeginning))
    .toEqual([
      {textToSpeak: 'Read ', skipTranslation: true},
      {textToSpeak: 'each word as I show it to you. For example, here you <mark name="gesture: start"/> would say: <break time="0.25s"/> ', skipTranslation: false},
      {textToSpeak: 'told.', skipTranslation: true},
      {textToSpeak: ' Now it\'s your turn.', skipTranslation: false}
    ]);  
});