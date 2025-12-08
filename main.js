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

// --- Požadovaná struktura ---

//TODO add imports if needed
//TODO doc
/**
 * Hlavní funkce, která generuje náhodný seznam zaměstnanců
 * na základě zadaného počtu a věkového rozmezí.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function main(dtoIn) {
    //TODO code
    const dtoOut = [];
    const { count, age } = dtoIn;
    const { min: minAge, max: maxAge } = age;

    for (let i = 0; i < count; i++) {
        // 1. Generování pohlaví
        const gender = Math.random() < 0.5 ? "male" : "female";

        // 2. Generování jména a příjmení podle pohlaví
        const name = (gender === "male") ? getRandomElement(MALE_NAMES) : getRandomElement(FEMALE_NAMES);
        const baseSurname = getRandomElement(SURNAMES);
        const surname = (gender === "male") ? baseSurname : getFemaleSurname(baseSurname);

        // 3. Generování data narození (v ISO formátu)
        const birthdate = getRandomBirthdate(minAge, maxAge);

        // 4. Generování úvazku
        const workload = getRandomElement(WORKLOADS);

        // 5. Sestavení objektu zaměstnance
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
