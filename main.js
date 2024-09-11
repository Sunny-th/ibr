// Insurance Premium Calculation Data
const premiumRates = {
  'Emerald': {
    '0-17': 959, '18-24': 1490, '25-29': 1851, '30-34': 1992, '35-39': 2175,
    '40-44': 2527, '45-49': 2886, '50-54': 3230, '55-59': 4218, '60-64': 5323,
    '65-69': 7127, '70-74': 9321, '75-79': 10954, '80+': 12139
  },
  'Sapphire': {
    '0-17': 1059, '18-24': 1645, '25-29': 2046, '30-34': 2200, '35-39': 2405,
    '40-44': 2793, '45-49': 3189, '50-54': 3569, '55-59': 4662, '60-64': 5883,
    '65-69': 8076, '70-74': 10758, '75-79': 12755, '80+': 14202
  },
  'Ruby': {
    '0-17': 1721, '18-24': 2573, '25-29': 3170, '30-34': 3346, '35-39': 3739,
    '40-44': 4275, '45-49': 4925, '50-54': 5480, '55-59': 6834, '60-64': 8710,
    '65-69': 11646, '70-74': 15519, '75-79': 18342, '80+': 20424
  },
  'Jade': {
    '0-17': 2271, '18-24': 3283, '25-29': 3939, '30-34': 4276, '35-39': 4679,
    '40-44': 5376, '45-49': 5991, '50-54': 6813, '55-59': 8557, '60-64': 11340,
    '65-69': 15164, '70-74': 20109, '75-79': 23659, '80+': 26341
  },
  'Diamond': {
    '0-17': 2493, '18-24': 3604, '25-29': 4325, '30-34': 4693, '35-39': 5136,
    '40-44': 5901, '45-49': 6578, '50-54': 7478, '55-59': 9393, '60-64': 12449,
    '65-69': 16645, '70-74': 22074, '75-79': 25971, '80+': 28917
  }
};

// Function to get the correct age group
const getAgeGroup = (age) => {
  if (age <= 17) return '0-17';
  if (age <= 24) return '18-24';
  if (age <= 29) return '25-29';
  if (age <= 34) return '30-34';
  if (age <= 39) return '35-39';
  if (age <= 44) return '40-44';
  if (age <= 49) return '45-49';
  if (age <= 54) return '50-54';
  if (age <= 59) return '55-59';
  if (age <= 64) return '60-64';
  if (age <= 69) return '65-69';
  if (age <= 74) return '70-74';
  if (age <= 79) return '75-79';
  return '80+';
};

// Function to calculate the premium
const calculatePremium = () => {
  const age = parseInt(document.getElementById("age").value);
  const bmi = parseFloat(document.getElementById("bmi").value);
  const plan = document.getElementById("plan").value;
  const areaOfCover = document.getElementById("areaOfCover").value;
  const outpatientCopay = document.getElementById("outpatientCopay").value;
  const inpatientDeductible = document.getElementById("inpatientDeductible").value;
  const dental = document.getElementById("dental").checked;
  const maternity = document.getElementById("maternity").checked;
  const optical = document.getElementById("optical").checked;
  const paymentFrequency = document.getElementById("paymentFrequency").value;

  let breakdownSteps = [];

  // Get base premium from the rates table
  const ageGroup = getAgeGroup(age);
  const basePremium = premiumRates[plan][ageGroup];
  breakdownSteps.push(`Base premium for ${plan} plan, age ${age} (${ageGroup}): $${basePremium.toFixed(2)}`);

  // Area of cover adjustment
  const areaMultipliers = {
    'Worldwide Including USA': 2.5,
    'Worldwide Excluding USA': 1.0,
    'Asia': 0.88,
    'Africa, India & Pakistan': 0.85,
    'Africa': 0.80
  };
  const areaMultiplier = areaMultipliers[areaOfCover] || 1;
  let adjustedPremium = basePremium * areaMultiplier;
  breakdownSteps.push(`Area of cover (${areaOfCover}) adjustment: ${((areaMultiplier - 1) * 100).toFixed(0)}% ${areaMultiplier < 1 ? 'decrease' : 'increase'}`);

  // BMI adjustment
  let bmiMultiplier = 1;
  if (bmi >= 30 && bmi < 31) bmiMultiplier = 1.05;
  else if (bmi >= 31 && bmi < 33) bmiMultiplier = 1.10;
  else if (bmi >= 33 && bmi < 35) bmiMultiplier = 1.15;
  else if (bmi >= 35 && bmi < 40) bmiMultiplier = 1.20;
  else if (bmi >= 40) bmiMultiplier = 1.25;

  adjustedPremium *= bmiMultiplier;
  if (bmiMultiplier > 1) {
    breakdownSteps.push(`BMI adjustment (${bmi}): ${((bmiMultiplier - 1) * 100).toFixed(0)}% increase`);
  }

  // Outpatient co-pay adjustment
  const copayDiscounts = { '20% Co-Pay': 0.7, '10% Co Pay': 0.8, 'Nil': 1 };
  const copayMultiplier = copayDiscounts[outpatientCopay] || 1;
  adjustedPremium *= copayMultiplier;
  if (copayMultiplier < 1) {
    breakdownSteps.push(`Outpatient co-pay (${outpatientCopay}) adjustment: ${((1 - copayMultiplier) * 100).toFixed(0)}% decrease`);
  }

  // Inpatient deductible adjustment
  const deductibleDiscounts = { 'Nil': 1, '$500': 0.89, '$1,000': 0.8, '$2,000': 0.74, '$5,000': 0.65, '$10,000': 0.5 };
  const deductibleMultiplier = deductibleDiscounts[inpatientDeductible] || 1;
  adjustedPremium *= deductibleMultiplier;
  if (deductibleMultiplier < 1) {
    breakdownSteps.push(`Inpatient deductible (${inpatientDeductible}) adjustment: ${((1 - deductibleMultiplier) * 100).toFixed(0)}% decrease`);
  }

  // Optional coverages
  if (dental) {
    const dentalRate = plan === 'Diamond' ? 1091 : 873;
    adjustedPremium += dentalRate;
    breakdownSteps.push(`Dental coverage: +$${dentalRate.toFixed(2)}`);
  }
  if (maternity) {
    const maternityRate = plan === 'Diamond' ? 2980 : 2672;
    adjustedPremium += maternityRate;
    breakdownSteps.push(`Maternity coverage: +$${maternityRate.toFixed(2)}`);
  }
  if (optical) {
    const opticalRate = plan === 'Diamond' ? 206 : (plan === 'Jade' ? 173 : 138);
    adjustedPremium += opticalRate;
    breakdownSteps.push(`Optical coverage: +$${opticalRate.toFixed(2)}`);
  }

  // Payment frequency adjustment
  const frequencyMultipliers = { 'Annual': 1, 'Semi-Annual': 1.03, 'Quarterly': 1.05 };
  const frequencyMultiplier = frequencyMultipliers[paymentFrequency] || 1;
  adjustedPremium *= frequencyMultiplier;
  if (frequencyMultiplier > 
