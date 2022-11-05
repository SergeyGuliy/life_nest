import { multiply, round } from 'mathjs';

const customFunctions = {
  percent(original, percent) {
    const coefficient = (percent + 100) / 100;
    return round(multiply(original, coefficient), 2);
  },
};

Object.entries(customFunctions).forEach(([functionName, functionBody]) => {
  customFunctions[functionName].transform = functionBody;
});

export { customFunctions };
