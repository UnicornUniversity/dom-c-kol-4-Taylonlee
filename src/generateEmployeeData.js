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
  const maxD = new Date(now);
  maxD.setFullYear(now.getFullYear() - minAge);
  const minD = new Date(now);
  minD.setFullYear(now.getFullYear() - maxAge);
  const rt = Math.random() * (maxD.getTime() - minD.getTime()) + minD.getTime();
  return new Date(rt).toISOString();
}

/**
 * Generuje data (logika přesunuta sem).
 * @param {object} dtoIn Vstupní data
 * @returns {Array} Pole zaměstnanců
 */
export function generateData(dtoIn) {
  const dtoOut = [];
  const { count, age } = dtoIn;
  const { min, max } = age;

  for (let i = 0; i < count; i++) {
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
