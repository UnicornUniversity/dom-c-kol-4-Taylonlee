// --- Pomocná data (privátní pro tento modul) ---

const MALE_NAMES = [
  "Jan", "Petr", "Pavel", "Tomáš", "Martin", "Jakub", "Lukáš", "David", "Jiří", "Ondřej",
  "Václav", "Marek", "Daniel", "Vojtěch", "Matěj", "Filip", "Adam", "Josef", "Michal", "Radek"
];

const FEMALE_NAMES = [
  "Lucie", "Kateřina", "Petra", "Jana", "Eva", "Veronika", "Lenka", "Hana", "Anna", "Barbora",
  "Tereza", "Martina", "Karolína", "Michaela", "Zuzana", "Kristýna", "Eliška", "Adéla", "Nikola", "Natálie"
];

const SURNAMES = [
  "Novák", "Svoboda", "Dvořák", "Černý", "Procházka", "Kučera", "Veselý", "Horák", "Němec", "Marek",
  "Pospíšil", "Král", "Jelínek", "Růžička", "Beneš", "Fiala", "Sedláček", "Krejčí", "Zeman", "Kolář"
];

const WORKLOADS = [10, 20, 30, 40];

const FEMALE_SURNAME_RULES = [
  ["ý", 1, "á"],
  ["a", 1, "ová"],
  ["ek", 2, "ková"],
  ["ec", 2, "cová"],
  ["í", 0, ""]
];

// --- Pomocné funkce ---

/**
 * Vrátí náhodný prvek z pole.
 * @param {Array} arr Vstupní pole
 * @returns {*} Náhodný prvek
 */
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Převede mužské příjmení na ženské.
 * @param {string} surname Mužské příjmení
 * @returns {string} Ženské příjmení
 */
function getFemaleSurname(surname) {
  for (const [suffix, removeCount, addSuffix] of FEMALE_SURNAME_RULES) {
    if (surname.endsWith(suffix)) {
      const base = surname.slice(0, -removeCount || undefined);
      return base + addSuffix;
    }
  }
  return surname + "ová";
}

/**
 * Generuje náhodné datum narození.
 * @param {number} minAge Minimální věk
 * @param {number} maxAge Maximální věk
 * @returns {string} Datum v ISO formátu
 */
function getRandomBirthdate(minAge, maxAge) {
  const now = new Date();
  const maxBirthDate = new Date(now);
  maxBirthDate.setFullYear(now.getFullYear() - minAge);

  const minBirthDate = new Date(now);
  minBirthDate.setFullYear(now.getFullYear() - maxAge);

  const randomTimestamp = Math.random() * (maxBirthDate.getTime() - minBirthDate.getTime()) + minBirthDate.getTime();
  return new Date(randomTimestamp).toISOString();
}

/**
 * Vypočítá věk z data narození.
 * @param {string} birthdateString Datum narození
 * @returns {number} Věk
 */
function getAge(birthdateString) {
  const birthDate = new Date(birthdateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Vypočítá medián.
 * @param {Array} numbers Pole čísel
 * @returns {number} Medián
 */
function getMedian(numbers) {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  let median;
  if (sorted.length % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }
  return Math.round(median);
}

/**
 * Pomocná funkce pro agregaci dat, aby getEmployeeStatistics nebyla moc dlouhá.
 * @param {Array} employees Seznam zaměstnanců
 * @returns {object} Agregovaná data
 */
function aggregateEmployeeData(employees) {
  const data = {
    allAges: [],
    allWorkloads: [],
    womenWorkloadSum: 0,
    womenCount: 0,
    totalAgeSum: 0,
    workloadCounts: { 10: 0, 20: 0, 30: 0, 40: 0 }
  };

  for (const emp of employees) {
    const age = getAge(emp.birthdate);
    data.allAges.push(age);
    data.totalAgeSum += age;
    data.allWorkloads.push(emp.workload);

    if (data.workloadCounts[emp.workload] !== undefined) {
      data.workloadCounts[emp.workload]++;
    }

    if (emp.gender === "female") {
      data.womenWorkloadSum += emp.workload;
      data.womenCount++;
    }
  }
  return data;
}

// --- Exportované funkce ---

/**
 * Hlavní funkce aplikace.
 * @param {object} dtoIn Vstupní data
 * @returns {object} Výstupní statistiky
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

/**
 * Generuje data zaměstnanců.
 * @param {object} dtoIn Vstupní parametry
 * @returns {Array} Seznam zaměstnanců
 */
export function generateEmployeeData(dtoIn) {
  const dtoOut = [];
  const { count, age } = dtoIn;
  const { min: minAge, max: maxAge } = age;

  for (let i = 0; i < count; i++) {
    const gender = Math.random() < 0.5 ? "male" : "female";
    const name = (gender === "male") ? getRandomElement(MALE_NAMES) : getRandomElement(FEMALE_NAMES);
    const baseSurname = getRandomElement(SURNAMES);
    const surname = (gender === "male") ? baseSurname : getFemaleSurname(baseSurname);
    const birthdate = getRandomBirthdate(minAge, maxAge);
    const workload = getRandomElement(WORKLOADS);

    dtoOut.push({
      gender, birthdate, name, surname, workload
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
  // Použití pomocné funkce pro zkrácení kódu
  const d = aggregateEmployeeData(employees);

  const sortedAges = [...d.allAges].sort((a, b) => a - b);
  const minAge = sortedAges.length > 0 ? sortedAges[0] : null;
  const maxAge = sortedAges.length > 0 ? sortedAges[sortedAges.length - 1] : null;

  const averageAge = total > 0 ? parseFloat((d.totalAgeSum / total).toFixed(1)) : 0;
  const medianAge = getMedian(sortedAges);
  const medianWorkload = getMedian(d.allWorkloads);
  const averageWomenWorkload = d.womenCount > 0 ? parseFloat((d.womenWorkloadSum / d.womenCount).toFixed(1)) : 0;
  const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

  return {
    total,
    workload10: d.workloadCounts[10],
    workload20: d.workloadCounts[20],
    workload30: d.workloadCounts[30],
    workload40: d.workloadCounts[40],
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload
  };
}
