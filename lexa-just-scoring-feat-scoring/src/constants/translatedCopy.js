

//INTERVENTION STRINGS
// note: some of this is legacy stuff.
//    you'll notice that it's using our library function for string replacement rather than supplying a function.
//    Kept it this way for backward compatability
//    you'll also notice that we have nested arrays here rather than giving an individual key to each string. this works because these particular strings are selected at random from their buckets
// TODO: consider making a sub object for these strings
const EN_US_INTERVENTION_STRINGS = {
  elkoninIntro: "Let's sound out this word together by moving the red balls one by one into the boxes. The word is ", /*TODO add spanish */
  first_sound_in: "The first sound in ",
  is_with_spaces: " is ",
  elkonin_num_sounds_intro: (numSounds) => `There are ${numSounds} sounds in this word. You can see ${numSounds} boxes on the screen. Move the first red ball into the first box, and say the first sound. Then move the other balls into the boxes, and say each sound.`,
  elkonin_abbreviated_intro: "Move the red balls into the boxes and say each sound",
  elkoninFirstTimePartOne: " Move the first red ball into the first box",
  elkoninFirstTimePartTwo: ", and say the first sound in the word.",
  elkoninFirstTimeFollowup: "Ok, great. Now move the other balls up into the boxes, and say each sound which is part of this word.",
  elkoninSoundsTogetherPartOne: "Now put those sounds together and say the word.",
  elkoninSoundsTogetherPartTwo: "Ok, these sounds make ",
  elkoninExit: ". Well done!",
  pageGambitGoodPhrases: [
    "Excellent work.",
    "Lets keep reading.",
    "Here's the next page.",
    "You are reading well.",
    "Good reading.",
    "You are flying. Here's a new page.",
    "Outstanding.",
    "Turning the page.",
    "Here is a new page.",
    "Let's go on."
  ],
  pageGambitStrugglingPhrases: [
    "Terrific, you finished the page.",
    "Before the next page, just wanted to say great job.",
    "You are really working at this, thank you.",
    "You are reading well. Here's the next page.",
    "Keep trying.",
    "You are doing well. Here's a new page.",
    "Next page -- you are almost done.",
    "Good work. Next page."
  ],
  lastPhraseOnPageResponse: [
    "Nice!",
    "Super!",
    "Way to go!"
  ],
  readWithMePrompt: [
    "Your turn!",
    "Now you try!",
    "Ready? Read!",
    "Now try reading",
  ],
  try_again: [
    "let's try that again.",
    "read that to me again.",
    "try that one more time.",
    "how about you read that again?",
    "can you re-read that?",
    "ready to try again? Go!"
  ],
  keep_reading: {
    proficient: [
      "Keep going!",
      "Please go on.",
      "Keep reading.",
      "Lets go on.",
      "Read on.",
    ],
    capable: [
      "Let's keep reading!",
      "Keep going!",
      "Please go on.",
      "You're doing great.",
      "Keep reading."
    ],
    beginner: [
      "Let's keep reading!",
      "You're doing great.",
      "Let's read some more.",
      "Go on reading.",
    ],
  },
  read_perfectly: [
    "Great job, you read that perfectly!",
    "Fantastic job.",
    "Cool, that was good reading.",
    "Perfect Reading.",
    "No Errors.",
    "You didn't make a single mistake.",
    "Way to go, Zero errors.",
  ],
  storyPhrases: {
    proficient: [
      "Cool, you're done with this story.",
      "I have some feedback for you.",
      "Way to go. You've finished this story.",
      "Cool, you've finished this story.",
      "I have some feedback for you.",
      "Congratulations!",
      "Let's see how you did on this story.",
      "You've finished."
    ],
    capable: [
      "Way to go. You've finished this story.",
      "Cool, you've finished this story.",
      "I have some feedback for you.",
      "Finished. You did a great job.",
      "Congratulations. You red the entire story.",
      "Congratulations.",
      "Lets see how you did on this story.",
      "You've finished."
    ],
    beginner: [
      "You got to the end. Wonderful job.",
      "The end. Way to go.",
      "Thanks for reading with me.",
      "lets see how you did with this story.",
      "That was fun and you red really well.",
      "Finished. You did a great job.",
      "You did a great job.",
      "That was fun and you red really well.",
    ],
  },
  toofastPhrases: {
    proficient: [
      "Can you slow down a bit so i can hear you better?",
      "Read at a comfortable speed, and i will follow you better.",
      "Help me out by reading clearly and not quite so quickly."
    ],
    capable: [
      "Can you slow down a bit so i can hear you better?",
       "Try saying each word clearly so I can understand you better.",
      "Help me out by reading a little more slowly.",
    ],
    beginner: [
      "I'm having a little trouble hearing you.  Say each word clearly.",
      "Help me follow you better by reading each word as clearly as you can.",
      "Raise your voice a little so I can hear you.",
      "Can you reed a little louder?",
    ],
  },
  comprehensionIntro: {
    proficient: [
      "Let's talk about the story.",
      "Can you tell me about the story?",
      "Great job. Here is a question for you about the story.",
      "Let's pause and think about what we've read.",
      "Let's think about what we've read."
    ],
    capable: [
      "Can you tell me about the story?",
      "Great job. Here is a question for you.",
      "Can you answer this question?",
      "Let's pause and think about what we've read.",
      "Let's think about what we've read."
    ],
    beginner: [
      "Here is a question for you about this story.",
      "Tell me about the story.",
      "Can you help me understand the story better?",
      "Let's pause and think about what we've read.",
    ],
  },
  comprehensionRightAnswer: {
    proficient: [
      "Great reading, that's right.",
      "You've got it!",
      "I'm so proud of you. You're doing great!"
    ],
    capable: [
      "Thanks. You are correct.",
      "Great reading, that's right.",
      "I'm so proud of you. You're doing great!"
    ],
    beginner: [
      "Great reading, that's right.",
      "Thanks. You are correct.",
      "I'm so proud of you. You're doing great!"
    ],
  },
  comprehensionWrongAnswerOnFirst: [
    "This answer needs to be fixed.",
    "Oops, let's check that answer.",
    "That question is tricky, can you check it again?",
    "I see this question stumped you, can you check it?"
  ],
  comprehensionWrongAnswerOnSecond: [
    "This answer needs to be fixed.",
    "Oops, let's check that answer.",
    "That question is tricky, can you check it again?",
    "I see this question stumped you, can you check it?"
  ],
  comprehensionWrongAnswerRetry: [
    "Oops, that's still not correct.",
    "Try again. That's not right.",
    "Let's check that answer again.",
    "Uh Oh.. that's not right."
  ],
  comprehensionWrongAnswer: [
    "Oops, that's not correct. Try again.",
    "Try again. That's not right.",
    "Uh Oh.. that's not right."
  ],
  comprehensionRight: {
    proficient: [
      "You are right.",
      "You got it!",
      "Yes, that's right.",
    ],
    capable: [
      "You got this one right.",
      "Cool. You are correct.",
      "That's right.",
      "You nailed it."
    ],
    beginner: [
      "You are right.",
      "You got it!",
      "Yes, that's right.",
    ],
  },
  comprehensionPrompt: [
    "This question might be tricky. Make your best guess by clicking on one of the answers.",
    "Which answer makes the most sense? Click on one of the answers."
  ],
  interventionOneErrorLeadInDontSayWord: {
    proficient: [
      "Let's review one word together.",
      "We should pause on a word",
      "Hold on. Lets work on a word.",
      "Let's drill in.",
      "Before we go on, lets work on one of the words.",
      "Looks like we should work on one of these words.",
      "We should spend a minute to review.",
    ],
    capable: [
      "Let's review a word together.",
      "Let's drill into one of the words.",
      "Looks like we should work on one of these words.",
      "We should work together for a minute.",
      "Hold on.  Lets work on a word.",
      "Here's some help.",
      "We should work on one of the words.",
    ],
    beginner: [
      "How about help with one of these words?",
      "Looks like we should focus on a word.",
      "Here's some help.",
      "Why don't we work on one of the words?",
      "Lets work on a word together.",
      "I'd like to tell you more about a word.",
    ],
  },
  interventionOneErrorLeadInSayWord: {
    proficient: [
      "Lets go over ${p0}.",
      "Let's review ${p0} together.",
      "Hold on. Lets review ${p0}.",
      "We should work on ${p0}.",
      "I'd like to drill in on ${p0}.",
      "Let's pause on ${p0}.",
      "We should work on ${p0}.",
      "We can go over ${p0}.",
      "Lets work on ${p0}.",
      "Lets talk about the word ${p0}",
      "Hold on, lets work on ${p0}.",
      "Before we go on,lets go over ${p0}.",
      "Looks like we should work on ${p0}.",
      "How about we work on ${p0}.",
      "We should spend a minute on ${p0}."
    ],
    capable: [
      "Let's review ${p0} together.",
      "Hold on. Lets review ${p0}.",
      "Let's drill in.",
      "We should focus on ${p0}.",
      "We should spend a second on ${p0}.",
      "Lets work on ${p0}.",
      "Lets talk about the word ${p0}",
      "let's hold on.",
      "Before we go on, let’s work on ${p0}.",
      "Looks like we should work on ${p0}.",
      "We should work on ${p0}.",
      "Lets go over on ${p0}.",
      "We're going to work on ${p0}.",
      "Hold on, lets talk about ${p0}.",
      "How about we work on ${p0}.",
      "We should spend a minute on ${p0}."
    ],
    beginner: [
      "Hold on. lets work on ${p0}.",
      "Here's some help on the word ${p0}.",
      "We should work on the word ${p0}.",
      "Lets go over ${p0}.",
      "We should talk about the word ${p0}.",
      "Before we go on, let’s work on ${p0}.",
      "We should work on ${p0}.",
      "Lets go to work on ${p0}.",
      "We're going to work on ${p0}.",
      "Hold on, lets talk about ${p0}.",
      "We should spend a minute on ${p0}."
    ],
  },
  interventionMultipleErrorLeadIn: {
    proficient: [
      "Review can sharpen understanding.",
      "How about a quick review.",
      "We should review the sentence.",
      "Let's work on this sentence.",
      "We should go over that sentence again.",
      "Here's a quick recap.",
      "Why don't we work together for a minute?"
    ],
    capable: [
      "Let's try that sentence again.",
      "There was some trouble with that sentence.",
      "Let's do a quick review.",
      "I didn't catch some words.",
      "Looks like we should review.",
    ],
    beginner: [
      "We should go over that sentence again.",
      "Hmmm, we should review.",
      "Hold on. Let's work on this sentence.",
      "We should spend time going over that again.",
      "Wait, lets spend a second on these words.",
      "Lets work on this.",
      "How about we work on this?",
       "We should read that sentence again.",
      "Let's work together on this."
    ],
  },
  endOfClapPhrases: {
    beginner: [
      "Good work, keep reading.",
      "Nice work. Go on.",
      "Good going.",
      "Now you know another word. Keep reading.",
    ],
    capable: [
      "Great job, keep reading.",
      "Terrific. Go on.",
      "Nice work. Go on.",
      "You are a rock star. Keep reading.",
    ],
    proficient: [
      "Keep reading.",
      "Excellent. Go on.",
      "Terrific work. Go on.",
      "You are a rock star. Lets go on.",
    ],
  },
  feedbackUtterances: [
    "If I'm saying this, there's a bug",
    "Great job, let's do it again",
    "Good going.",
    "Great, now you know another word. Let's keep going."
  ],
  listening: {
    greatJob: [
      "Great job.",
      "Good work, thanks.",
      "Way to go.",
      "Super, lets keep going.",
      "Nice work.",
      "Got it.  Lets go on.",
    ],
    didntHear: [
      "Can you try again?",
      "I didn't hear you.",
      "Try again, please.",
      "Say it a little louder.",
      "Ok, I didn't get that. Try again.",
      "Can you say again, a little louder?",
      "Say it out loud, ok?",
      "What's the word?",
    ],
    moveOn: [
      "Ok, lets go on.",
      "Lets move on.",
      "Alright, keep reading.",
      "We'll keep going.",
      "Keep reading.",
      "Keep on going.",
      "We'll move on.",
      "Lets get back to reading.",
      "Ok, back to the story.",
    ],
    giveAnswer: [ //Listen.js appends the target word before sending the text to speech
      "The word is ",
      "Ok, its ",
      "This is ",
      "This word is ",
      "You say ",
    ],
    thanks: [
      "Ok, thanks.",
      "Appreciate you.",
      "thanks very much.",
      "Good effort.",
      "thank you, keep reading.",
    ]
  },
  rhymes_with: "This word rhymes with",
  this_word: "This word",
  rhymes: "rhymes",
  with: "with",
  listen_to_rhyme: "Listen to the rhyming word",
  listen_for_the: "Listen for the",
  spelling: "spelling",
  of: "of",
  is_spelled: "is spelled",
  let_me_spell: "Let me spell that for you",
  you_said: "You might have said",
  instead_of: "instead of",
  the_word_is: "<break time = \"0.5s\"/> The word is",
  important_word: " is an important word. Say ",
  three_times: " three times as fast as you can ",
  let_me_say: "Let me say that for you",
  means: "means",
  lets_read_the_word: "Let's read the word",
  fun_fact: "Fun Fact!",
  heres_a_fact: "Here's a fun fact for you about the word",
  watch_lips: "Watch my friend's lips say",
  tap_play: "when you are ready, tap the play button.",
  watch_how_to_say: "Watch how to say",
  now_you_say_word: "Now you say the word ",
  lets_read_word: "Let's read the word",
  let_me: "Let me",
  makes: "makes",
  say: "say",
  times: "times",
  now_you_try_word: "Now you try reading this word",
  im_going_to: "I'm going to",
  sound_out: "sound out",
  the_word_is_capitalized: "The word is",
  sound_out_capitalized: "Sound out",
  spellOutLeadIn: "Try to sound out this word.",
  spellOutLeadInBeforeVersion: "I'm going to spell out this word for you",
  imGoingToSoundThisWordOut: "I'm going to sound this word out",
  soundOutLeadIn1: "I'm going to sound out the parts of the word",
  soundOutLeadIn2: "for you.",
  tryToSoundOut: "Try to sound out",
  repeat_after_me: "Repeat after me",
  show_again: "I'll show you again",
  be_careful_not_to: "Be careful not to",
  make_this_mistake: " make this mistake",
  mistake_added: (word) => ` add ${(/^[aeiou]$/i).test(word[0]) ? 'an' : ''} ${word} at the end.`,
  letsWorkOn: "Let's work on:",
  mistake_dropped: (word) => ` drop the ${word} ending.`,
  mistake_mix_up_ending: (word) => ` mix up the ${word} ending.`,
  is_pronounced: "is pronounced",
  word_has_many_letters_and_many_syllables: (word, n) => `The word has ${word.length} letters and ${n} ${n > 1 ? 'syllables' : 'syllable'}.`,
  word_has_many_letters_and_many_sounds: (word, n) => `The word has ${word.length} letters and ${n} ${n > 1 ? 'sounds' : 'sound'}.`,
  try_to_sound_it_out: "Try to sound it out",
  ok: "Ok,",
  ok_im_going_to_sound_out_this_word_for_you: "Ok, I'm going to sound out this word for you.",
  pay_attention_to_the_word_ending: "Pay attention to the word ending",
  letters: "Letters",
  sounds: "Sounds",
  heres_a_riddle: "I’ve got a riddle for you.",
  riddle_solved: "Yes! You solved the riddle!",
  riddle_unsolved: (answer) => `I was hoping you'd say ${answer}.`,
  morpheme: {
    prefix: "beginning",
    suffix: "ending",
    root: "root",
    intro: (word, morpheme, morphemePosition, morphemeMeaning) =>
      `This word has a common ${morphemePosition}. The ${morpheme} in ${word} is in a lot of words.  It means ${morphemeMeaning}. Whenever you see these letters together, they tell you a lot about how to say and understand the word. Can you think of another word that has this same ${morphemePosition}?`,
    correct_response: "Great job!",
    give_alternate: (altMorph, morphemePosition) =>
      `${altMorph} is another word that uses this ${morphemePosition}.`,
  },
  cognate_intro: (word, cognate) =>
    `${word} is <lang xml:lang="es-ES">${cognate}</lang> in spanish.`,
  cognate_now_you_say_it: "Now You say the word in English.",
  name: {
    title: "Name",
    intro: (word, phoneme, meaning = null) => {
      let speech = `<p>This name is usually pronounced: <prosody rate=\"x-slow\"><phoneme alphabet=\"ipa\" ph=\"${phoneme}\"> ${word} </phoneme></prosody>.</p> <break time=\"0.5s\"/>`;
      if (meaning) {
        speech += `<p>It means, ${meaning}.</p> <break time=\"0.5s\"/>`;
      }
      speech += `<p>Just to get comfortable with this name, say: hello ${word}!</p>`;
      return speech;
    },
  },
  vocabulary_with_picture: {
    intro: (word, descriptor) => `${word} is a ${descriptor} word.`,
    question_text: (word) => `Which picture best shows the word ${word}?`,
    correct_response: "You are right!",
    meaning: (word, meaning) => `${word} means ${meaning}.`,
    descriptor: ["pretty hard"],
    expire_right_answer: (word, meaning) => `${word} means ${meaning}.`,
  },
  prediction_question: {
    intro: 'Ok, lets see how good you are at guessing what happens next.<break time="0.5s"/> Think about the story we’ve read so far.',
    correct_response: [
      "Thanks. You are correct.",
      "Great reading, that's right.",
      "I'm so proud of you. You're doing great!",
    ],
    expire_right_answer: (answer) => `The right answer is: ${answer}.`,
  },
};












