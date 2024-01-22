const subjectsL0S2 = {
  physics: 'Basic Physics',
  chemistry: 'Basic Chemistry',
  analysis: 'Analysis',
  algebra: 'Algebra, Probability, Statistics',
  systems: 'Systems, Algorithms, Programming',
  english: 'English',
  french: 'French',
  geoscience: 'Introduction to Geosciences',
  methodology: 'Working Methodology',
  physicsPW: 'Basic Physics PW',
  chemistryPW: 'Basic Chemistry PW'
};

const getCorrectCourseName = (subject, semester) => {
  try {
    if (semester == 'L0S2') {
      for (let subjectKey in subjectsL0S2) {
        if (subject.toLowerCase().includes('physics') && subject.toLowerCase().includes('pw')) {
          return subjectsL0S2['physicsPW'];
        } else if (subject.toLowerCase().includes('chemistry') && subject.toLowerCase().includes('pw')) {
          return subjectsL0S2['chemistryPW'];
        } else if (subject.toLowerCase().includes(subjectKey)) {
          return subjectsL0S2[subjectKey];
        }
      }
    }
  } catch (e) {
    // pass
  }
};

// console.log(getCorrectCourseName('analysis', 'L0S2'));

module.exports = getCorrectCourseName;
