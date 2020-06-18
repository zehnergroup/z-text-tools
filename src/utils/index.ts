import path from "path";
import fs from "fs";
const fsPromises = fs.promises;

/**
 * Compares keys of two objects
 * (a: Object, b: Object) => Boolean
 *
 */
const areKeysEqual = (a = {}, b = {}) => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};

/**
 * Compares 2 arrays of integers
 * returns true if they are equivalent
 *
 * (a: Array, b: Array) => Boolean
 */
const areArraysOfIntsEqual = (a = [], b = []) => {
  a.sort();
  b.sort();

  return JSON.stringify(a) === JSON.stringify(b);
};

const asyncForEach = async (
  arr: Array<any>,
  callback: Function
): Promise<void> => {
  for (let index = 0; index < arr.length; index++) {
    await callback(arr[index], index, arr);
  }
};

const cleanDirectory = async (directory: string) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) reject(err);

      const promises = files.map(
        (file) =>
          new Promise((res, rej) => {
            fs.unlink(path.join(directory, file), (err) => {
              if (err) rej(err);
              res();
            });
          })
      );

      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch((err) => reject(err));
    });
  });
};

/**
 * Creates a file inside provided output directory
 * with provided body and filename
 */
const createFile = async (
  outDirectory: string,
  fileName: string,
  body: String
): Promise<any> =>
  fsPromises
    .mkdir(path.join(__dirname, outDirectory), { recursive: true })
    .then(() =>
      fsPromises.writeFile(path.join(__dirname, outDirectory, fileName), body)
    );

/**
 * Returns mm/dd/yyyy string date values
 * Expects valid numeric values for date provided within single object argument
 *
 * ({yearValue: Number | String, monthValue: Number | String , dayValue: Number | String}) => String || ''
 */
const getDateString = ({
  yearValue,
  monthValue,
  dayValue,
}: {
  yearValue: number;
  monthValue: number | string;
  dayValue: number | string;
}): string => {
  return yearValue && monthValue && dayValue
    ? `${monthValue.toString()}/${dayValue.toString()}/${yearValue.toString()}`
    : "";
};

/**
 * Safely gets a deeply nested property of an object by provided path
 * @see https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
 * (obj: Object) => (path: [String]) => Object || null
 */
const getProperty = (obj: any) => (path: string[]) =>
  path.reduce((xs, x) => (xs && (xs[x] || xs[x] === 0) ? xs[x] : null), obj);

/***
 * (str: string) => string
 */
const handlify = (str: string) => str.toLowerCase().replace(/ /g, "-");

/**
 * Checks whether provided value is a function
 * (functionToCheck: any) => Boolean
 */
const isFunction = (functionToCheck: any): boolean =>
  functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";

/**
 * Concatenates strings from provided array of strings
 * ([String]) => String
 */
const concatStringsFromArray = (arrayOfStrs = [""]): string =>
  arrayOfStrs.reduce(
    (result, curr) => (result.length ? `${result} ${curr}` : curr),
    ""
  );

const delay = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

/**
 * Checks wheter provided value is an object
 * (value: any) => Boolean
 */
const isObject = (value: any): boolean =>
  value && typeof value === "object" && value.constructor === Object;

/**
 * Parses numeric value from provided string
 * Picks digits until non-digit character is encountered
 * (str: String) => Number || null
 */
const parseFirstNumbersFromString = (str = ""): number | null => {
  const regex = /(^\d+)(.+$)/i;

  const match = regex.exec(str);
  // matches are stored in first group by index 1
  if (Array.isArray(match) && match.length > 1) {
    return parseInt(match[1]);
  }
  return null;
};

/**
 * Parses data from local storage by provided key, returns null if parsing fails
 * (key: String) => Any | null
 */
const parseFromLocalStorage = (key: string): any | null => {
  try {
    const item = window.localStorage.getItem(key) || null;
    return item ? JSON.parse(item) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Takes an arbirtrary number of functions,
 * Combines them into a pipeline from left to right
 * @param  {...any} fns
 */
const pipe = (...fns: Function[]) => (x: any) =>
  fns.reduce((acc, func) => func(acc), x);

/**
 * Curried function to split stirng by provided delimeter
 * (delimeter: String) => (str: String) => String
 */
const splitString = (delimeter = "\n") => (str = "") => {
  return typeof str === "string" ? str.split(delimeter) : "";
};

const withProp = (value: any, key: string) => (obj: any): any =>
  value ? { ...obj, [key]: value } : obj;

export {
  areArraysOfIntsEqual,
  areKeysEqual,
  asyncForEach,
  cleanDirectory,
  concatStringsFromArray,
  createFile,
  delay,
  getDateString,
  getProperty,
  handlify,
  isFunction,
  isObject,
  parseFirstNumbersFromString,
  parseFromLocalStorage,
  pipe,
  splitString,
  withProp,
};
