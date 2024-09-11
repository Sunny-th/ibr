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
  const [outpatientCopay, setOutpatientCopay] = useState('');
  const [inpatientDeductible, setInpatientDeductible] = useState('');
  const [dental, setDental] = useState(false);
  const [maternity, setMaternity] = useState(false);
  const [optical, setOptical] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState('');
  const [premium, setPremium] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  const calculatePremium = () => {
    let basePremium = 1000; // Example base premium
    let breakdownSteps = [];
    
    // Age adjustment
    const ageAdjustment = basePremium * (parseInt(age) / 100);
    basePremium += ageAdjustment;
    breakdownSteps.push(`Base premium for age ${age}: $${basePremium.toFixed(2)} (including $${ageAdjustment.toFixed(2)} age adjustment)`);
    
    // BMI adjustment
    const bmiValue = parseFloat(bmi);
    let bmiMultiplier = 1;
    if (bmiValue >= 30 && bmiValue < 31) bmiMultiplier = 1.05;
    else if (bmiValue >= 31 && bmiValue < 33) bmiMultiplier = 1.10;
    else if (bmiValue >= 33 && bmiValue < 35) bmiMultiplier = 1.15;
    else if (bmiValue >= 35 && bmiValue < 40) bmiMultiplier = 1.20;
    else if (bmiValue >= 40) bmiMultiplier = 1.25;
    
    const bmiAdjustment = basePremium * (bmiMultiplier - 1);
    basePremium *= bmiMultiplier;
    breakdownSteps.push(`BMI adjustment (${bmi}): $${bmiAdjustment.toFixed(2)} (${((bmiMultiplier - 1) * 100).toFixed(0)}% increase)`);
    
    // Plan adjustment
    const planMultipliers = { 'Emerald': 1, 'Sapphire': 1.1, 'Ruby': 1.2, 'Jade': 1.3, 'Diamond': 1.4 };
    const planMultiplier = planMultipliers[plan] || 1;
    const planAdjustment = basePremium * (planMultiplier - 1);
    basePremium *= planMultiplier;
    breakdownSteps.push(`${plan} plan adjustment: $${planAdjustment.toFixed(2)} (${((planMultiplier - 1) * 100).toFixed(0)}% increase)`);
    
    // Area of cover adjustment
    const areaMultipliers = { 
      'Worldwide Including USA': 1.5, 
      'Worldwide Excluding USA': 1.3, 
      'Asia': 0.88, 
      'Africa, India & Pakistan': 0.85,
      'Africa': 0.80
    };
    const areaMultiplier = areaMultipliers[areaOfCover] || 1;
    const areaAdjustment = basePremium * (areaMultiplier - 1);
    basePremium *= areaMultiplier;
    breakdownSteps.push(`Area of cover (${areaOfCover}) adjustment: $${areaAdjustment.toFixed(2)} (${((areaMultiplier - 1) * 100).toFixed(0)}% ${areaMultiplier < 1 ? 'decrease' : 'increase'})`);
    
    // Outpatient copay adjustment
    const copayDiscounts = { '20% Co-Pay': 0.7, '10% Co Pay': 0.8, 'Nil': 1 };
    const copayMultiplier = copayDiscounts[outpatientCopay] || 1;
    const copayAdjustment = basePremium * (1 - copayMultiplier);
    basePremium *= copayMultiplier;
    breakdownSteps.push(`Outpatient co-pay (${outpatientCopay}) adjustment: -$${copayAdjustment.toFixed(2)} (${((1 - copayMultiplier) * 100).toFixed(0)}% decrease)`);
    
    // Inpatient deductible adjustment
    const deductibleDiscounts = { '$500': 0.89, '$1,000': 0.8, '$2,000': 0.74, '$5,000': 0.65, '$10,000': 0.5 };
    const deductibleMultiplier = deductibleDiscounts[inpatientDeductible] || 1;
    const deductibleAdjustment = basePremium * (1 - deductibleMultiplier);
    basePremium *= deductibleMultiplier;
    breakdownSteps.push(`Inpatient deductible (${inpatientDeductible}) adjustment: -$${deductibleAdjustment.toFixed(2)} (${((1 - deductibleMultiplier) * 100).toFixed(0)}% decrease)`);
    
    // Optional coverages
    if (dental) {
      basePremium += 500;
      breakdownSteps.push('Dental coverage: +$500.00');
    }
    if (maternity) {
      basePremium += 2000;
      breakdownSteps.push('Maternity coverage: +$2000.00');
    }
    if (optical) {
      basePremium += 150;
      breakdownSteps.push('Optical coverage: +$150.00');
    }
    
    // Payment frequency adjustment
    const frequencyMultipliers = { 'Annual': 1, 'Semi-Annual': 1.03, 'Quarterly': 1.05 };
    const frequencyMultiplier = frequencyMultipliers[paymentFrequency] || 1;
    const frequencyAdjustment = basePremium * (frequencyMultiplier - 1);
    basePremium *= frequencyMultiplier;
    breakdownSteps.push(`Payment frequency (${paymentFrequency}) adjustment: $${frequencyAdjustment.toFixed(2)} (${((frequencyMultiplier - 1) * 100).toFixed(0)}% increase)`);
    
    setPremium(basePremium.toFixed(2));
    setBreakdown(breakdownSteps);
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
              {['$500', '$1,000', '$2,000', '$5,000', '$10,000'].map((deductible) => (
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
