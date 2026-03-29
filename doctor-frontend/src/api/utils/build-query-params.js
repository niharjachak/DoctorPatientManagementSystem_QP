// utility function to build query parameters for API requests by filtering out undefined, 
// null, or empty string values from the input object.
function shouldSkipValue(value) {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  return false;
}

// takes an object of key-value pairs and constructs a new object that only includes entries with valid values,
// trimming string values to remove extra whitespace, which is useful for constructing query parameters for API requests.
export function buildQueryParams(params = {}) {
  //
  return Object.entries(params).reduce((accumulator, [key, value]) => {
    if (shouldSkipValue(value)) {
      return accumulator;
    }

    accumulator[key] = typeof value === "string" ? value.trim() : value;
    return accumulator;
  }, {});
}

