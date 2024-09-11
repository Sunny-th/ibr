import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const InsuranceQuoteCalculator = () => {
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState('');
  const [plan, setPlan] = useState('');
  const [areaOfCover, setAreaOfCover] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [outpatientCopay, setOutpatientCopay] = useState('');
  const [inpatientDeductible, setInpatientDeductible] = useState('');
  const [dental, setDental] = useState(false);
  const [maternity, setMaternity] = useState(false);
  const [optical, setOptical] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState('');
  const [premium, setPremium] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

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

  const calculatePremium = () => {
    let breakdownSteps = [];
    
    // Get base premium from the rates table
    const ageGroup = getAgeGroup(parseInt(age));
    const basePremium = premiumRates[plan][ageGroup];
    breakdownSteps.push(`Base premium for ${plan} plan, age ${age} (${ageGroup}): $${basePremium.toFixed(2)}`);
    
    // Area of cover adjustment
    const areaMultipliers = { 
      'Worldwide Including USA': 2.5, 
      'Worldwide Excluding USA': 2.0, 
      'Asia': 0.88, 
      'Africa, India & Pakistan': 0.85,
      'Africa': 0.80
    };
    const areaMultiplier = areaMultipliers[areaOfCover] || 1;
    let adjustedPremium = basePremium * areaMultiplier;
    breakdownSteps.push(`Area of cover (${areaOfCover}) adjustment: ${((areaMultiplier - 1) * 100).toFixed(0)}% ${areaMultiplier < 1 ? 'decrease' : 'increase'}`);
    
    // BMI adjustment
    const bmiValue = parseFloat(bmi);
    let bmiMultiplier = 1;
    if (bmiValue >= 30 && bmiValue < 31) bmiMultiplier = 1.05;
    else if (bmiValue >= 31 && bmiValue < 33) bmiMultiplier = 1.10;
    else if (bmiValue >= 33 && bmiValue < 35) bmiMultiplier = 1.15;
    else if (bmiValue >= 35 && bmiValue < 40) bmiMultiplier = 1.20;
    else if (bmiValue >= 40) bmiMultiplier = 1.25;
    
    adjustedPremium *= bmiMultiplier;
    if (bmiMultiplier > 1) {
      breakdownSteps.push(`BMI adjustment (${bmi}): ${((bmiMultiplier - 1) * 100).toFixed(0)}% increase`);
    }
    
    // Outpatient copay adjustment
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
    if (frequencyMultiplier > 1) {
      breakdownSteps.push(`Payment frequency (${paymentFrequency}) adjustment: ${((frequencyMultiplier - 1) * 100).toFixed(0)}% increase`);
    }
    
    setPremium(adjustedPremium.toFixed(2));
    setBreakdown(breakdownSteps);
  };

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

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Insurance Quote Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
          <Input type="number" placeholder="BMI" value={bmi} onChange={(e) => setBmi(e.target.value)} step="0.1" />
          <Input type="text" placeholder="Country of Residence" value={countryOfResidence} onChange={(e) => setCountryOfResidence(e.target.value)} />
          
          <Select onValueChange={setPlan}>
            <SelectTrigger>
              <SelectValue placeholder="Select Plan" />
            </SelectTrigger>
            <SelectContent>
              {['Emerald', 'Sapphire', 'Ruby', 'Jade', 'Diamond'].map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={setAreaOfCover}>
            <SelectTrigger>
              <SelectValue placeholder="Area of Cover" />
            </SelectTrigger>
            <SelectContent>
              {[
                'Worldwide Including USA', 
                'Worldwide Excluding USA', 
                'Asia', 
                'Africa, India & Pakistan',
                'Africa'
              ].map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={setOutpatientCopay}>
            <SelectTrigger>
              <SelectValue placeholder="Outpatient Co-pay" />
            </SelectTrigger>
            <SelectContent>
              {['Nil', '10% Co Pay', '20% Co-Pay'].map((copay) => (
                <SelectItem key={copay} value={copay}>{copay}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={setInpatientDeductible}>
            <SelectTrigger>
              <SelectValue placeholder="Inpatient Deductible" />
            </SelectTrigger>
            <SelectContent>
              {['Nil', '$500', '$1,000', '$2,000', '$5,000', '$10,000'].map((deductible) => (
                <SelectItem key={deductible} value={deductible}>{deductible}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="dental" checked={dental} onCheckedChange={setDental} />
            <label htmlFor="dental">Dental</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="maternity" checked={maternity} onCheckedChange={setMaternity} />
            <label htmlFor="maternity">Maternity</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="optical" checked={optical} onCheckedChange={setOptical} />
            <label htmlFor="optical">Optical</label>
          </div>
          
          <Select onValueChange={setPaymentFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Frequency" />
            </SelectTrigger>
            <SelectContent>
              {['Annual', 'Semi-Annual', 'Quarterly'].map((freq) => (
                <SelectItem key={freq} value={freq}>{freq}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={calculatePremium}>Calculate Premium</Button>
          
          {premium && (
            <div className="mt-4">
              <strong>Estimated Premium: ${premium}</strong>
              <div className="mt-2">
                <strong>Calculation Breakdown:</strong>
                <ul className="list-disc pl-5 mt-2">
                  {breakdown.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceQuoteCalculator;
