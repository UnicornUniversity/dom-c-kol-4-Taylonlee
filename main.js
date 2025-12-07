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
    ["ý",   1, "á"],   // Veselý -> Veselá
    ["a",   1, "ová"], // Procházka -> Procházková
    ["ek",  2, "ková"],// Jelínek -> Jelínková
    ["ec",  2, "cová"],// Němec -> Němcová
    ["í",   0, ""]    // Krejčí -> Krejčí
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

/**
 * Vypočítá celočíselný věk z data narození.
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

function getMedian(numbers) {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}


// --- Exportované funkce (dle šablony) ---

//TODO add imports if needed
// (Žádné externí importy nejsou potřeba)

//TODO doc
/**
 * The main function which calls the application. 
 * Orchestrates the generation of employee data and subsequent calculation of statistics.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {
  // 1. Generate data using the helper function
  const employees = generateEmployeeData(dtoIn);
  
  // 2. Calculate statistics using the helper function
  const dtoOut = getEmployeeStatistics(employees);
  
  return dtoOut;
}

/**
 * Generates a list of random employees based on the input criteria.
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
    
    // Generování data narození (dodržuje interval na ms)
    const birthdate = getRandomBirthdate(minAge, maxAge);
    
    const workload = getRandomElement(WORKLOADS);

    const employee = {
      gender: gender,
      birthdate: birthdate,
      name: name,
      surname: surname,
      workload: workload
    };

    dtoOut.push(employee);
  }

  return dtoOut;
}

/**
 * Calculates detailed statistics from the provided list of employees.
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employees) {
  const total = employees.length;
  
  // Pomocné proměnné pro výpočty
  const allAges = [];
  const allWorkloads = [];
  let womenWorkloadSum = 0;
  let womenCount = 0;
  let totalAgeSum = 0;
  
  const workloadCounts = { 10: 0, 20: 0, 30: 0, 40: 0 };

  // Iterace přes zaměstnance
  for (const emp of employees) {
    const age = getAge(emp.birthdate);
    allAges.push(age);
    totalAgeSum += age;

    allWorkloads.push(emp.workload);
    if (workloadCounts.hasOwnProperty(emp.workload)) {
      workloadCounts[emp.workload]++;
    }

    if (emp.gender === "female") {
      womenWorkloadSum += emp.workload;
      womenCount++;
    }
  }

  // Výpočty finálních hodnot
  const sortedAges = [...allAges].sort((a, b) => a - b);
  const minAge = sortedAges.length > 0 ? sortedAges[0] : null;
  const maxAge = sortedAges.length > 0 ? sortedAges[sortedAges.length - 1] : null;
  
  const averageAge = total > 0 ? parseFloat((totalAgeSum / total).toFixed(1)) : 0;
  const medianAge = getMedian(sortedAges);

  const medianWorkload = getMedian(allWorkloads);
  const averageWomenWorkload = womenCount > 0 ? (womenWorkloadSum / womenCount) : null;

  // Seřazení pole zaměstnanců podle úvazku
  const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

  // Sestavení výstupního objektu
  const dtoOut = {
    total: total,
    workload10: workloadCounts[10],
    workload20: workloadCounts[20],
    workload30: workloadCounts[30],
    workload40: workloadCounts[40],
    averageAge: averageAge,
    minAge: minAge,
    maxAge: maxAge,
    medianAge: medianAge,
    medianWorkload: medianWorkload,
    averageWomenWorkload: averageWomenWorkload,
    sortedByWorkload: sortedByWorkload
  };

  return dtoOut;
}
