export type Week = { id: number; hours: number };
export type PayInputs = {
  hourlyRate: number; overtimeRate: number; weeklyThreshold: number;
  weeks: Week[];
  slipOrdinaryHours: number; slipOrdinaryPay: number;
  slipOvertimeHours: number; slipOvertimePay: number; slipGross: number;
  holidayHours: number; holidayPay: number; bonus: number;
  tolerance: number;
};
export type Check = { label: string; expected: number; actual: number; difference: number; ok: boolean; detail: string };
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export function calculate(input: PayInputs) {
  const validWeeks = input.weeks.map(w => Math.max(0, Number.isFinite(w.hours) ? w.hours : 0));
  const expectedOrdinaryHours = validWeeks.reduce((sum, h) => sum + Math.min(h, input.weeklyThreshold), 0);
  const expectedOvertimeHours = validWeeks.reduce((sum, h) => sum + Math.max(0, h - input.weeklyThreshold), 0);
  const expectedOrdinaryPay = round(expectedOrdinaryHours * input.hourlyRate);
  const expectedOvertimePay = round(expectedOvertimeHours * input.overtimeRate);
  const expectedGross = round(expectedOrdinaryPay + expectedOvertimePay + input.holidayPay + input.bonus);
  const lineItemsGross = round(input.slipOrdinaryPay + input.slipOvertimePay + input.holidayPay + input.bonus);
  const actualGross = round(input.slipGross);
  const tolerance = Math.max(0, input.tolerance);
  const checks: Check[] = [
    { label:'Ordinary hours', expected:round(expectedOrdinaryHours), actual:round(input.slipOrdinaryHours), difference:round(input.slipOrdinaryHours-expectedOrdinaryHours), ok:Math.abs(input.slipOrdinaryHours-expectedOrdinaryHours)<=tolerance, detail:'Hours below the weekly overtime threshold' },
    { label:'Overtime hours', expected:round(expectedOvertimeHours), actual:round(input.slipOvertimeHours), difference:round(input.slipOvertimeHours-expectedOvertimeHours), ok:Math.abs(input.slipOvertimeHours-expectedOvertimeHours)<=tolerance, detail:'Hours above the weekly overtime threshold' },
    { label:'Ordinary pay', expected:expectedOrdinaryPay, actual:round(input.slipOrdinaryPay), difference:round(input.slipOrdinaryPay-expectedOrdinaryPay), ok:Math.abs(input.slipOrdinaryPay-expectedOrdinaryPay)<=tolerance, detail:'Expected ordinary hours × hourly rate' },
    { label:'Overtime pay', expected:expectedOvertimePay, actual:round(input.slipOvertimePay), difference:round(input.slipOvertimePay-expectedOvertimePay), ok:Math.abs(input.slipOvertimePay-expectedOvertimePay)<=tolerance, detail:'Expected overtime hours × overtime hourly rate' },
    { label:'Gross pay', expected:expectedGross, actual:actualGross, difference:round(actualGross-expectedGross), ok:Math.abs(actualGross-expectedGross)<=tolerance, detail:'Expected ordinary + overtime + public holiday + bonus' },
    { label:'Payslip line items', expected:lineItemsGross, actual:actualGross, difference:round(actualGross-lineItemsGross), ok:Math.abs(actualGross-lineItemsGross)<=tolerance, detail:'Sum of payment lines vs gross total printed on payslip' }
  ];
  const workedHours = round(validWeeks.reduce((a,b)=>a+b,0));
  return { expectedOrdinaryHours:round(expectedOrdinaryHours), expectedOvertimeHours:round(expectedOvertimeHours), workedHours, expectedOrdinaryPay, expectedOvertimePay, expectedGross, lineItemsGross, actualGross, checks, passed:checks.every(c=>c.ok) };
}
