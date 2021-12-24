import requests
from bs4 import BeautifulSoup
import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from Edit_distance_function import editDistDP
import pronouncing

link = 'https://www.randomwordgenerator.org/Random/sentence_generator/quantity/20'
sentences = []

CORRECT = 'correct - no category'
REPETITION = 'correct - repetition'
SELF_CORRECTION = 'correct - self correction'
REVERSAL = 'miscue - reversal'
SKIP = 'miscue - skip'
SUBSTITUTION = 'miscue - substitution'

SENTENCE_COUNT = 400

def downloadRequirements():
    nltk.download('punkt')

def getSentences():
    count = 0
    while True:
        page = requests.get(link).text
        soup = BeautifulSoup(page, "html.parser")
        for t in soup.find_all("p"):
            tmp = t.get('class')
            if tmp is not None and 'res-sentence' in tmp:
                if len(t.string.split(' ')) <= 8:
                    sentences.append(t.string[4:])
                    count += 1
        if count >= SENTENCE_COUNT:
                        break

def getSimilarWords(word):
    similarWords = pronouncing.rhymes(word)
    if len(similarWords) > 5:
        # find edit distance and retrieve 5 words with least edit distance
        similarWords = sorted(similarWords, key=lambda x: editDistDP(x, word, len(x), len(word)))[:5]
    return similarWords


def createReversalData(df, words, phrase_index, story_text, activity_id):
    for i in range(1, len(words) - 1):
        # reverse with previous word
        left = ' '.join(words[:i - 1]) if i >= 2 else ''
        right = ' '.join(words[i + 1:]) if i != len(words) - 1 else ''
        transcript = left + ' ' + words[i] + ' ' + words[i-1] + ' ' + right
        for j in range(len(words)):
            expected_word = words[j]
            label = REVERSAL if j == i or j == i - 1 else CORRECT
            df.loc[len(df.index)] = [activity_id, phrase_index, story_text, expected_word, transcript, label]
        
        # reverse with next word
        left = ' '.join(words[:i])
        right = ' '.join(words[i + 2:]) if i != len(words) - 2 else ''
        transcript = left + ' ' + words[i+1] + ' ' + words[i] + ' ' + right
        for j in range(len(words)):
            expected_word = words[j]
            label = REVERSAL if j == i or j == i + 1 else CORRECT
            df.loc[len(df.index)] = [activity_id, phrase_index, story_text, expected_word, transcript, label]


def createSubstitutionData(df, words, phrase_index, story_text, activity_id):
    for i in range(len(words)):
        left = ' '.join(words[:i]) if i >= 1 else ''
        right = ' '.join(words[i + 1:]) if i != len(words) - 1 else ''

        # get similar words
        similarWords = getSimilarWords(words[i])

        for word in similarWords:
            transcript = left + ' ' + word + ' ' + right
            for j in range(len(words)):
                expected_word = words[j]
                label = SUBSTITUTION if j == i else CORRECT
                df.loc[len(df.index)] = [activity_id, phrase_index, story_text, expected_word, transcript, label]


def createSelfCorrectionData(df, words, phrase_index, story_text, activity_id):
    for i in range(len(words)):
        left = ' '.join(words[:i]) if i >= 1 else ''
        right = ' '.join(words[i + 1:]) if i != len(words) - 1 else ''

        # get similar words
        similarWords = getSimilarWords(words[i])

        # add self correction for each similar word similar to word[i]
        for word in similarWords:
            transcript = left + ' ' + word + ' ' + words[i] + ' ' + right
            for j in range(len(words)):
                expected_word = words[j]
                label = SELF_CORRECTION if j == i else CORRECT
                df.loc[len(df.index)] = [activity_id, phrase_index, story_text, expected_word, transcript, label]


def createSkipData(df, words, phrase_index, story_text, activity_id):
    for i in range(len(words)):
        left = ' '.join(words[:i]) if i >= 1 else ''
        right = ' '.join(words[i + 1:]) if i != len(words) - 1 else ''

        # skip words[i]
        transcript = left + ' ' + right

        for j in range(len(words)):
            expected_word = words[j]
            label = SKIP if j == i else CORRECT
            df.loc[len(df.index)] = [activity_id, phrase_index, story_text, expected_word, transcript, label]


def createRepetitionData(df, words, phrase_index, story_text, activity_id):
    for i in range(len(words)):
        left = ' '.join(words[:i]) if i >= 1 else ''
        right = ' '.join(words[i + 1:]) if i != len(words) - 1 else ''

        # repeat words[i]
        transcript = left + ' ' + words[i] + ' ' + words[i] + ' ' + right

        for j in range(len(words)):
            expected_word = words[j]
            label = REPETITION if j == i else CORRECT
            df.loc[len(df.index)] = [activity_id, phrase_index, story_text, expected_word, transcript, label]


def createCorrectData(df, words, phrase_index, story_text, activity_id):
    transcript = ' '.join(words)
    for i in range(len(words)):
        expected_word = words[i]
        df.loc[len(df.index)] = [activity_id, phrase_index, story_text, expected_word, transcript, CORRECT] 


def generateData():
    downloadRequirements()
    # scrape 2000 random sentences from the web
    getSentences()
    cols = ['activity_id', 'phrase_index', 'story_text', 'expected word', 'transcript', 'label']
    df = pd.DataFrame(columns=cols)
    count = 0
    # idk what this is so I'm setting it to 0
    phrase_index = 0
    for s in sentences:
        print(count)
        story_text = s
        activity_id = count
        count += 1
        # remove all punctuation
        words = [word.lower() for word in word_tokenize(s) if word.isalpha()]
        
        # create all categories of data for the givenn sentence
        createCorrectData(df, words, phrase_index, story_text, activity_id)
        createRepetitionData(df, words, phrase_index, story_text, activity_id)
        createReversalData(df, words, phrase_index, story_text, activity_id)
        createSelfCorrectionData(df, words, phrase_index, story_text, activity_id)
        createSkipData(df, words, phrase_index, story_text, activity_id)
        createSubstitutionData(df, words, phrase_index, story_text, activity_id)
    df.to_csv('test.csv', sep=',')
    df.to_excel('output.xlsx')
generateData()