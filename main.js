import { generateData } from './src/generateEmployeeData.js';
import { getStatistics } from './src/getEmployeeStatistics.js';

/**
 * The main function which calls the application.
 * Orchestrates generation of employees and calculation of their statistics.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {
  // 1. Zavoláme funkci pro generování (ta uvnitř zavolá generateData z src)
  const employees = generateEmployeeData(dtoIn);

  // 2. Zavoláme funkci pro statistiku (ta uvnitř zavolá getStatistics z src)
  const dtoOut = getEmployeeStatistics(employees);

  return dtoOut;
}

/**
 * Generates a list of random employees based on the input criteria.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
  // Tady jen předáme práci do souboru v src
  const dtoOut = generateData(dtoIn);
  return dtoOut;
}

/**
 * Calculates detailed statistics from the provided list of employees.
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employees) {
  // Tady jen předáme práci do souboru v src
  const dtoOut = getStatistics(employees);
  return dtoOut;
}
