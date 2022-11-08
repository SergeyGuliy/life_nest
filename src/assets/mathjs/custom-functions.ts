import { multiply, round } from 'mathjs';

const customFunctions = {
  percent(original, percent) {
    const coefficient = (percent + 100) / 100;
    return multiply(original, coefficient);
  },
};

Object.entries(customFunctions).forEach(([functionName, functionBody]) => {
  customFunctions[functionName].transform = functionBody;
});

export { customFunctions };
