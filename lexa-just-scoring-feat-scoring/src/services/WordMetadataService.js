import { API, graphqlOperation } from 'aws-amplify';
import hash from 'object-hash';
import { RUN_METADATA_DUMP, getUserData } from './API';
import { findFilenames } from './API';

export async function getWordMetadata(inWord)
{
  try {
    inWord = inWord.toUpperCase();
    const wordLocale = getUserData().locale === 'es-mx' ? 'es_MX' : '';
    const wordForQuery = wordLocale ? `${inWord}|${wordLocale}`: inWord;

    const wordQuery = `query WordQuery($word: String!) {
      word(WORD: $word) {
        items {
          WORD
          PHON
          NPHON
          NSYL
          NLET
          CONC
          COGNATE {
            spanish
          }
          CORRECT_ANSWER
          SIGHT
          AREA_AOA
          AREA_discrim
          IMG_URL
          VIDEO_URL
          RHYME
          GRAPHEMIC_BREAKDOWN
          DEFINITION{
            default
          }
          DISTRACTORS
          FUNFACTS_IMG_URL
          FUNFACTS_DESCRIPTION
          PHONEME_VIDEO_URL
          RIDDLE
          RIDDLE_ANSWER
          MORPHEME
          MORPHEME_MEANING
          MORPHEME_POSITION
          MORPHEME_ALT
          NAME_MEANING
        }
      }
    }`;
    // Note: cache will invalidate if wordQuery changes. Cache will not invalidate
    // if backend changes
    const key = hash(wordQuery + inWord);
    let rawMetadata = sessionStorage.getItem(key);
    let wordMetadata;
    if(!rawMetadata || hasTimedOut(rawMetadata, key)){
      wordMetadata = fetchAndStoreWord(wordQuery, wordForQuery, inWord, key);
    } else {
      wordMetadata = JSON.parse(rawMetadata).content;
    }
    // TODO consider doing some validation on wordMetadata
    return(wordMetadata);
  }
  catch(err)
  {
    console.log("ERROR IN GETWORDMETADATA",err);
    return false;
  }
}

// returns true if the content is more than an hour old
function hasTimedOut(rawMetadata, key) {
  let data = JSON.parse(rawMetadata);

  // calculate expiration time for content,
  // to force periodic refresh after 60 minutes
  let now = new Date();
  let expiration = new Date(data.timestamp);
  expiration.setMinutes(expiration.getMinutes() + 60);

  // ditch the content if too old
  if (now.getTime() > expiration.getTime()) {
      sessionStorage.removeItem(key);
      return true;
  }
  return false;
}

// fetches a word's metadata from the API and stores it in sessionStorage
// with a timestamp
async function fetchAndStoreWord(wordQuery, queryWord, inWord, key) {
  const wordData = await API.graphql(graphqlOperation(wordQuery, { word: queryWord }));
  let wordMetadata = wordData.data.word.items[0];
  if(!wordMetadata) {
    //TODO: This wasn't being caught anywhere - figure out error handling: throw "undefined metadata";
    console.log("META:",inWord, "|UNDEFINED");
    return({WORD: inWord});
  }

  wordMetadata.WORD = inWord;
  wordMetadata.FUN_FACT = wordData.data.word.items[0].FUNFACTS_DESCRIPTION ? true : false;

  if((wordData.data.word.items[0].VIDEO_URL) && process.env.ASSET_ROOT){
    wordData.data.word.items[0].VIDEO_URL = wordData.data.word.items[0].VIDEO_URL.replace("s3.amazonaws.com/amira-assets",process.env.ASSET_ROOT);
  }
  if((wordData.data.word.items[0].PHONEME_VIDEO_URL) && process.env.ASSET_ROOT){
    wordData.data.word.items[0].PHONEME_VIDEO_URL = wordData.data.word.items[0].PHONEME_VIDEO_URL.replace("s3.amazonaws.com/amira-assets",process.env.ASSET_ROOT);
  }
  if((wordData.data.word.items[0].IMG_URL) && process.env.ASSET_ROOT){
    wordData.data.word.items[0].IMG_URL = wordData.data.word.items[0].IMG_URL.replace("s3.amazonaws.com/amira-assets",process.env.ASSET_ROOT);
  }
  if((wordData.data.word.items[0].FUNFACTS_IMG_URL) && process.env.ASSET_ROOT){
    wordData.data.word.items[0].FUNFACTS_IMG_URL = wordData.data.word.items[0].FUNFACTS_IMG_URL.replace("s3.amazonaws.com/amira-assets",process.env.ASSET_ROOT);
  }

  //null out the entire DEFINITION object if there is no default definition
  let def = wordData.data.word.items[0].DEFINITION;
  if(def && !def.default){
    wordData.data.word.items[0].DEFINITION = null;
  }

  sessionStorage.setItem(key, JSON.stringify({
    timestamp: new Date(),
    content: wordMetadata,
  }));
  return wordMetadata;
}


