import React from 'react';
import enIcon from '../images/language-code-icons/en.png'
import esIcon from '../images/language-code-icons/es.png'
import cutlineIcon from '../images/report-icons/cutline-icon.png';
import { tooltipTypes, Tooltip } from '../components/Global/Tooltip';

// TODO deprecate this constant and make legend a prop of each report
export const legendItems = [
  {
    colorBlockClass: "bad",
    contents: <div> At Risk, Stronger Signals<Tooltip type={tooltipTypes.atRisk} /> </div>
  },
  {
    colorBlockClass: "average",
    contents: <div> At Risk, Weaker Signals </div>
  },
  {
    colorBlockClass: "great",
    contents: <div> Low Risk </div>
  }
];

export const dyslexiaRiskLegendItems = [
  {
    icon: enIcon,
    contents: <div> English Reading Risk </div>
  },
  {
    icon: esIcon,
    contents: <div> Spanish Reading Risk </div>
  },
  ...legendItems,
  {
    icon: cutlineIcon,
    contents: <div> Risk Cut Line </div>
  }
]