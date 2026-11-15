import { describe, expect, it } from 'vitest';
import { calculate, type PayInputs } from './calculations';
const base: PayInputs = { hourlyRate:10.615, overtimeRate:15.9227, weeklyThreshold:39, weeks:[{id:1,hours:54.4}], slipOrdinaryHours:39, slipOrdinaryPay:413.99, slipOvertimeHours:15.4, slipOvertimePay:245.21, slipGross:659.20, holidayHours:0, holidayPay:0, bonus:0, tolerance:0.02 };
describe('payslip calculations',()=>{
 it('splits overtime per week, not across the whole pay period',()=>{ const r=calculate({...base,weeks:[{id:1,hours:40},{id:2,hours:38}]}); expect(r.expectedOrdinaryHours).toBe(77); expect(r.expectedOvertimeHours).toBe(1); });
 it('includes holiday pay and bonus in gross without counting them as worked hours',()=>{ const r=calculate({...base,weeks:[{id:1,hours:39}],slipOrdinaryHours:39,slipOrdinaryPay:413.99,slipOvertimeHours:0,slipOvertimePay:0,slipGross:518.91,holidayHours:8,holidayPay:84.92,bonus:20}); expect(r.expectedGross).toBe(518.91); expect(r.workedHours).toBe(39); });
 it('flags mismatched pay values',()=>{ expect(calculate({...base,slipOvertimePay:100,slipGross:514.18}).checks.find(c=>c.label==='Overtime pay')?.ok).toBe(false); });
});
