// --- Konstanty a Data ---

const MALE_NAMES = [
  "Jakub", "Jan", "Tomáš", "Adam", "Matyáš", "Filip",
  "Vojtěch", "Ondřej", "David", "Lukáš"
];

const FEMALE_NAMES = [
  "Jana", "Eva", "Renata", "Martina", "Božena", "Daniela",
  "Růžena", "Anna", "Kateřina", "Radka"
];

// Příjmení jako páry [mužské, ženské]
const SURNAMES = [
  ["Novotný", "Novotná"], ["Dvořák", "Dvořáková"], ["Černý", "Černá"],
  ["Procházka", "Procházková"], ["Kučera", "Kučerová"], ["Veselý", "Veselá"],
  ["Horák", "Horáková"], ["Němec", "Němcová"], ["Pokorný", "Pokorná"],
  ["Král", "Králová"], ["Růžička", "Růžičková"], ["Beneš", "Benešová"],
  ["Fiala", "Fialová"], ["Sedláček", "Sedláčková"], ["Šimek", "Šimková"]
];

const WORKLOADS = [10, 20, 30, 40];
const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

// --- Pomocné funkce ---

/**
 * Vybere náhodný prvek z pole.
 * @param {Array} arr Vstupní pole
 * @returns {*} Náhodný prvek
 */
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Zaokrouhlí číslo na daný počet desetinných míst.
 * @param {number} num Číslo
 * @param {number} decimals Počet míst
 * @returns {number} Zaokrouhlené číslo
 */
function round(num, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}

/**
 * Generuje náhodné datum narození podle vašeho vzorce (365.25).
 * @param {number} minAge Minimální věk
 * @param {number} maxAge Maximální věk
 * @returns {string} ISO string data
 */
function getRandomDate(minAge, maxAge) {
  const now = new Date().getTime();
  const minBirth = now - maxAge * YEAR_MS;
  const maxBirth = now - minAge * YEAR_MS;
  const randomTime = minBirth + Math.random() * (maxBirth - minBirth);
  return new Date(randomTime).toISOString();
}

/**
 * Vypočítá přesný věk z data narození.
 * @param {string} birthDateString ISO datum
 * @returns {number} Věk (desetinné číslo)
 */
function getPreciseAge(birthDateString) {
  const today = new Date().getTime();
  const birth = new Date(birthDateString).getTime();
  return (today - birth) / YEAR_MS;
}

/**
 * Vypočítá medián z pole čísel.
 * @param {Array} arr Pole čísel
 * @returns {number} Medián
 */
function getMedian(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Pomocná funkce pro agregaci dat (aby getEmployeeStatistics nebyla dlouhá).
 * @param {Array} employees Seznam zaměstnanců
 * @returns {object} Nasbíraná data
 */
function aggregateData(employees) {
  const data = {
    ages: [],
    workloads: [],
    womenWorkloads: [],
    wlCounts: { 10: 0, 20: 0, 30: 0, 40: 0 }
  };

  for (const emp of employees) {
    const age = getPreciseAge(emp.birthdate);
    data.ages.push(age);
    data.workloads.push(emp.workload);

    if (emp.gender === "female") {
      data.womenWorkloads.push(emp.workload);
    }
    if (data.wlCounts[emp.workload] !== undefined) {
      data.wlCounts[emp.workload]++;
    }
  }
  return data;
}

// --- Exportované funkce ---

/**
 * Hlavní funkce aplikace.
 * @param {object} dtoIn Vstupní data
 * @returns {object} Výsledné statistiky
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

/**
 * Generuje seznam zaměstnanců.
 * @param {object} dtoIn Vstupní parametry
 * @returns {Array} Seznam zaměstnanců
 */
export function generateEmployeeData(dtoIn) {
  const dtoOut = [];
  const { count, age } = dtoIn;

  for (let i = 0; i < count; i++) {
    const gender = Math.random() < 0.5 ? "male" : "female";
    const name = gender === "male" ? getRandomElement(MALE_NAMES) : getRandomElement(FEMALE_NAMES);
    
    // Logika párů příjmení: [0] pro muže, [1] pro ženy
    const surnamePair = getRandomElement(SURNAMES);
    const surname = gender === "male" ? surnamePair[0] : surnamePair[1];

    dtoOut.push({
      gender,
      birthdate: getRandomDate(age.min, age.max),
      name,
      surname,
      workload: getRandomElement(WORKLOADS)
    });
  }
  return dtoOut;
}

/**
 * Počítá statistiky.
 * @param {Array} employees Seznam zaměstnanců
 * @returns {object} Statistiky
 */
export function getEmployeeStatistics(employees) {
  const total = employees.length;
  // Agregace dat v pomocné funkci kvůli limitu řádků
  const d = aggregateData(employees);

  const avgAgeVal = d.ages.reduce((a, b) => a + b, 0) / total;
  const avgWomenWl = d.womenWorkloads.length > 0
    ? d.womenWorkloads.reduce((a, b) => a + b, 0) / d.womenWorkloads.length
    : 0;

  return {
    total,
    workload10: d.wlCounts[10],
    workload20: d.wlCounts[20],
    workload30: d.wlCounts[30],
    workload40: d.wlCounts[40],
    averageAge: total > 0 ? round(avgAgeVal, 1) : 0,
    minAge: Math.floor(Math.min(...d.ages)),
    maxAge: Math.floor(Math.max(...d.ages)),
    medianAge: Math.floor(getMedian(d.ages)),
    medianWorkload: Math.round(getMedian(d.workloads)),
    averageWomenWorkload: round(avgWomenWl, 1),
    sortedByWorkload: [...employees].sort((a, b) => a.workload - b.workload)
  };
}