const ES_MX_INTERVENTION_STRINGS = {
  elkoninIntro: "Vamos a pronunciar esta palabra juntos moviendo las pelotas rojas una por una hacia las casillas. La palabra es ",
  elkoninFirstTimePartOne: " Mueve la primera pelota roja hacia la primera casilla",
  first_sound_in: "El primer sonido en ",
  is_with_spaces: " es ",
  elkonin_num_sounds_intro: (numSounds) => `Hay ${numSounds} sonidos en esta palabra. Puedes ver ${numSounds} casillas en la pantalla. Mueve la primera pelota roja hacia la primera casilla, y di el primer sonido. Después, mueve las otras pelotas hacia las casillas, y di cada sonido.`,
  elkonin_abbreviated_intro: "Mueve las pelotas rojas hacia las casillas y di cada sonido",
  elkoninFirstTimePartTwo: ", y di el primer sonido en la palabra.",
  elkoninFirstTimeFollowup: "Excelente. Ahora mueve las otras pelotas hacia las casillas, y di cada sonido que forma parte de esta palabra.",
  elkoninSoundsTogetherPartOne: "Ahora, junta esos sonidos y pronuncia la palabra.",
  elkoninSoundsTogetherPartTwo: "De acuerdo, estos sonidos hacen ",
  elkoninExit: ". ¡Bien hecho!",
  pageGambitGoodPhrases: [
    "Excelente trabajo.",
    "Sigamos leyendo.",
    "Aquí hay la siguiente página",
    "Estás leyendo bien.",
    "Buena lectura.",
    "¡Vas volando! Aquí tienes una página nueva.",
    "Espectacular.",
    "Cambiando de página.",
    "Aquí hay una página nueva.",
    "Continuemos."
  ],
  pageGambitStrugglingPhrases: [
    "Estupendo, terminaste la página.",
    "Antes de seguir con la siguiente página, quería decirte que estás haciendo un gran trabajo.",
    "Realmente estás trabajando duro en esto, gracias por tu esfuerzo.",
    "Estás leyendo bien. Aquí tienes la siguiente página.",
    "Sigue intentando.",
    "Lo estás haciendo bien. Aquí tienes una página nueva.",
    "Siguiente página. Ya casi terminas.",
    "Buen trabajo. Siguiente página."
  ],
  lastPhraseOnPageResponse: [
    "¡Genial!",
    "¡Súper!",
    "¡Bien hecho!",
  ],
  readWithMePrompt: [
    "¡Ahora es tu turno!",
    "¡Ahora inténtalo tú!",
    "¡A leer!",
    "Ahora intenta leer"
  ],
  try_again: [
    "Vamos a intentarlo otra vez.",
    "Léeme eso otra vez.",
    "Inténtalo una vez más.",
    "¿Qué tal si lo vuelves a leer?",
    "¿Puedes volver a leer eso?",
    "¿Quieres intentarlo otra vez? ¡Adelante!"
  ],
  keep_reading: {
    proficient: [
      "¡Sigue adelante!",
      "Por favor, continua.", //removing accent on continúa here and elsewhere because amira sounds weird when she says it
      "Sigue leyendo.",
      "Continuemos.",
      "Continúa leyendo."
    ],
    capable: [
      "¡Sigamos leyendo!",
      "¡Sigue adelante!",
      "Por favor, continua.",
      "¡Sigue adelante!",
      "Sigue leyendo."
    ],
    beginner: [
      "¡Sigamos leyendo!",
      "Estás haciendo genial.",
      "Leamos un poco más.",
      "Continúa leyendo" ,
      "Continúa con la lectura."
    ],
  },
  read_perfectly: [
    "Excelente trabajo, ¡leíste eso perfectamente!",
    "Buen Trabajo",
    "Genial, esa fue una buena lectura.",
    "Perfecta lectura.",
    "No hay errores",
    "No cometistes ningun error",
    "Cero errores",
  ],
  storyPhrases: {
    proficient: [
      "Genial, ya terminaste con esta historia.",
      "tengo algunos comentarios para ti.",
      "Tengo algunos comentarios para ti.",
      "Ya terminaste con esta historia.",
      "Bien hecho. Ya terminaste con esta historia.",
      "Genial, ya terminaste con esta historia.",
      "Tengo algunos comentarios para ti.",
      "¡Felicitaciones!",
      "Veamos cómo te fue con esta historia.",
    ],

    capable: [
      "Bien hecho. Ya terminaste con esta historia.",
      "Genial, ya terminaste con esta historia.",
      "Tengo algunos comentarios para ti.",
      "Terminaste. Hiciste un gran trabajo.",
      "Felicitaciones, leíste toda la historia.",
      "Felicitaciones.",
      "Veamos cómo te fue con esta historia.",
      "Terminastes"
    ],
    beginner: [
      "Llegaste hasta el final. Maravilloso trabajo.",
      "Fin. Bien hecho.",
      "Gracias por leer conmigo.",
      "Veamos cómo te fue con esta historia.",
      "Eso fue divertido y leíste muy bien.",
      "Terminaste. Hiciste un gran trabajo.",
      "Hiciste un gran trabajo.",
      "Eso fue divertido y leíste muy bien."
    ],
  },
  toofastPhrases: {
    proficient: [
      "¿Puedes decir eso mas despacio para poder entenderte mejor?",
      "Lee claramente y a un ritmo cómodo, así podré entenderte mejor.",
      "Intenta leer claramente y no tan rápido para entenderte mejor.",
    ],
    capable: [
      "¿Puedes decir eso mas despacio para poder entenderte mejor?",
      "Lee claramente y a un ritmo cómodo, así podré entenderte mejor.",
      "Intenta leer claramente y no tan rápido para entenderte mejor.",
    ],
    beginner: [
      "Estoy teniendo dificultades para entenderte Diga cada palabra con claridad",
      "Ayúdame a entenderte mejor y lee cada palabra lo más claro que puedas.",
      "¿Puedes leer un poco más alto?",
    ],
  },
  comprehensionIntro: {
    proficient: [
      "Hablemos sobre la historia.",
      "¿Puedes hablarme acerca de la historia?",
      "Excelente trabajo. Aquí tienes una pregunta sobre la historia.",
      "Hagamos una pausa y pensemos acerca de lo que hemos leído.",
      "Vamos a pensar acerca de lo que hemos leído."
    ],
    capable: [
      "¿Puedes hablarme acerca de la historia?",
      "Excelente trabajo. Aquí hay una pregunta para ti.",
      "¿Puedes responder esta pregunta?",
      "Hagamos una pausa y pensemos acerca de lo que hemos leído.",
      "Vamos a pensar acerca de lo que hemos leído."
    ],
    beginner: [
      "Aquí tienes una pregunta sobre la historia.",
      "Háblame acerca de la historia.",
      "¿Me puedes ayudar a entender mejor la historia?",
      "Hagamos una pausa y pensemos acerca de lo que hemos leído.",
    ],
  },
  comprehensionRightAnswer: {
    proficient: [
      "Excelente lectura, estás en lo correcto.",
      "¡Lo conseguiste!",
      "Estoy muy orgullosa de ti. ¡Lo estás hacienda genial!"
    ],
    capable: [
      "Gracias. Estás en lo correcto.",
      "Gran lectura. Respuesta correcta.",
      "Estoy muy orgullosa de ti. ¡Lo estás hacienda genial!"
    ],
    beginner: [
      "Excelente lectura, estás en lo correcto.",
      "Gracias. Estás en lo correcto.",
      "Estoy muy orgullosa de ti. ¡Lo estás hacienda genial!"
    ],
  },
  comprehensionWrongAnswerOnFirst: [
    "Esta respuesta debe ser corregida.",
    "Ups, revisemos esa respuesta.",
    "Esa pregunta es complicada. ¿Puedes revisarla otra vez?",
    "Puedo ver que esta pregunta te resultó difícil. ¿Podrías revisarla?"
  ],
  comprehensionWrongAnswerOnSecond: [
    "Esta respuesta debe ser corregida.",
    "Ups, revisemos esa respuesta.",
    "Esa pregunta es complicada. ¿Puedes revisarla otra vez?",
    "Puedo ver que esta pregunta te resultó difícil. ¿Podrías revisarla?"
  ],
  comprehensionWrongAnswerRetry: [
    "Ups, sigue sin estar correcta.",
    "Inténtalo otra vez. Respuesta incorrecta.",
    "Revisemos esa respuesta una vez más.",
    "Oh oh… eso no es correcto."
  ],
  comprehensionWrongAnswer: [
    "Ups, esa no es la respuesta correcta. Inténtalo otra vez.",
    "Inténtalo otra vez. Respuesta incorrecta.",
    "Oh oh… eso no es correcto."
  ],
  comprehensionRight: {
    proficient: [
      "Respuesta correcta.",
      "¡Lo conseguiste!",
      "Sí, respuesta correcta.",
    ],
    capable: [
      "Esta la respondiste correctamente.",
      "Genial. Respondiste correctamente.",
      "Respuesta correcta.",
      "Diste en el clavo."
    ],
    beginner: [
      "Respuesta correcta.",
      "¡Lo conseguiste!",
      "Sí, respuesta correcta.",
    ],
  },
  comprehensionPrompt: [
    "Esta pregunta puede ser complicada. Haz tu mejor intento haciendo clic en una de las respuestas.",
    "¿Cuál respuesta tiene más sentido? Haz clic en una de las respuestas."
  ],
  interventionOneErrorLeadInDontSayWord: {
    proficient: [
      "Repasemos una palabra juntos.",
      "Repasemos.",
      "Espera un momento. Vamos a trabajar en una palabra.",
      "Encfocemonos",
      "Antes de continuar, trabajemos en una de las palabras.",
      "Parece que deberíamos trabajar en una de estas palabras.",
      "Deberíamos tomarnos un minuto para repasar."
    ],
    capable: [
      "Repasemos una palabra juntos.",
      "Encfocemonos en usna de las palabras ",
      "Parece que deberíamos trabajar en una de estas palabras.",
      "Deberíamos trabajar juntos por un minuto.",
      "Espera un momento. Vamos a trabajar en una palabra.",
      "Deberíamos repasar.",
      "Deberíamos trabajar en una de las parablas."
    ],
    beginner: [
      "Es posible que no hayas tenido correcta una palabra.",
      "Parece que te faltó una palabra.",
      "Aquí tienes un poco de ayuda.",
      "¿Por qué no trabajamos en una de las palabras.",
      "Trabajemos juntos en una palabra.",
      "Me gustaría comentarte algo acerca de una de las palabras."
    ],
  },
  interventionOneErrorLeadInSayWord: {
    proficient: [
      "Repasemos ${p0} juntos.",
      "Espera un momento. Trabajemos en ${p0}.",
      "Encfocemonos en ${p0}.",
      "Deberíamos enfocarnos en ${p0}.",
      "Deberíamos concentrarnos un segundo en ${p0}.",
      "Trabajemos en ${p0}."
    ],
    capable: [
      "Repasemos ${p0} juntos.",
      "Es posible que no hayas tenido correcta ${p0}.",
      "Parece que cometiste un pequeño error en ${p0}.",
      "Concentrémonos un minuto en ${p0}.",
      "Espera un momento. Trabajemos en ${p0}.",
      "Trabajemos en ${p0}."
    ],
    beginner: [
      "Es posible que no hayas tenido correcta ${p0}.",
      "Espera un momento. Trabajemos en ${p0}.",
      "Parece que te faltó ${p0}.",
      "Aquí tienes algo de ayuda con la palabra ${p0}.",
      "Deberíamos trabajar en la palabra ${p0}.",
    ],
  },
  interventionMultipleErrorLeadIn: {
    proficient: [
      "Intenta otra vez con esa oración.",
      "¿Qué tal un repaso rápido?",
      "Deberíamos repasar la oración.",
      "Trabajemos en esta oración.",
      "Deberíamos repasar esa frase otra vez.",
      "Hagámos un rápido resumen.",
      "¿Por qué no trabajamos juntos por un minuto."
    ],
    capable: [
      "Intentemos otra vez con esa oración.",
      "Hubo un problema con esa oración.",
      "Hagámos un repaso rápido.",
      "No entendí algunas palabras.",
      "Parece que deberíamos repasar.",
      "Deberíamos repasar esa frase otra vez."
    ],
    beginner: [
      "Hmmm, deberíamos repasar.",
      "Espera un momento. Trabajemos en esta oración.",
      "Parece que deberíamos tomarnos un minuto para repasar.",
      "Espera, vamos a tomarnos un segundo con estas palabras.",
      "Trabajemos en esto.",
      "¿Qué te parece si nos enfocamos?",
      "Deberíamos volver otra vez a esa otración.",
      "Trabajemos juntos en esto."
    ],
  },
  endOfClapPhrases: {
    beginner: [
      "Excelente trabajo, sigue leyendo.",
      "Bien hecho.",
      "Ahora conoces otra palabra nueva. Sigue leyendo.",
    ],
    capable: [
      "Excelente trabajo, sigue leyendo.",
      "Estupendo. Continua.",
      "Eres una estrella. Sigue leyendo.",
    ],
    proficient: [
      "Sigue leyendo.",
      "Excelente. Continua.",
      "Eres una estrella. Continuemos.",
    ],
  },
  feedbackUtterances: [
    "If I'm saying this, there's a bug",
    "Buen trabajo, hagámoslo de nuevo",
    "Buen curso.",
    "Genial, ahora sabes otra palabra. Sigamos adelante.",
  ],
  listening: {
    greatJob: [
      "Excelente trabajo.",
      "Buen trabajo. Gracias.",
      "Bien hecho.",
      "Súper, continuemos.",
      "Buen trabajo.",
      "Correcto.  Continuemos.",
    ],
    didntHear: [
      "¿Puedes volver a intentarlo?",
      "No te escuché.",
      "Inténtalo otra vez, por favor.",
      "Dilo un poco más alto.",
      "No pude entenderte. Inténtalo otra vez.",
      "¿Puedes volver a decir eso un poco más alto?",
      "Dilo más alto, ¿de acuerdo?",
      "¿Cuál es la palabra?",
    ],
    moveOn: [
      "De acuerdo, continuemos.",
      "Vamos a continuar.",
      "Muy bien, sigue leyendo.",
      "Vamos a continuar.",
      "Sigue leyendo.",
      "Continúa.",
      "Avancemos.",
      "Volvamos a la lectura.",
      "De acuerdo, volvamos a la historia.",
    ],
    giveAnswer: [ //Listen.js appends the target word before sending the text to speech
      "La palabra es ",
      "De acuerdo, es ",
      "Esta es ",
      "La palabra es ",
      "Dices ",
    ],
    thanks: [
      "De acuerdo, gracias.",
      "Te lo agradezco.",
      "muchas gracias.",
      "Buen esfuerzo.",
      "gracias, sigue leyendo.",
    ]
  },
  rhymes_with: "Esta palabra rima con",
  this_word: "Esta palabra",
  rhymes: "rima",
  with: "con",
  listen_to_rhyme: "Escucha la palabra que rima",
  listen_for_the: "Escucha para el",
  spelling: "deletreo",
  of: "de",
  is_spelled: "se deletrea",
  let_me_spell: "Permíteme deletrear eso por ti",
  you_said: "Posiblemente dijiste",
  instead_of: "en lugar de",
  the_word_is: "La palabra es",
  important_word: " es una palabra importante. Di tres veces ",
  three_times: " lo más rápido que puedas ",
  let_me_say: "Permíteme decir eso por ti",
  means: "significa",
  lets_read_the_word: "Leamos la palabra",
  fun_fact: "¡Dato curioso!",
  heres_a_fact: "Aquí tienes un dato curioso acerca de esa palabra",
  watch_lips: "Observa los labios de mi amigo diciendo",
  tap_play: "Para continuar, toca el botón de play.",
  watch_how_to_say: "Observa cómo se dice",
  now_you_say_word: "Ahora di tú la palabra ",
  lets_read_word: "Leamos la palabra",
  let_me: "Permíteme",
  say: "decir",
  makes: "hace",
  times: "veces",
  now_you_try_word: "Ahora trata tú de leer esta palabra",
  im_going_to: "Voy a",
  sound_out: "sonar",
  the_word_is_capitalized: "La palabra es",
  sound_out_capitalized: "Sonar",
  spellOutLeadIn: "Trata de sonar esta palabra.",
  spellOutLeadInBeforeVersion: "Voy a deletrear esta palabra para ti",
  imGoingToSoundThisWordOut: "Voy a sonar esta palabra",
  tryToSoundOut: "Trata de sonar",
  soundOutLeadIn1: "Voy a pronunciar las partes de la palabra",
  soundOutLeadIn2: "para ti.",
  repeat_after_me: "Repita después de mí",
  show_again: "Te mostraré de nuevo",
  be_carful_not_to: "Ten cuidado de no",
  make_this_mistake: "cometer este error",
  mistake_added: (word) => `agregar ${word} al final.`,
  letsWorkOn: "Trabajemos en:",
  is_pronounced: "se pronuncia",
  mistake_dropped: (word) => `olvidarte de la terminación ${word}.`,
  mistake_mix_up_ending: (word) => ` mezclar la terminación ${word}.`,
  word_has_many_letters_and_many_syllables: (word, n) => `la palabra tiene ${word.length} letras y ${n} ${n > 1 ? 'sílabas' : 'sílaba'} `, //TRANSLATE
  word_has_many_letters_and_many_sounds: (word, n) => `la palabra tiene ${word.length} letras y ${n} ${n > 1 ? 'sonidos' : 'sonido'}.`, //TRANSLATE
  try_to_sound_it_out: "Intenta sonar esta palabra",
  ok: "Ok,",
  ok_im_going_to_sound_out_this_word_for_you: "Ok, voy a sonar esta palabra para ti.",
  pay_attention_to_the_word_ending: "Presta atención a la terminación de esta palabra",
  letters: "Letras",
  sounds: "Sonidos",
  heres_a_riddle: "Tengo un acertijo para ti.", //TRANSLATE
  riddle_solved: "¡Sí! ¡Resolviste el acertijo!", //TRANSLATE
  riddle_unsolved: (answer) => `Esperaba que dijeras ${answer}.`, //TRANSLATE
  morpheme: {
    prefix: "comienzo", //TRANSLATE
    suffix: "finalizando", //TRANSLATE
    root: "raíz", //TRANSLATE
    intro: (word, morpheme, morphemePosition, morphemeMeaning) => `Esta palabra tiene un común ${morphemePosition}. los ${morpheme} en ${word} está en muchas palabras. Significa ${morphemeMeaning}. Siempre que veas estas letras juntas, te dicen mucho sobre cómo decir y entender la palabra. ¿Puedes pensar en otra palabra que tenga lo mismo ${morphemePosition}?`, //TRANSLATE
    correct_response: "¡Gran trabajo!", //TRANSLATE
    give_alternate: (altMorph, morphemePosition) => `${altMorph} es otra palabra que usa esto ${morphemePosition}.`, //TRANSLATE
  },
  cognate_intro: (word, cognate) => `${word} es <lang xml:lang="es-ES">${cognate}</lang> en español.`, //TRANSLATE
  cognate_now_you_say_it: "Ahora dices la palabra en inglés.", //TRANSLATE
  name: {
    title: "Nombre", //TRANSLATE
    intro: (word, phoneme, meaning = null) => {
      let speech = `<p>Este nombre se suele pronunciar: <prosody rate=\"x-slow\"><phoneme alphabet=\"ipa\" ph=\"${phoneme}\"> ${word} </phoneme></prosody>.</p> <break time=\"0.5s\"/>`; //TRANSLATE
      if (meaning) {
        speech += `<p>Significa, ${meaning}.</p> <break time=\"0.5s\"/>`; //TRANSLATE
      }
      speech += `<p>Solo para sentirse cómodo con este nombre, diga: hola ${word}!</p>`; //TRANSLATE
      return speech;
    },
  },
  vocabulary_with_picture: {
    intro: (word, descriptor) => `${word} es un ${descriptor} palabra.`, //TRANSLATE
    question_text: (word) => `¿Qué imagen muestra mejor la palabra? ${word}?`, //TRANSLATE
    correct_response: "Está usted en lo correcto.", //TRANSLATE
    meaning: (word, meaning) => `${word} medio ${meaning}.`, //TRANSLATE
    descriptor: ["bastante difícil"], //TRANSLATE
    expire_right_answer: (word, meaning) => `${word} medio ${meaning}.`, //TRANSLATE
  },
  prediction_question: {
    intro: 'De acuerdo, veamos qué tan bueno eres para adivinar lo que sucede a continuación.<break time="0.5s"/> Piense en la historia que hemos leído hasta ahora.', //TRANSLATE
    correct_response: [
      "Gracias. Estás en lo correcto.", //TRANSLATE
      "Gran lectura, eso es correcto.", //TRANSLATE
      "Estoy tan orgulloso de ti. ¡Lo estás haciendo genial!", //TRANSLATE
    ],
    expire_right_answer: (answer) => `La respuesta correcta es: ${answer}.`, //TRANSLATE
  },
};