function cleanAndSplit(phrase, preserveWordsForDisplay = false) {
  if(!phrase) return [];

  let outPhrase = phrase ? phrase.replace("-", "") : "";
  if(preserveWordsForDisplay){
    // remove characters at word boundries
    // \b always matches at a word boundary
    // \B matches only where there isn't a word boundary
    // https://stackoverflow.com/questions/7110382/remove-punctuation-from-beginning-and-end-of-words-in-a-string
    outPhrase = outPhrase.replace(/\b[.,\/#!$%\^&\*;:<>{}=\_`'~()""¿?¡!]+\B|\B[.,\/#!$%\^&\*;:<>{}=\_`'~()""¿?¡!]+\b/g, "");
  } else {
    outPhrase = outPhrase.replace(/[.,\/#!$%\^&\*;:<>{}=\_`'~()""¿?¡!]/g, "");
  }

  //Replace multiple spaces
  outPhrase = outPhrase.replace(/ +(?= )/g,'');
  outPhrase = outPhrase.toLowerCase().split(' ');

  //Replace leading and trailing '
  for (let i = 0; i < outPhrase.length; i++) {
    outPhrase[i] = outPhrase[i].replace(/(^')|('$)/g, "");
  }

  return outPhrase.filter((word) => {
    return word !== "";
  });
}

// TODO
// 1. Add a wrapper function to abstract phraseIndex
// 2. Abstract into intervention selection
export async function prefetchWordMetadata(inPhrase, phraseIndex) {
  let splitPhrase = cleanAndSplit(inPhrase);
  let returnValues = [];
}

function addPhonLengthMatchesGraphemeLength(metadataArray) {
  let metadataArrayWithPhons = [];
  metadataArray.forEach(metadata => {
    let filenames = metadata && metadata.PHON && findFilenames(metadata.PHON);
    if(!metadata.GRAPHEMIC_BREAKDOWN || !metadata.PHON || !filenames || !metadata.GRAPHEMIC_BREAKDOWN.split("/") || !filenames.length) {
      metadata.PHON_GRAPHEME_MATCH = false;
      metadataArrayWithPhons.push(metadata);
      return;
    }
    let phonLength = filenames.length;
    let graphemeLength = metadata.GRAPHEMIC_BREAKDOWN.split("/").length;
    if(phonLength == graphemeLength) {
      metadata.PHON_GRAPHEME_MATCH = true;
    } else {
      metadata.PHON_GRAPHEME_MATCH = false;
    }
    metadataArrayWithPhons.push(metadata);
  });
  return metadataArrayWithPhons;
}

export async function getWordMetadataList(inWords) {
  let returnValues=[];
  return Promise.all(
    returnValues = inWords.map((word)=>{
      return getWordMetadata(word)
      .then((meta)=>{
        return Promise.resolve(meta);
      });
    })
  )
  .then(outArray=>{
    return Promise.resolve(outArray);
  });
}

// returns true if the PHON is valid
export function isValidPHON(phon) {
  // if PHON is blank or null, invalid
  if(!phon || phon == '' || phon == ' ') {
    return false;
  }
  // if PHON includes invalid chars, invalid
  if (phon.includes("@") || phon.includes("&")) {
    return false;
  }
  return true;
}
