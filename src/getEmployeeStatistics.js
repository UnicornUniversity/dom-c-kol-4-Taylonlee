function getAge(birthdateString) {
  const birthDate = new Date(birthdateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function getMedian(numbers) {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const med = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  return Math.round(med);
}

/**
 * Počítá statistiky (logika přesunuta sem).
 * @param {Array} employees Seznam zaměstnanců
 * @returns {object} Statistiky
 */
export function getStatistics(employees) {
  const total = employees.length;
  const ages = [];
  const workloads = [];
  let wWlSum = 0;
  let wCount = 0;
  let ageSum = 0;
  const wlCounts = { 10: 0, 20: 0, 30: 0, 40: 0 };

  for (const e of employees) {
    const age = getAge(e.birthdate);
    ages.push(age);
    ageSum += age;
    workloads.push(e.workload);
    if (wlCounts[e.workload] !== undefined) wlCounts[e.workload]++;
    if (e.gender === "female") { wWlSum += e.workload; wCount++; }
  }

  const sortedAges = [...ages].sort((a, b) => a - b);
  const avgAge = total > 0 ? parseFloat((ageSum / total).toFixed(1)) : 0;
  const avgWWl = wCount > 0 ? parseFloat((wWlSum / wCount).toFixed(1)) : 0;

  return {
    total,
    workload10: wlCounts[10], workload20: wlCounts[20],
    workload30: wlCounts[30], workload40: wlCounts[40],
    averageAge: avgAge,
    minAge: sortedAges.length > 0 ? sortedAges[0] : null,
    maxAge: sortedAges.length > 0 ? sortedAges[sortedAges.length - 1] : null,
    medianAge: getMedian(sortedAges),
    medianWorkload: getMedian(workloads),
    averageWomenWorkload: avgWWl,
    sortedByWorkload: [...employees].sort((a, b) => a.workload - b.workload)
  };
}
