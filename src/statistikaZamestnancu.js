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


// --- Pomocné funkce ---

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Seznam pravidel pro přechylování.
 * [koncovka, kolik znaků odebrat, co přidat]
 */
const FEMALE_SURNAME_RULES = [
    ["ý",   1, "á"],   // Veselý -> Veselá
    ["a",   1, "ová"], // Procházka -> Procházková
    ["ek",  2, "ková"],// Jelínek -> Jelínková
    ["ec",  2, "cová"],// Němec -> Němcová
    ["í",   0, ""]    // Krejčí -> Krejčí
];

/**
 * Převede mužské příjmení na ženské podle definovaných pravidel.
 * @param {string} surname - Mužský tvar příjmení.
 * @returns {string} Ženský tvar příjmení.
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
 * Generuje náhodné datum narození v zadaném věkovém rozmezí.
 * Tato verze PŘESNĚ dodržuje věkový interval na milisekundu.
 *
 * @param {number} minAge - Minimální věk (X)
 * @param {number} maxAge - Maximální věk (Y)
 * @returns {string} Datum narození ve formátu ISO (YYYY-MM-DDTHH:mm:ss.sssZ).
 */
function getRandomBirthdate(minAge, maxAge) {
    const now = new Date();

    // 1. Vypočítáme NEJPOZDĚJŠÍ možný čas narození (aby osoba měla alespoň minAge).
    // Příklad: now = 10.11.2025, minAge = 18 -> maxBirthDate = 10.11.2007
    // Osoba narozená v tento přesný okamžik je stará přesně 18.0 let.
    const maxBirthDate = new Date(now);
    maxBirthDate.setFullYear(now.getFullYear() - minAge);

    // 2. Vypočítáme NEJČASNĚJŠÍ možný čas narození (aby osoba neměla více než maxAge).
    // Příklad: now = 10.11.2025, maxAge = 60 -> minBirthDate = 10.11.1965
    // Osoba narozená v tento přesný okamžik je stará přesně 60.0 let.
    const minBirthDate = new Date(now);
    minBirthDate.setFullYear(now.getFullYear() - maxAge);

    // 3. Získáme milisekundové timestampy pro oba hraniční body.
    const minTimestamp = minBirthDate.getTime();
    const maxTimestamp = maxBirthDate.getTime();

    // 4. Vygenerujeme náhodný timestamp PŘESNĚ mezi těmito dvěma body.
    // Tím zajistíme, že věk Z bude vždy splňovat: minAge <= Z <= maxAge
    const randomTimestamp = Math.random() * (maxTimestamp - minTimestamp) + minTimestamp;

    // Převedeme zpět na datum a na požadovaný ISO formát
    const birthdate = new Date(randomTimestamp);
    return birthdate.toISOString();
}

/**
 * Vypočítá věk z data narození (ISO string).
 * @param {string} birthdateString - Datum narození v ISO formátu.
 * @returns {number} Věk v letech.
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
 * Vypočítá medián z pole čísel.
 * @param {Array<number>} numbers - Pole čísel.
 * @returns {number} Medián.
 */
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


// --- Funkce 1: Generování dat ---

/**
 * Generuje seznam zaměstnanců podle zadaných kritérií.
 * @param {object} dtoIn - Vstupní objekt s parametry.
 * @returns {Array<object>} Pole objektů zaměstnanců.
 */
function generateEmployeeData(dtoIn) {
    const employees = [];
    const { count, age } = dtoIn;
    const { min: minAge, max: maxAge } = age;

    for (let i = 0; i < count; i++) {
        const gender = Math.random() < 0.5 ? "male" : "female";
        const name = (gender === "male") ? getRandomElement(MALE_NAMES) : getRandomElement(FEMALE_NAMES);
        const baseSurname = getRandomElement(SURNAMES);
        const surname = (gender === "male") ? baseSurname : getFemaleSurname(baseSurname);

        // Zde se volá nová, přesná funkce
        const birthdate = getRandomBirthdate(minAge, maxAge);

        const workload = getRandomElement(WORKLOADS);

        const employee = {
            gender: gender,
            birthdate: birthdate,
            name: name,
            surname: surname,
            workload: workload
        };

        employees.push(employee);
    }

    return employees;
}


// --- Funkce 2: Výpočet statistik ---

/**
 * Zpracuje seznam zaměstnanců a vrátí objekt se statistikami.
 * @param {Array<object>} employeeList - Pole zaměstnanců.
 * @returns {object} Objekt se statistikami (struktura dtoOut).
 */
function getEmployeeStatistics(employeeList) {
    const total = employeeList.length;

    const allAges = [];
    const allWorkloads = [];
    let womenWorkloadSum = 0;
    let womenCount = 0;
    let totalAgeSum = 0;

    const workloadCounts = { 10: 0, 20: 0, 30: 0, 40: 0 };

    for (const emp of employeeList) {
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

    const sortedAges = [...allAges].sort((a, b) => a - b);
    // Zajištění proti prázdnému poli
    const minAge = sortedAges.length > 0 ? sortedAges[0] : null;
    const maxAge = sortedAges.length > 0 ? sortedAges[sortedAges.length - 1] : null;

    const averageAge = total > 0 ? parseFloat((totalAgeSum / total).toFixed(1)) : 0;
    const medianAge = getMedian(sortedAges);

    const medianWorkload = getMedian(allWorkloads);
    const averageWomenWorkload = womenCount > 0 ? (womenWorkloadSum / womenCount) : null;

    const sortedByWorkload = [...employeeList].sort((a, b) => a.workload - b.workload);

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


// --- Hlavní funkce (podle zadání) ---

/**
 * Hlavní funkce, která orchestruje generování a statistiku.
 * @param {object} dtoIn Vstupní data (count, age range)
 * @returns {object} Objekt se statistikami (dtoOut)
 */
function main(dtoIn) {
    const employeeList = generateEmployeeData(dtoIn);
    const statistics = getEmployeeStatistics(employeeList);
    return statistics;
}


// --- Příklad použití (pro otestování) ---

// Vstupní data (přesně podle zadání)
const dtoIn = {
    count: 50,
    age: {
        min: 19,
        max: 35
    }
};

// Zavolání nové hlavní funkce
const resultingStatistics = main(dtoIn);

// Výpis výsledku do konzole
console.log("Výsledné statistiky (dtoOut):");
console.log(resultingStatistics);