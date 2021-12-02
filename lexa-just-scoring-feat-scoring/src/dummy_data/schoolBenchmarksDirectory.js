// School-specific benchmarks
export const schoolBenchmarksDirectory = [
  {
    id: 13162,
    label: 'CHIME',
    metrics: [
      {
        label: 'Oral Reading Fluency (ORF)',
        value: 'ORF',
        benchmarks: [
          {
            value: 'HasbrouckTindalOFS',
            grades: [1,2,3],
            seasons: ['Fall', 'Winter', 'Spring'],
            label: 'Chime Hasbrouck & Tindal',
          },
        ],
        description: '',
      },
    ]
  }
];

export default {
  schoolBenchmarksDirectory,
}