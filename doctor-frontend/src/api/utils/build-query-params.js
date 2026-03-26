function shouldSkipValue(value) {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  return false;
}

export function buildQueryParams(params = {}) {
  return Object.entries(params).reduce((accumulator, [key, value]) => {
    if (shouldSkipValue(value)) {
      return accumulator;
    }

    accumulator[key] = typeof value === "string" ? value.trim() : value;
    return accumulator;
  }, {});
}

