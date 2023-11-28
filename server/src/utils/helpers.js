const exportedMethods = {
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;

    return strVal;
  },
  checkName(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;

    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    if (!/^[a-zA-Z]+$/.test(strVal))
      throw `Error: ${strVal} cannot have numbers or special characters`;
    return strVal;
  },
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },
  checkState(state, varName) {
    const unitedStates = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
    ];
    state = this.checkString(state, varName);
    if (!unitedStates.includes(state.toUpperCase()))
      throw `${varName} not exists in the states`;
    return state;
  },
  checkDOB(dob, varName) {
    dob = this.checkString(dob, varName);
    const parts = dob.split("/");

    // Check if there are exactly 3 parts (MM/DD/YYYY format)
    if (parts.length !== 3) {
      throw "Date must be in MM/DD/YYYY format";
    }

    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Validate month (1 to 12)
    if (month < 1 || month > 12) {
      throw "Month is not valid";
    }
    // Validate year (reasonable range)
    const currentYear = new Date().getFullYear();
    if (year < 1000 || year > currentYear) {
      throw "Year is not valid";
    }
    // Validate day based on month and year
    const maxDaysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > maxDaysInMonth) {
      throw "Day is not valid for the given month and year";
    }
    return dob;
  },
  checkStringArray(arr, varName) {
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    if (arr.length < 1) throw "array must have at least 1";
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },
  checkNumber(num, varName) {
    if (typeof num !== "number") {
      throw `${varName || "provided variable"} is not a number`;
    }

    if (isNaN(num)) {
      throw `${varName || "provided variable"} is NaN`;
    }
    if (num < 0) throw `${varName} can't be lower than 0`;
    return num;
  },
  checkWholeNumber(num, varName) {
    if (typeof num !== "number") {
      throw `${varName || "provided variable"} is not a number`;
    }

    if (isNaN(num)) {
      throw `${varName || "provided variable"} is NaN`;
    }
    if (!Number.isInteger(num))
      throw `${varName || "provided variable"} is not a whole number`;
    if (num < 0) throw `${varName} can't be lower than 0`;
    return num;
  },
};
export default exportedMethods;
