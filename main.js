// --- Pomocná data ---

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
  ["ý", 1, "á"], ["a", 1, "ová"], ["ek", 2, "ková"], ["ec", 2, "cová"], ["í", 0, ""]
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
  const maxD = new Date(now);
  maxD.setFullYear(now.getFullYear() - minAge);
  const minD = new Date(now);
  minD.setFullYear(now.getFullYear() - maxAge);
  const rt = Math.random() * (maxD.getTime() - minD.getTime()) + minD.getTime();
  return new Date(rt).toISOString();
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
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
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
  const med = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  return Math.round(med);
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
  const { min, max } = dtoIn.age;
  for (let i = 0; i < dtoIn.count; i++) {
    const gender = Math.random() < 0.5 ? "male" : "female";
    const name = gender === "male" ? getRandomElement(MALE_NAMES) : getRandomElement(FEMALE_NAMES);
    const bs = getRandomElement(SURNAMES);
    const surname = gender === "male" ? bs : getFemaleSurname(bs);
    dtoOut.push({
      gender,
      birthdate: getRandomBirthdate(min, max),
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
  const minAge = sortedAges.length > 0 ? sortedAges[0] : null;
  const maxAge = sortedAges.length > 0 ? sortedAges[sortedAges.length - 1] : null;
  const avgAge = total > 0 ? parseFloat((ageSum / total).toFixed(1)) : 0;
  const avgWWl = wCount > 0 ? parseFloat((wWlSum / wCount).toFixed(1)) : 0;

  return {
    total,
    workload10: wlCounts[10], workload20: wlCounts[20],
    workload30: wlCounts[30], workload40: wlCounts[40],
    averageAge: avgAge, minAge, maxAge,
    medianAge: getMedian(sortedAges),
    medianWorkload: getMedian(workloads),
    averageWomenWorkload: avgWWl,
    sortedByWorkload: [...employees].sort((a, b) => a.workload - b.workload)
  };
}
