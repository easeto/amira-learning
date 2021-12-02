// react-i18next me
export const metrics = [
  {
    label: 'Oral Reading Fluency (ORF)',
    value: 'ORF',
    scales: [
      {
        value: 'WCPM',
        label: 'Words Correct Per Minute (WCPM)',
      },
      {
        value: 'Lexile',
        label: 'Lexile',
      },
      {
        value: 'DRA',
        label: 'Developmental Reading Assessment',
      },
    ],
    benchmarks: [
      {
        value: 'NationalNorms',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'National Norms',
      },
      {
        value: 'Spanish',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'Spanish Norms',
      }
    ],
    description: '',
  },
  {
    label: 'Reading Mastery',
    value: 'ReadingMastery',
    scales: [
      {
        value: 'AREA',
        label: 'Amira Reading Estimated Age (AREA)',
      },
    ],
    benchmarks: [
      {
        value: 'NationalNorms',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'National Norms',
      },
      {
        value: 'Spanish',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'Spanish Norms',
      }
    ],
    description: '',
  },
  {
    label: 'Sight Recognition',
    value: 'SightRecognition',
    scales: [
      {
        value: 'ESRI',
        label: 'ESRI'
      },
    ],
    benchmarks: [
      {
        value: 'NationalNorms',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'National Norms',
      },
      {
        value: 'Spanish',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'Spanish Norms',
      }
    ],
    description: ''
  },
  {
    label: 'Phonological Awareness',
    value: 'PhonologicalAwareness',
    scales: [
      {
        value: 'PSF',
        label: 'PSF'
      },
    ],
    benchmarks: [
      {
        value: 'NationalNorms',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'National Norms',
      },
      {
        value: 'Spanish',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'Spanish Norms',
      }
    ],
    description: ''
  },
  {
    label: 'Vocabulary Size',
    value: 'VocabSize',
    scales: [
      {
        value: 'EVS',
        label: 'Estimated Words in Vocabulary',
      },
    ],
    benchmarks: [
      {
        value: 'NationalNorms',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'National Norms',
      },
      {
        value: 'Spanish',
        grades: [0,1,2,3,4,5],
        seasons: ['Fall', 'Winter', 'Spring'],
        label: 'Spanish Norms',
      }
    ],
    description: '',
  },
];

export const comprehensiveAssessmentMetrics = [
  {
    label: 'Nonsense Word Fluency',
    value: 'NWF',
    scales: [
      {
        value: 'nwfCorrect',
        label: '# of Correct Answers',
      },
    ],
    benchmarks: [],
    description: '',
  },
  {
    label: 'Spelling (Encoding)',
    value: 'Spelling',
    scales: [
      {
        value: 'spellingCorrect',
        label: '# of Correct Answers',
      },
    ],
    benchmarks: [],
    description: '',
  },
]

export const dyslexiaMetric = {
  label: 'Dyslexia Risk Indicator (DRI)',
  value: 'DRI',
  scales: [
    {
      value: 'DR',
      label: 'Dyslexia Risk Score',
    },
  ],
  benchmarks: [
    {
      value: 'Dyslexia',
      grades: [0,1,2,3,4,5],
      seasons: ['Fall', 'Winter', 'Spring'],
      label: 'Risk Levels',
    },
  ],
  description: '',
}