const EN_US_COPY_STRINGS = {
  //INTRODUCTION
  ready_to_start: "Ready to start?",
  lets_do_it: "Let's do it",
  ready: "Ready",
  set: "Set",
  start_bang: "Start!",
  and: "and",
  by: "by",
  or: "or",
  hello: "Hello",
  assigned_amira_intro: "My name is Amira. Your teacher would like for you to read to me. Okay?",
  amira_intro: "My name is Amira.  I'd like to read with you today.",
  great_to_see_you: "Great to see you",
  enter: "Enter",
  blank: "blank",

  //STUDENT HISTORY
  you_read_stories: (numberOfStories, numberOfTests) => `You've red ${numberOfStories} stories with me and taken ${numberOfTests} tests. `,
  you_usually_read_stats: (avgWPM, avgAccuracy) => `You usually read ${avgWPM} words every minute and get about ${avgAccuracy} percent of them right. `,
  enjoy_reading_together: "I really enjoy our time reading together.",
  no_student_history: "We haven't red together yet. I'm looking forward to reading with you. Please come back after you've taken a test.",
  nice_to_meet_you: "Nice to Meet You!",
  getting_history: "Getting your history",
  how_you_are_doing: "Here's how you're doing",

  //VOICE PICKER OPTIONS
  ive_selected_x_stories: (numStories) => `I've selected ${numStories} stories for you:`,
  which_story: (readAloud) => `Which story would you like to ${readAloud ? 'hear' : 'read'}?`,
  id_like_you_to_read: "I'd like you to read:",
  click_story_to_start: "Click or say the name of the story when you're ready to start",
  no_stories_speech: "I'm sorry, something went wrong. There are no stories for you",
  no_stories_text: "There are no Stories to Display",
  kindergarten: "Kindergarten",
  first_grade: "First Grade",
  second_grade: "Second Grade",
  third_grade: "Third Grade",
  what_grade: "What grade are you in?",
  didnt_understand: "I'm sorry, I didn't understand that.",
  what_activity_today: "What would you like to do today?",
  what_activity_next: "What would you like to do next?",
  take_a_test: "Take a test",
  take_a_test_speech: "take a test",
  read_a_story: "Read a story",
  read_a_story_speech: "reed a story to me",
  read_a_story_in_spanish: "Leer una historia",
  read_a_story_in_spanish_speech: "léeme una historia en español",
  see_progress: "See progress",
  see_progress_speech: "see your progress",
  no_activities_speech: "Your teacher hasn't assigned you any activities.",
  would_you_like: "Would you like to",
  loading: "Loading",

  //ASSESSMENT INSTRUCTIONS
  orf_instructions: "Before you start reading, I have a few instructions for you. <break time=\"1s\"/> I would like you to read this story aloud for me. Read until you reach the end of the story or until I tell you to stop. Try each word, but If you come to a word that you do not know, <break time=\"0.5s\"/> you may skip it <break time=\"0.5s\"/> and read the next word you know. <break time=\"0.25s\"/> I'm going to count down and then you can start reading. Remember to read loud enough for me to hear. Let's get started!",
  orf_with_page_navigation_instructions: "Before you start reading, I have a few instructions for you. <break time=\"1s\"/> I would like you to read this story aloud for me. When you reach the end of a page, use the arrow button to move on. Read until you reach the end of the story or until I tell you to stop. Try each word, but If you come to a word that you do not know, <break time=\"0.5s\"/> you may skip it <break time=\"0.5s\"/> and read the next word you know. <break time=\"0.25s\"/> I'm going to count down and then you can start reading. Remember to read loud enough for me to hear. Let's get started!",
  dyslexia_instructions: "We're going to start off with a few short reading activities. Please wait for me to give you instructions for each part, then I'll listen to you read. Please read loudly and clearly. Let's get started!",
  nwf_instructions:  "When you don't know a word, you try to sound it out. In the next section we are going to practice that by reading words that aren't real, but could be. For each one, put the different sounds the letters make together to form a complete word.",
  spelling_intro:  "In this section we are going to work on spelling.",
  listening_comprehension_intro:  "My friend is going to read you a story. Let’s listen carefully together. After the story I’ll ask you a few questions.",
  reading_comprehension_intro:  "Great job reading! Now I have a few questions about that story. I'll read the question and each of the answers. Try your best!",
  vocabulary_screener_intro: "For this next activity, I want you to choose the word that best fits. I will read the words to you.",
  abbreviated_instructions: "Skipping Instructions",
  relevel_instructions: "Ok, let's get ready to read again. Please read loudly and clearly. If you get to a word that you do not know, remember that you may skip it. I'm going to count down and then you can start reading.",
  next_section_transition: "Great job on that part! Now we're going to try something else.",
  please_wait: "Please wait until Amira tells you to start",
  end_assessment: "END ASSESSMENT",
  try_different_story: "I think we should try switching to a different story.",
  please_keep_reading: "You're not finished yet, please keep reading.",

  //INTERVENTIONS
  keep_reading: "Let's keep reading!",
  try_again: "let's try that again",
  start_reading: "Please start reading",

  //STATUS STRINGS
  onFire: [
    "Really good job.",
    "That's great reading.",
    "Amazing job.",
    "You are on fire.",
    "Super job, reading.",
    "Way to go.",
    "You did a wonderful job.",
    "Good progress, pal.",
  ],
  goodAccuracy: [
    "That was nice reading.",
    "Appreciate how clearly you red.",
    "I think you red pretty accurately today.",
    "Way to go -- you got a lot of words right.",
    "Very few mistakes.  Nice work.",
    "You red a lot of hard words right.",
    "Nice reading today.",
  ],
  workOn: [
    "We'll work on doing better.",
    "I know you can improve.",
    "Keep working hard.",
    "We can do even better next time.",
    "If we keep reading together, you'll get even more right.",
    "Let's keep at this.",
    "I hope you will keep reading with me.",
    "Keep at it.",
  ],
  goodSpeed: [
    "You were reading at a nice speed.",
    "Appreciate how you red through this story.",
    "You red at a good pace today.",
    "You're a quick reader.",
    "Nice job reading so smoothly.",
    "You red nice and fast today.",
    "Today, you red nice and fast.",
  ],
  wrapUp: [
    "Thanks for reading together.",
    "Thank you for reading to me.",
    "I enjoyed reading together.",
    "Appreciate you spending time reading.",
    "Thank you.",
    "Great reading with you.",
    "Appreciate you reading with me.",
  ],
  keep_up: "Keep up the good work!",
  status_stats_speech_front: (wcpm, accuracy) => `You red ${wcpm} words each minute and got ${accuracy} percent of them right`,
  stats_compare_improved: (wpmDifference, accuracyDifference) => `That's ${wpmDifference} words faster and ${accuracyDifference} percent more accurate than usual.`,
  stats_compare_improved_wpm: (wpmDifference) => `That's ${wpmDifference} words faster than usual.`,
  stats_compare_improved_accuracy: (accuracyDifference) => `That's ${accuracyDifference} percent more words right than usual.`,
  times_up_speech: "Your time is up. Great work!",
  finished_story_speech: "Great work, you finished the story!",
  finished_assessment_speech: "Great work, you are all finished.  I'm going to log you out so you can move on with your day. Thank you.",
  all_done_speech: "Great work! You're all done.",
  stats_speech: (wcpm, accuracy) => `You red ${wcpm} words each minute and got ${accuracy} percent of them right.`,
  stats_speech_compare_improved: (wpmDifference) => `You red this story ${wpmDifference} words faster than usual and with higher accuracy.`,
  stats_speech_compare_improved_wpm: (wpmDifference, accuracy) => `You red this story ${wpmDifference} words faster than usual. Your accuracy was ${accuracy} percent.`,
  stats_speech_compare_improved_accuracy: (accuracyDifference) => `You red this story with ${accuracyDifference} percent higher accuracy than usual.`,
  even_better: "We can work together to get even better.",
  work_to_get_better: "We can work together to get better.",
  times_up: "Time's Up",
  finished_story: "You Finished the Story",
  all_done: "All Done",
  speed: "Speed",
  average_speed: "Average Speed",
  correct: "Correct",
  average_correct: "Average Correct",
  great_work: "Great work!",

  //GENERAL DISPLAY
  example: "example",

  //ERROR MODALS
  audio_error_speech: "I'm having trouble understanding you, so we'll have to start over. Please make sure that your microphone is unmuted and that you are speaking loudly and clearly. When you are ready to try again, click the 'restart' button",
  error_speech: "I'm sorry, an error has occured so we'll have to start over. When you are ready to try again, click the 'sign out and restart' button",
  mute_error_speech: "It looks like your microphone is muted. Please unmute and then click 'I'm Ready' to continue",
  disabled_error_speech: "It looks like you have not enabled access to your microphone. Please enable your microphone and then click the button to continue",
  kid_error_speech: "Oops! We need help! Raise your hand so that your teacher will come help us.",
  error_text: "I'm sorry, but something went wrong and I will need to restart your assessment.",
  mute_error_text: "It looks like you're on mute. Please make sure that your microphone is unmuted, then click the button below to begin",
  audio_error_text: "I can't understand you. Please make sure that your microphone is unmuted and that you are speaking loudly and clearly",
  compat_error_text: "It looks like your browser is not supported, or is out of date. Please update to Chrome 70 or higher in order to read with Amira.",
  compat_error_text_os: "It looks like your operating system is not supported, or is out of date.",
  compat_error_no_spanish: "Your browser does not support Spanish practice. Hit 'I'm ready' to go back to the main menu",
  compat_error_text_mobile: "It looks like your mobile device is not supported.",
  compat_error_text_ipad: "It looks like your browser is not supported, or is out of date. Please update to iOS 12 or higher in order to read with Amira.",
  disabled_error_continue: "It looks like you have not enabled access to your microphone. Please enable microphone access for this web page to continue.",
  disabled_error_text: "It looks like you have not enabled access to your microphone. Please log back in and select Allow when asked for the microphone.",
  blank_error_text: "I'm having trouble listening to your speech. Please hit Logout to refresh your browser. You will need to log in again",
  ipad_error_text: "Amira for Teachers is not currently supported on iPad. To continue as a student, click OK and then log back in with student credentials.",
  raise_your_hand: "Raise Your Hand",
  logout: "Logout",
  im_ready: "I'm ready",
  restart: "Restart",
  logout_and_restart: "Logout and restart",
  browser_not_supported: "Your browser is not supported",
  os_not_supported: "Your operating system is not supported",
  mobile_not_supported: "Your mobile device is not support",
  wait_modal_text: "Please wait while I save your reading",
  scoring_wait_modal_text: "Please wait while I save your scored activity",
  wait_modal_title: "Saving",
  no_stories_for_you: "You've read all the stories that are available to you. Please raise your hand and ask the teacher to help.",
  no_stories_for_you_text: "All the stories for this screening window have been taken. The student can continue to read non-assessment stories",
  all_stories_taken: "No available stories",

  //TUTOR
  read_with_me_mode: "Let's read some of this story together. I will read each phrase to you. After I have finished, you should try the phrase on your own.",
  end_read_with_me_mode: "Ok, I'll read one more phrase for you. After this phrase, you can read to me.",
  intervention_strings: EN_US_INTERVENTION_STRINGS,
}

