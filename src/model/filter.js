const filterNames = [
  `all`, `overdue`, `today`, `favorites`, `repeating`, `archive`
];

export const generateFilters = () => {
  return (
    filterNames.map((it) => {
      return {
        name: it,
        count: Math.floor(Math.random() * 10),
      };
    })
  );
};
