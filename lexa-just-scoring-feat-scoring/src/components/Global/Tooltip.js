import React from 'react';
import PropTypes from 'prop-types';
import FaQuestion from 'react-icons/lib/fa/question-circle-o';
import ReactTooltip from 'react-tooltip';

export const tooltipTypes = {
    scoreType: 'scoreType',
    scale: 'scale',
    benchmarks: 'benchmarks',
    metric: 'metric',
    score: 'score',
    pr: 'pr',
    readingLevel: 'readingLevel',
    area: 'area',
    predictedAbility: 'predictedAbility',
    phonologicalAwareness: 'phonologicalAwareness',
    sightRecognition: 'sightRecognition',
    vocabulary: 'vocabulary',
    decoding: 'decoding',
    resourcesAndExamples: 'resourcesAndExamples',
    appropriatelyChallengingSkills: 'appropriatelyChallengingSkills',
    tipsForHelping: 'tipsForHelping',
    understandingScores: 'understandingScores',
    riskLevel: 'riskLevel',
    atRisk: 'atRisk',
}

const tooltipText = {
    scoreType: 'Adjusted scores account for differences in the difficulty of the passages read.',
    scale: 'Change the scale to Lexile, DRA, or WCPM.',
    benchmarks: 'National benchmarks are based on the results from students across the country.  If present, District benchmarks are provided to Amira by your District.',
    metric: 'Change the scale to Oral Reading Fluency, Reading Mastery, Sight Recognition, Phonological Awareness, or Vocabulary Size.',
    score: 'This shows student\'s most recent assessment score and the date it was taken or rescored.',
    pr: 'The PR is the student\'s Percentile Ranking, based on the student\'s performance compared to other students associated with the selected benchmark.',
    readingLevel: 'Amira uses the calculated CLS to identify a student\'s instructional reading level.  This is the level of text complexity where the student is likely to make enough errors to be challenged and learning, but not so many as to induce frustration.',
    area: 'AREA stands for Amira Reading Estimated Age. <br />The value tells you how this student compares to others as an overall reader.   Essentially, the student is placed into a cohort of students nationally. The typical age of the students in that cohort is this student\'s AREA score.',
    predictedAbility: 'The blue line on the chart shows how the student\'s mastery is changing. <br /><br />The triangle indicates the predicted mastery level by the end of the student year. <br /><br />This progress line reflects the improvement Amira is documenting in the student\'s reading.  The line can show significant growth, very gradual growth or even, rarely, a slide in the student\'s fluency.',
    phonologicalAwareness: 'This tab shows a student\'s Percentile Ranking in relationship to all students nationally. The skills reflect a scope and sequence for Letter-Sound Correspondence mastery. Amira is tracking about 180 specific letter-sounds',
    sightRecognition: 'This tab shows a student\'s Percentile Ranking in relationship to all students nationally. The skills are specific high frequency words that students should ultimately read via sight recognition. Amira is tracking about 400 high frequency words, most from the Dolch list.',
    vocabulary: 'This tab shows a student\'s Percentile Ranking in relationship to all students nationally. The skills reflect the Into Reading scope and sequence for Vocabulary.',
    decoding: 'This tab shows a student\'s Percentile Ranking in relationship to all students nationally.  The score reflects a student\'s ability to segment and blend words, and read grade-level appropriate words.',
    resourcesAndExamples: 'We recommend these resources to address the gaps in the student\'s mastery, as identified above.  Each resource is selected to target a student\'s current abilities and growth areas.',
    appropriatelyChallengingSkills: 'These skills should be emphasized in individual and small group instruction.',
    tipsForHelping: 'These are suggestions for how the parent can pitch in. They are meant just to be a good basis for the teacher-parent dialog.',
    understandingScores: "Words Correct Per Minute (WCPM) is the standard measure of Oral Reading Fluency. Estimated Vocabulary size is a good indication of a student's level of comprehension and world knowledge. In both cases, the larger the number the better.",
    riskLevel: 'Risk is not diagnosis. Amira provides an early warning if a student seems to be evidencing the reading behaviors associated with Dyslexia.',
    atRisk: 'Any student scoring above 30 is "at risk". Stronger signals vary by grade but typically are associated with scores in the mid-thirties and above.',
}

export class Tooltip extends React.Component {
    render() {
        const { type } = this.props;
        const id = type + 'Tooltip';
        const textId = id + 'Text';
        let text = tooltipText[type];
        text = '<div id="' + textId + '" class="amiraTooltipText">' + text + '</div>';

        return (
            <span className="amiraTooltipContainer" data-tip data-for={id} data-html={true}>
                <FaQuestion className="amiraTooltipIcon" size="18" />
                <ReactTooltip id={id} className="amiraTooltip" place="top" effect="solid">
                   { text }
                </ReactTooltip>
            </span>
        );
    }
}

Tooltip.propTypes = {
    type: PropTypes.string.isRequired,
}