const ES_MX_COPY_STRINGS = {
  //INTRODUCTION
  ready_to_start: "¿Estamos listos para comenzar?",
  lets_do_it: "Hagámoslo",
  ready: "Lee",
  set: "Listos",
  start_bang: "¡Fuera!",
  and: "y",
  by: "por",
  or: "o",
  hello: "Hola",
  assigned_amira_intro: "Mi nombre es Amira. Tu maestro quisiera que leyeras para mí. ¿Está bien?",
  amira_intro: "Mi nombre es Amira.  Me gustaría leer hoy contigo.",
  great_to_see_you: "Qué bueno verte",
  enter: "Intro",
  blank: "en blanco",


  //STUDENT HISTORY
  you_read_stories: (numberOfStories, numberOfTests) => `Has leído ${numberOfStories} historias conmigo, y has tomado ${numberOfTests} pruebas. `,
  you_usually_read_stats: (avgWPM, avgAccuracy) => `Usualmente lees ${avgWPM} palabras por minuto y pronuncias el ${avgAccuracy} por ciento de ellas de manera correcta. `,
  enjoy_reading_together: "Disfruto mucho de nuestro tiempo de lectura juntos.",
  no_student_history: "Todavía no hemos leído juntos. Tengo muchas ganas de leer contigo. Por favor, regresa después de haber tomado una prueba.",
  nice_to_meet_you: "¡Gusto en conocerte!",
  getting_history: "Buscando tu historial",
  how_you_are_doing: "Estos son los resultados de tu progreso",

  //VOICE PICKER OPTIONS
  ive_selected_x_stories: (numStories) => `He seleccionado ${numStories} cuentos para ti:`,
  which_story: (readAloud) => `¿Cuál cuento te gustaría ${readAloud ? 'oír' : 'leer'}?`,
  id_like_you_to_read: "Me gustaría que leyeras:",
  click_story_to_start: "Has click o di el nombre de la historia cuando quieras empezar",
  no_stories_speech: "Lo siento, ha fallado algo. No hay historias para ti",
  no_stories_text: "No hay historias para mostrar",
  kindergarten: "Jardín de infancia",
  first_grade: "Primer grado",
  second_grade: "Segundo grado",
  third_grade: "Tercer grado",
  what_grade: "¿En qué grado estás?",
  didnt_understand: "Lo siento, no entendí eso.",
  what_activity_today: "¿Qué te gustaría hacer hoy?",
  what_activity_next: "¿Qué te gustaría hacer a continuación?",
  take_a_test: "Tomar una prueba",
  take_a_test_speech: "Tomar una prueba",
  read_a_story: "Leer una historia",
  read_a_story_speech: "léeme una historia",
  read_a_story_in_spanish: "Leer una historia en español",
  read_a_story_in_spanish_speech: "léeme una historia en español",
  see_progress: "Ver el progreso",
  see_progress_speech: "mira tu progreso",
  no_activities_speech: "Tu maestro no te ha asignado ninguna actividad.",
  would_you_like: "¿Te gustaría",
  loading: "Cargando",


//ASSESSMENT INSTRUCTIONS
  orf_instructions: "Antes de que empieces a leer, tengo algunas instrucciones para ti. <break time=\"1s\"/> Me gustaría que me leyeras esta historia en voz alta. Lee hasta que alcances el final de la historia o hasta que yo te indique que te detengas. Intenta leer todas las palabras, pero si te topas con una palabra que no conoces, <break time=\"0.5s\"/> puedes saltarla <break time=\"0.5s\"/> y leer la siguiente palabra que conoces. <break time=\"0.25s\"/> Comenzaré la cuenta regresiva para que empieces a leer. Recuerda leer lo suficientemente fuerte para que te pueda escuchar. ¡Comencemos!",
  dyslexia_instructions: "Vamos a empezar con algunas actividades de lectura cortas. Por favor espera a que te dé las instrucciones para cada parte, después te escucharé leer. Por favor lee fuerte y claro. ¡Empecemos!",
  nwf_instructions:  "Cuando no te sabes una palabra, tratas de pronunciar sus sonidos. En la siguiente sección, vamos a practicar eso leyendo palabras que no son reales, pero que podrían serlo. Para cada una, junta los diferentes sonidos que hacen las letras para formar una palabra completa.",
  spelling_intro:  "En esta sección, vamos a trabajar con la ortografía.",
  listening_comprehension_intro:  "Mi amigo te va a leer una historia. Vamos a escuchar con atención. Después de la historia, te voy a hacer unas preguntas.",
  reading_comprehension_intro:  "¡Buen trabajo leyendo! Ahora tengo algunas preguntas sobre esa historia. Leeré la pregunta y cada una de las respuestas. ¡Haz tu mejor esfuerzo !", //TRANSLATE
  vocabulary_screener_intro: "Para esta próxima actividad, quiero que elija la palabra que mejor se ajuste. Te leeré las palabras.", //TRANSLATE
  abbreviated_instructions: "Skipping Instructions",
  relevel_instructions: "De acuerdo, vamos a prepararnos para leer otra vez. Lee fuerte y claro. Si te topas con una palabra que no conoces, recuerda que puedes saltarla. Comenzaré la cuenta regresiva para que empieces a leer.",
  next_section_transition: "¡Qué gran trabajo en esa parte! Ahora intentaremos algo distinto.",
  please_wait: "Por favor espera a que Amira te indique que puedes comenzar",
  end_assessment: "CONCLUIR EVALUACIÓN",
  try_different_story: "Pienso que deberíamos intentar cambiando a una historia diferente.",
  please_keep_reading: "Aún no has terminado, sigue leyendo.", //TRANSLATE


 //INTERVENTIONS
  keep_reading: "¡Sigamos leyendo!",
  try_again: "intentemos eso de nuevo",
  start_reading: "Por favor empieza a leer",

  //STATUS STRINGS
  onFire: [
    "Un trabajo extremadamente bueno.",
    "Qué gran lectura.",
    "Buen trabajo.",
    "Estás que ardes.",
    "Leíste muy bien.",
    "Qué buen progreso",
  ],
  goodAccuracy: [
    "Esa fue una buena lectura.",
    "Aprecio lo bien que leíste.",
    "Pienso que tu lectura de hoy fue muy acertada.",
    "Hoy leíste muchas palabras difíciles.",
    "Buena lectura la de hoy.",
  ],
  workOn: [
    "Trabajaremos para mejorar.",
    "Sé que puedes mejorar.",
    "Sigue trabajando duro.",
    "Espero que puedas seguir leyendo conmigo.",
    "Sigue así."
  ],
  goodSpeed: [
    "Estuviera leyendo a una buena velocidad.",
    "Aprecio cómo leíste esta historia.",
    "Hoy leíste a un buen ritmo.",
    "Hiciste un buen trabajo con la fluidez de tu lectura.",
    "Hoy leíste muy bien y rápido.",
  ],
  wrapUp: [
    "Gracias por haber leído junto a mí.",
    "Gracias por leer conmigo.",
    "Disfruté leyendo contigo.",
    "Fue genial haber leído contigo",
    "Aprecio que te hayas tomado el tiempo de leer.",
    "Gracias.",
    "Ha sido genial leer contigo.",
    "Aprecio que hayas leído conmigo."
  ],
  keep_up: "¡Continua el buen trabajo!",
  status_stats_speech_front: (wcpm, accuracy) => `Leíste ${wcpm} palabras por minuto y tuviste correctas el ${accuracy} por ciento de ellas`,
  stats_compare_improved: (wpmDifference, accuracyDifference) => `Esas son ${wpmDifference} palabras más rápido y ${accuracyDifference} por ciento más acertado de lo usual.`,
  stats_compare_improved_wpm: (wpmDifference) => `Esas son ${wpmDifference} palabras más rápido de lo usual.`,
  stats_compare_improved_accuracy: (accuracyDifference) => `Eso es ${accuracyDifference} por ciento más de palabras correctas de lo usual.`,
  times_up_speech: "Se acabó el tiempo. ¡Excelente trabajo!",
  finished_story_speech: "¡Buen trabajo, completaste la historia!",
  finished_assessment_speech: "Excelente trabajo, ya terminaste. Voy a desconectarte para que puedas continuar con tu día. Gracias.",
  all_done_speech: "¡Buen trabajo! Ya terminaste.",
  stats_speech: (wcpm, accuracy) => `Leíste ${wcpm} palabras por minuto y tuviste correctas el ${accuracy} por ciento de ellas.`,
  stats_speech_compare_improved: (wpmDifference) => `Leíste esta historia ${wpmDifference} palabras más rápido de lo usual y con mayor precisión.`,
  stats_speech_compare_improved_wpm: (wpmDifference, accuracy) => `Leíste esta historia ${wpmDifference} palabras más rápido de lo usual. Tu precisión fue de ${accuracy} por ciento.`,
  stats_speech_compare_improved_accuracy: (accuracyDifference) => `Leíste esta historia con un ${accuracyDifference} por ciento más de precisión de lo usual.`,
  even_better: "Podemos trabajar juntos para mejorar mucho más.",
  work_to_get_better: "Podemos trabajar juntos para mejorar.",
  times_up: "Se Acabó el Tiempo",
  finished_story: "Completaste la Historia",
  all_done: "Todo Listo",
  speed: "Velocidad",
  average_speed: "Velocidad media", //TRANSLATE
  correct: "Correcto",
  average_correct: "Promedio correcto", //TRANSLATE
  great_work: "¡Gran trabajo!",

  //GENERAL DISPLAY
  example: "ejemplo",

  //ERROR MODALS
  audio_error_speech: "Estoy teniendo problemas para entenderte, por lo que tendremos que empezar otra vez. Por favor asegúrate de que tu micrófono no se encuentre silenciado de que estés hablando fuerte y claro. Cuando quieres volver a intentarlo, haz click en el botón de 'reiniciar'",
  error_speech: "Lo siento, ha ocurrido un error y deberemos empezar otra vez. Cuando quieres volver a intentarlo, haz click en el botón 'cerrar sesión y reiniciar'",
  mute_error_speech: "Parece que tu micrófono se encuentra silenciado. Por favor desactiva el silenciado y haz click en 'Continuemos' para continuar",
  disabled_error_speech: "Parece que no has habilitado el acceso a tu micrófono. Por favor habilita tu micrófono y luego haz click en el botón para continuar",
  kid_error_speech: "¡Uy! ¡Necesitamos ayuda! Alza tu mano para que tu maestro se acerque hacia nosotros.", //TRANSLATE. note "Ups" is pronounced "u-p-s" like united postal service
  error_text: " Lo siento, pero algo salió mal y tendré que reiniciar tu evaluación.",
  mute_error_text: "Parece que estás silenciado. Asegúrate de que tu micrófono no esté silenciado y luego haz click en el siguiente botón para comenzar",
  audio_error_text: "No logro entenderte. Asegúrate de que tu micrófono no esté silenciado y de hablar fuerte y claro",
  compat_error_text: "Pareciera que tu explorador no es compatible o está desactualizado. Actualiza a Chrome 70 o superior para poder leer con Amira.",
  compat_error_text_os: "Parece que tu sistema operativo no es compatible, o está desactualizado.",
  compat_error_no_spanish: "Su navegador no admite la práctica del español. Presiona 'Continuemos' para volver al menú principal",
  compat_error_text_mobile: "Parece que tu dispositivo móvil no es compatible.",
  compat_error_text_ipad: "Pareciera que tu explorador no es compatible o está desactualizado. Actualiza a iOS 12 o superior para poder leer con Amira.",
  disabled_error_text: "Parece que no has habilitado el acceso a tu micrófono. Vuelva a iniciar sesión y seleccione Permitir cuando se le solicite el micrófono.", //TRANSLATE
  disabled_error_continue: "Parece que no has permitido el acceso a tu micrófono. Por favor, permite el acceso a tu micrófono en este sitio web para continuar.",
  blank_error_text: "Estoy teniendo dificultades para escucharte hablar. Por favor cierra sesión y actualiza tu explorador. Deberás iniciar sesión otra vez",
  ipad_error_text: "Amira para Profesoras no es compatible actualmente con iPad. Para continuar como estudiante, haga clic en Aceptar y luego vuelva a iniciar sesión con credenciales de estudiante.",
  raise_your_hand: "Alza la mano",
  logout: "Cerrar sesión",
  im_ready: "Continuemos",
  restart: "Reiniciar",
  logout_and_restart: "Cerrar sesión", //TRANSLATE note: "Cerrar sesion y reiniciar" is too long, we need something shorter
  browser_not_supported: "Tu explorador no es compatible",
  os_not_supported: "Tu sistema operativo no es compatible",
  mobile_not_supported: "Tu dispositivo móvil no es compatible",
  wait_modal_text: "Por favor espera mientras guardo tu lectura",
  scoring_wait_modal_text: "Por favor espera mientras guardo tu actividad puntuada",
  wait_modal_title: "Guardando",
  no_stories_for_you: "Has leído todas las historias disponibles para ti. Por favor, alza la mano y solicita la ayuda de tu maestro.",
  no_stories_for_you_text: "Todas las historias de esta ventana de selección han sido tomadas. El estudiante puede continuar leyendo historias que no son de evaluación",
  all_stories_taken: "No hay historias disponibles",

  //TUTOR
  read_with_me_mode: "Leamos el resto de la historia juntos. Te leeré cada una de las frases. Cuando termine, deberías intentar leer las frases tú mismo.", // UPDATE THE TRANSLATION
  end_read_with_me_mode: "Ok, I'll read one more phrase for you. After this phrase, you can read to me.", // TRANSLATE
  intervention_strings: ES_MX_INTERVENTION_STRINGS,
}


export let COPY_STRINGS = EN_US_COPY_STRINGS;

export function setCopyStrings(locale) {
  switch(locale){
    case("en-us"):
      COPY_STRINGS = EN_US_COPY_STRINGS;
      break;
    case("es-mx"):
      COPY_STRINGS = ES_MX_COPY_STRINGS;
      break;
    default:
      COPY_STRINGS = EN_US_COPY_STRINGS;
      break;
  }
}