// // HORRIBLE STRUCTURE. RETHINK ME
// https://www.i18next.com/
// https://amiralearning.atlassian.net/browse/AE-1265
// react-i18next me
export const app = {
  errorHelpPrompt: "Please contact support@amiralearning.com for assistance.",
  selectPanel: {
    classrooms: 'Classes',
    metrics: 'Metrics',
    levels: 'Levels',
    label: 'Select: '
  },
  selectRoster: {
    districts: 'Districts',
    schools: 'Schools',
    classrooms: 'Classes',
    students: 'Students',
  },
  miller: {
    placeholder: 'Start typing to see list'
  },
  pillars: {
    start: '0%',
    end: '100%',
    note: 'Click the bar for details',
  },
  splash: {
    button: 'View Full Report'
  },
  planningDetail: {
    header: {
      instruction: 'Instruction',
      practice: 'Practice',
    },
    rows: {
      monday: 'MONDAY',
      tuesday: 'TUESDAY',
      wednesday: 'WEDNESDAY',
      thursday: 'THURSDAY',
      friday: 'FRIDAY',
    }
  },
  diagnosticDetail: {
    header: {
      strengths: 'Strengths',
      weaknesses: 'Weaknesses',
    },
    types: {
      strength: 'STRENGTH',
      weakness: 'WEAKNESS',
      next: 'NEXT',
    },
    tooltip: 'Show more information about this diagnosis',
    info: 'Info',
  },
  trackingTable: {
    headers: [
      {
        label: 'Last Name',
        value: 'last_name'
      },
      {
        label: 'First Name',
        value: 'first_name'
      },
      {
        label: 'Score',
        subText: 'most recent',
        value: 'score'
      },
      {
        label: 'Assessment Status',
        subText: '',
        value: 'status'
      },
    ],
  },
  parentReport: {
    header: {
      report: (firstName='Student') => `${firstName}'s' Report`,
      // JUST, PROBLEMATIC ALL OVER.
      // ughness: design insinuates gender parsing
      // REMOVE ALL GENDER DIRECTIVES FROM THIS STATEMENT
      description: (student='Student') => {
        // MAYBE FIRST LETTER UPPER
        return `This report is being provided so that you can keep track of ${student}'s progress,
          and help ${student} work on fundamental reading skills.`
      },
      tip: (firstName='Student') => `Tips for Helping ${firstName} Right Now`,
    }
  },
  progressReport: {
    headers: [
      {
        label: 'Activity Type',
        value: 'type',
      },
      {
        label: 'Score',
        value: 'score',
      },
      {
        label: 'Story Name',
        value: 'story_name',
      },
      {
        label: 'Story Grade',
        value: 'story_grade',
      },
      {
        label: 'Session Time',
        value: 'time_read',
      },
      {
        label: 'Date',
        value: 'value',
      }
    ]
  },
}

export const modal = {
  mountId: 'root'
}

export default {
  app,
  modal,
}