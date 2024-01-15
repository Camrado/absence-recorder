const subjectsL0S2 = {
  physics: 'Basic Physics',
  chemistry: 'Basic Chemistry',
  analysis: 'Analysis',
  algebra: 'Algebra, Probability, Statistics',
  systems: 'Systems, Algorithms, Programming',
  english: 'English',
  french: 'French',
  geoscience: 'Introduction to Geosciences',
  methodology: 'Working Methodology'
};

const getCorrectCourseName = (subject, semester) => {
  try {
    if (semester == 'L0S2') {
      for (let subjectKey in subjectsL0S2) {
        if (subject.toLowerCase().includes(subjectKey)) {
          return subjectsL0S2[subjectKey];
        }
      }
    }
  } catch (e) {}
};

// console.log(getCorrectCourseName('analysis', 'L0S2'));

module.exports = getCorrectCourseName;
