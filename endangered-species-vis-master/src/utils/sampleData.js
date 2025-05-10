export const samplePopulationData = [
  { region: 'Central Africa', year: 1995, protectedPopulation: 88977, unprotectedPopulation: 136242 },
  { region: 'Central Africa', year: 1998, protectedPopulation: 34426, unprotectedPopulation: 91082 },
  { region: 'Central Africa', year: 2002, protectedPopulation: 48713, unprotectedPopulation: 147040 },
  { region: 'Central Africa', year: 2007, protectedPopulation: 59319, unprotectedPopulation: 77227 },
  { region: 'Central Africa', year: 2013, protectedPopulation: 55466, unprotectedPopulation: 85045 },
  { region: 'Central Africa', year: 2016, protectedPopulation: 60186, unprotectedPopulation: 65202 },
  
  { region: 'Western Africa', year: 1995, protectedPopulation: 4136, unprotectedPopulation: 10589 },
  { region: 'Western Africa', year: 1998, protectedPopulation: 3133, unprotectedPopulation: 9670 },
  { region: 'Western Africa', year: 2002, protectedPopulation: 6646, unprotectedPopulation: 6537 },
  { region: 'Western Africa', year: 2007, protectedPopulation: 8222, unprotectedPopulation: 4068 },
  { region: 'Western Africa', year: 2013, protectedPopulation: 10526, unprotectedPopulation: 6874 },
  { region: 'Western Africa', year: 2016, protectedPopulation: 11618, unprotectedPopulation: 5770 },

  { region: 'Southern Africa', year: 1995, protectedPopulation: 187219, unprotectedPopulation: 42463 },
  { region: 'Southern Africa', year: 1998, protectedPopulation: 213902, unprotectedPopulation: 22813 },
  { region: 'Southern Africa', year: 2002, protectedPopulation: 270314, unprotectedPopulation: 33606 },
  { region: 'Southern Africa', year: 2007, protectedPopulation: 320904, unprotectedPopulation: 34487 },
  { region: 'Southern Africa', year: 2013, protectedPopulation: 300578, unprotectedPopulation: 51905 },
  { region: 'Southern Africa', year: 2016, protectedPopulation: 293664, unprotectedPopulation: 32107 },

  { region: 'Eastern Africa', year: 1995, protectedPopulation: 107189, unprotectedPopulation: 21084 },
  { region: 'Eastern Africa', year: 1998, protectedPopulation: 106468, unprotectedPopulation: 18711 },
  { region: 'Eastern Africa', year: 2002, protectedPopulation: 135418, unprotectedPopulation: 28249 },
  { region: 'Eastern Africa', year: 2007, protectedPopulation: 166528, unprotectedPopulation: 38667 },
  { region: 'Eastern Africa', year: 2013, protectedPopulation: 100827, unprotectedPopulation: 23405 },
  { region: 'Eastern Africa', year: 2016, protectedPopulation: 86475, unprotectedPopulation: 22524 },
];

export const getTrendData = (region = 'Central Africa'
) => {
  const regionData = samplePopulationData.filter(item => item.region === region);
  const firstYear = regionData[0];
  const lastYear = regionData[regionData.length - 1];
  
  // Calculate percentage changes
  const protectedChange = ((lastYear.protectedPopulation / firstYear.protectedPopulation) - 1) * 100;
  const unprotectedChange = ((lastYear.unprotectedPopulation / firstYear.unprotectedPopulation) - 1) * 100;
  const totalFirstYear = firstYear.protectedPopulation + firstYear.unprotectedPopulation;
  const totalLastYear = lastYear.protectedPopulation + lastYear.unprotectedPopulation;
  const totalChange = ((totalLastYear / totalFirstYear) - 1) * 100;
  
  return {
    currentTotal: totalLastYear,
    totalChange: totalChange > 0 ? `+${totalChange.toFixed(1)}%` : `${totalChange.toFixed(1)}%`,
    protectedChange: protectedChange > 0 ? `+${protectedChange.toFixed(1)}%` : `${protectedChange.toFixed(1)}%`,
    unprotectedChange: unprotectedChange > 0 ? `+${unprotectedChange.toFixed(1)}%` : `${unprotectedChange.toFixed(1)}%`,
    effectivenessRatio: (Math.abs(protectedChange) / Math.abs(unprotectedChange)).toFixed(1)
  };
};