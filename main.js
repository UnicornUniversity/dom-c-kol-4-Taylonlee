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

// --- Pomocné funkce (privátní pro tento modul) ---

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getFemaleSurname(surname) {
  for (const [suffix, removeCount, addSuffix] of FEMALE_SURNAME_RULES) {
    if (surname.endsWith(suffix)) {
      const base = surname.slice(0, -removeCount || undefined);
      return base + addSuffix;
    }
  }
  return surname + "ová";
}

function getRandomBirthdate(minAge, maxAge) {
  const now = new Date();
  const maxBirthDate = new Date(now);
  maxBirthDate.setFullYear(now.getFullYear() - minAge);

  const minBirthDate = new Date(now);
  minBirthDate.setFullYear(now.getFullYear() - maxAge);

  const minTimestamp = minBirthDate.getTime();
  const maxTimestamp = maxBirthDate.getTime();
  const randomTimestamp = Math.random() * (maxTimestamp - minTimestamp) + minTimestamp;

  const birthdate = new Date(randomTimestamp);
  return birthdate.toISOString();
}

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

function getMedian(numbers) {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  return Math.round(median);
}

// --- Požadovaná struktura ---

//TODO add imports if needed
//TODO doc
/**
 * Hlavní funkce, která generuje náhodný seznam zaměstnanců
 * a následně z nich vypočítá statistiky.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {
  // 1. Vygenerování dat
  const employees = generateEmployeeData(dtoIn);

  // 2. Výpočet statistik
  return getEmployeeStatistics(employees);
}

/**
 * Generuje seznam náhodných zaměstnanců.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
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
 * Vypočítá statistiky ze seznamu zaměstnanců.
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employees) {
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
    workload10: wlCounts[10],
    workload20: wlCounts[20],
    workload30: wlCounts[30],
    workload40: wlCounts[40],
    averageAge: avgAge,
    minAge: sortedAges.length > 0 ? sortedAges[0] : null,
    maxAge: sortedAges.length > 0 ? sortedAges[sortedAges.length - 1] : null,
    medianAge: getMedian(sortedAges),
    medianWorkload: getMedian(workloads),
    averageWomenWorkload: avgWWl,
    sortedByWorkload: [...employees].sort((a, b) => a.workload - b.workload)
  };
}
