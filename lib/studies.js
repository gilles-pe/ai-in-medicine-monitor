export function filterStudies(studies, { cutoff = '9999-12-31', topic = '' } = {}) {
  return studies.filter(study => study.date <= cutoff && (!topic || study.topic === topic))
    .sort((a, b) => b.date.localeCompare(a.date));
}
