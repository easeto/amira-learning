export const report = {
  meta: {},
  // just object map in the benchmark chart component if necessary
  cutlines: [
    {
      id: 'DISTRICT', // || '8675-3O-NIIGH-YINE'
      label: '75th Percentile',
      value: 84
    },
    {
      id: 'SCHOOL', // || '8675-3O-NIIGH-YINE'
      label: '25th Percentile',
      value: 36
    },
  ],
  // these derive from cutlines
  cutoffs: {
    POOR: 36,
    AVERAGE: 84,
  },
  metric: {
    id: 'ORF',
    label: 'ORF'
  },
  // less flexible up here, but much lighter overall
  district: {
    id: 981,
    label: '12C - The Noodles and Fries District',
  },
  school: {
    id: 311,
    label: 'The Really Wet School',
  },
  classroom: {
    id: 1,
    label: 'Garfield',
  },
  scores: [
    {
      id: 11,
      score: 120,
      level: 'N',
      date: '2018-10-24T20:55:09.992Z',
      student: {
        id: 1,
        first_name: "Rebecca",
        last_name: "Slater",
      }
    },
    {
      id: 12,
      score: 118,
      level: 'N',
      date: '2018-10-24T20:55:10.992Z',
      student: {
        id: 2,
        first_name: "Sam",
        last_name: "Bourne",
      }
    },
    {
      id: 13,
      score: 112,
      level: 'M',
      date: '2018-10-24T20:51:09.992Z',
      student: {
        id: 2,
        first_name: "Sally",
        last_name: "Greer",
      }
    },
    {
      id: 14,
      score: 112,
      level: 'M',
      date: '2018-10-24T20:44:09.992Z',
      student: {
        id: 3,
        first_name: "Allison",
        last_name: "Holloway",
      }
    },
    {
      id: 15,
      score: 100,
      level: 'M',
      date: '2018-10-24T20:33:09.992Z',
      student: {
        id: 4,
        first_name: "Josh",
        last_name: "Jones",
      }
    },
    {
      id: 16,
      score: 95,
      level: 'L',
      date: '2018-10-24T20:35:09.992Z',
      student: {
        id: 5,
        first_name: "Susan",
        last_name: "Whiteley",
      }
    },
    {
      id: 17,
      score: 88,
      level: 'K',
      date: '2018-10-24T20:13:09.992Z',
      student: {
        id: 6,
        first_name: "Christian",
        last_name: "Hampton",
      }
    },
    {
      id: 18,
      score: 78,
      level: 'J',
      date: '2018-10-24T20:13:09.992Z',
      student: {
        id: 7,
        first_name: "Amisha",
        last_name: "Snow",
      }
    },
    {
      id: 19,
      score: 77,
      level: 'J',
      date: '2018-10-24T20:55:09.992Z',
      student: {
        id: 8,
        first_name: "Luc",
        last_name: "Donald",
      }
    },
    {
      id: 20,
      score: 74,
      level: 'I',
      date: '2018-10-24T20:55:10.992Z',
      student: {
        id: 9,
        first_name: "Charlie",
        last_name: "Summers",
      }
    },
    {
      id: 21,
      score: 60,
      level: 'G',
      date: '2018-10-24T20:51:09.992Z',
      student: {
        id: 10,
        first_name: "Laine",
        last_name: "King",
      }
    },
    {
      id: 22,
      score: 48,
      level: 'F',
      date: '2018-10-24T20:44:09.992Z',
      student: {
        id: 11,
        first_name: "Madeleine",
        last_name: "Leech",
      }
    },
    {
      id: 23,
      score: 55,
      level: 'G',
      date: '2018-10-24T20:33:09.992Z',
      student: {
        id: 12,
        first_name: "Larry",
        last_name: "Patterson",
      }
    },
    {
      id: 24,
      score: 18,
      level: 'B',
      date: '2018-10-24T20:35:09.992Z',
      student: {
        id: 13,
        first_name: "Kristina",
        last_name: "Ramos",
      }
    },
    {
      id: 25,
      score: 28,
      level: 'C',
      date: '2018-10-24T20:13:09.992Z',
      student: {
        id: 14,
        first_name: "Eboni",
        last_name: "Buck",
      }
    },
    {
      id: 26,
      score: 32,
      level: 'D',
      date: '2018-10-24T20:13:09.992Z',
      student: {
        id: 15,
        first_name: "Erik",
        last_name: "Miller",
      }
    },
    {
      id: 27,
      score: 26,
      level: 'C',
      date: '2018-10-24T20:35:09.992Z',
      student: {
        id: 16,
        first_name: "Fahmida",
        last_name: "Thorpe",
      }
    },
    {
      id: 28,
      score: 40,
      level: 'E',
      date: '2018-10-24T20:13:09.992Z',
      student: {
        id: 17,
        first_name: "John",
        last_name: "Smith",
      }
    },
    {
      id: 29,
      score: 40,
      level: 'E',
      date: '2018-10-24T20:13:09.992Z',
      student: {
        id: 18,
        first_name: "Lauren",
        last_name: "Smitly",
      }
    },
    {
      id: 30,
      score: 46,
      level: 'F',
      date: '2018-10-24T20:55:09.992Z',
      student: {
        id: 19,
        first_name: "Rebecca",
        last_name: "Turpen",
      }
    },
    {
      id: 31,
      score: 43,
      level: 'E',
      date: '2018-10-24T20:55:10.992Z',
      student: {
        id: 20,
        first_name: "Nick",
        last_name: "Summers",
      }
    },
    {
      id: 32,
      score: 55,
      level: 'G',
      date: '2018-10-24T20:51:09.992Z',
      student: {
        id: 21,
        first_name: "Lilliana",
        last_name: "Melendez",
      }
    },
    {
      id: 33,
      score: 52,
      level: 'F',
      date: '2018-10-24T20:44:09.992Z',
      student: {
        id: 22,
        first_name: "Natalia",
        last_name: "Yoder",
      }
    },
    {
      id: 34,
      score: 65,
      level: 'G',
      date: '2018-10-24T20:33:09.992Z',
      student: {
        id: 23,
        first_name: "Jake",
        last_name: "Hamer",
      }
    },
    {
      id: 35,
      score: 95,
      level: 'L',
      date: '2018-10-24T20:35:09.992Z',
      student: {
        id: 24,
        first_name: "Liane",
        last_name: "Kong",
      }
    },
    {
      id: 36,
      score: 70,
      level: 'I',
      date: '2018-10-24T20:13:09.992Z',
      student: {
        id: 25,
        first_name: "Stella",
        last_name: "Lee",
      }
    },
    {
      id: 37,
      score: 70,
      level: 'H',
      date: '2018-10-24T20:13:09.992Z',
      student: {
        id: 26,
        first_name: "Christian",
        last_name: "Copeland",
      }
    }
  ]
}

export default {
  report,
}
