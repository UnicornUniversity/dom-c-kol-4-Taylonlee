// --- Pomocná data ---
const MALE_NAMES = ["Jan", "Petr", "Pavel", "Tomáš", "Martin", "Jakub", "Lukáš", "David", "Jiří", "Ondřej", "Václav", "Marek", "Daniel", "Vojtěch", "Matěj", "Filip", "Adam", "Josef", "Michal", "Radek"];
const FEMALE_NAMES = ["Lucie", "Kateřina", "Petra", "Jana", "Eva", "Veronika", "Lenka", "Hana", "Anna", "Barbora", "Tereza", "Martina", "Karolína", "Michaela", "Zuzana", "Kristýna", "Eliška", "Adéla", "Nikola", "Natálie"];
const SURNAMES = ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka", "Kučera", "Veselý", "Horák", "Němec", "Marek", "Pospíšil", "Král", "Jelínek", "Růžička", "Beneš", "Fiala", "Sedláček", "Krejčí", "Zeman", "Kolář"];
const WORKLOADS = [10, 20, 30, 40];
const FEMALE_SURNAME_RULES = [["ý", 1, "á"], ["a", 1, "ová"], ["ek", 2, "ková"], ["ec", 2, "cová"], ["í", 0, ""]];

// --- Pomocné funkce ---
function getRandomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

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
    // Výpočet na ms přesně
    const maxBirthDate = new Date(now); maxBirthDate.setFullYear(now.getFullYear() - minAge);
    const minBirthDate = new Date(now); minBirthDate.setFullYear(now.getFullYear() - maxAge);
    
    const randomTimestamp = Math.random() * (maxBirthDate.getTime() - minBirthDate.getTime()) + minBirthDate.getTime();
    return new Date(randomTimestamp).toISOString();
}

function getAge(birthdateString) {
    const birthDate = new Date(birthdateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
    return age;
}

function getMedian(numbers) {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// --- EXPORTOVANÉ FUNKCE (PODLE ZADÁNÍ) ---

/**
 * The main function.
 * @param {object} dtoIn { count, age: { min, max } }
 */
export function main(dtoIn) {
  // 1. Vygenerovat data
  const employees = generateEmployeeData(dtoIn);
  
  // 2. Spočítat statistiky
  const statistics = getEmployeeStatistics(employees);
  
  // --- ZDE JE KLÍČOVÝ MOMENT ---
  // Pokud odevzdáváte finální úkol (statistiky), nechte to takto:
  return statistics; 

  // POKUD TESTY SELŽOU S CHYBOU "Expected Array but got Object",
  // zakomentujte řádek výše a odkomentujte tento řádek níže:
  // return employees;
}

/**
 * Generates mocked employee data.
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

    dtoOut.push({ gender, birthdate, name, surname, workload });
  }
  return dtoOut;
}

/**
 * Calculates statistics.
 */
export function getEmployeeStatistics(employees) {
  const total = employees.length;
  const allAges = [];
  const allWorkloads = [];
  let womenWorkloadSum = 0;
  let womenCount = 0;
  let totalAgeSum = 0;
  const workloadCounts = { 10: 0, 20: 0, 30: 0, 40: 0 };

  for (const emp of employees) {
    const age = getAge(emp.birthdate);
    allAges.push(age);
    totalAgeSum += age;
    allWorkloads.push(emp.workload);
    if (workloadCounts[emp.workload] !== undefined) workloadCounts[emp.workload]++;
    if (emp.gender === "female") {
      womenWorkloadSum += emp.workload;
      womenCount++;
    }
  }

  const sortedAges = [...allAges].sort((a, b) => a - b);
  const minAge = sortedAges.length ? sortedAges[0] : null;
  const maxAge = sortedAges.length ? sortedAges[sortedAges.length - 1] : null;
  const averageAge = total > 0 ? parseFloat((totalAgeSum / total).toFixed(1)) : 0;
  const medianAge = getMedian(sortedAges);
  const medianWorkload = getMedian(allWorkloads);
  const averageWomenWorkload = womenCount > 0 ? womenWorkloadSum / womenCount : null;
  const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

  return {
    total,
    workload10: workloadCounts[10],
    workload20: workloadCounts[20],
    workload30: workloadCounts[30],
    workload40: workloadCounts[40],
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload
  };
}
