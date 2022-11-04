const customFunctions = {
  percent(original, percent) {
    const coefficient = (percent + 100) / 100;
    return original * coefficient;
  },
};

Object.entries(customFunctions).forEach(([functionName, functionBody]) => {
  customFunctions[functionName].transform = functionBody;
});

export { customFunctions };
