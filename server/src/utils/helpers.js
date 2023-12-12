const exportedMethods = {

  checkString(strVal, varName) {
    if (!strVal) throw new Error(`You must supply ${varName}!`);
    //check if input is empty
    if (typeof strVal !== 'string') throw new Error(`${varName} must be a string!`);
    //check if input is not a string
    strVal = strVal.trim();
    if (strVal.length === 0)
    //check if input is a string with just spaces
      throw new Error(`${varName} cannot be an empty string or a string with just spaces`);
    return strVal;
  },

  checkName(strVal, varName) {
    strVal = this.checkString(strVal, varName);
    if (!/^[a-zA-Z\s\-']+$/.test(strVal))
    //check if input is invalid
      throw new Error(`${varName} must contain only letters, spaces, hyphens, or apostrophes`);
    return strVal;
  },

  checkId(id, varName) {
    id = this.checkString(id, varName);
    //check if input is invalid
    if (!ObjectId.isValid(id)) throw new Error(`${varName} is an invalid ObjectId`);
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
    //check if state is not listed above
      throw `${state} is not a valid state abbreviation`;
    return state;
  },

  checkDOB(dob, varName) {
    dob = this.checkString(dob, varName);
    const parts = dob.split('/');
    if (parts.length !== 3) throw new Error(`Date in ${varName} must be in MM/DD/YYYY format`);
    //check the format of DOB
    const [month, day, year] = parts.map(part => parseInt(part, 10));
    const currentYear = new Date().getFullYear();
    if (month < 1 || month > 12 || year < 1000 || year > currentYear || isNaN(day))
    //check if DOB is invaild
      throw new Error(`Invalid date in ${varName}`);
    const maxDaysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > maxDaysInMonth) throw new Error(`Day is not valid in ${varName}`);
    //check if the day is invalid
    return dob;
  },

  checkStringArray(arr, varName) {
    if (!Array.isArray(arr)) 
    //check if input is an array
      throw new Error(`${varName} must be an array`);
    if (arr.length === 0) 
    //check if input is empty
      throw new Error(`${varName} must contain at least one element`);

    return arr.map((item, index) => {
      if (typeof item !== 'string' || item.trim().length === 0)
      //check if input is string
        throw new Error(`Element at index ${index} in ${varName} is not a valid string`);
      return item.trim();
    });
  },

  checkNumber(num, varName) {
    if (typeof num !== 'number' || isNaN(num) || num < 0)
    //check if input is a valid number
      throw new Error(`${varName} must be a positive number`);
    return num;
  },

  checkWholeNumber(num, varName) {
    this.checkNumber(num, varName);
    if (!Number.isInteger(num))
    //check if the input is an integer
      throw new Error(`${varName} must be a whole number`);
    return num;
  },
};

export default exportedMethods;
