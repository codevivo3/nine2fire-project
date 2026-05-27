export type CoastFireInput = {
  currentAge: number;
  retirementAge: number;
  annualSpending: number;
  currentInvestedAssets: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  withdrawalRate: number;
};

export type CoastFireResult = {
  yearsToRetirement: number;
  realReturn: number;
  fireNumber: number;
  coastFireNumberToday: number;
  projectedPortfolioAtRetirement: number;
  hasReachedCoastFire: boolean;
  progressToCoastFire: number;
  progressToFullFire: number;
};

function assertFiniteNumber(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number`);
  }
}

function validateInput(input: CoastFireInput) {
  assertFiniteNumber(input.currentAge, "currentAge");
  assertFiniteNumber(input.retirementAge, "retirementAge");
  assertFiniteNumber(input.annualSpending, "annualSpending");
  assertFiniteNumber(input.currentInvestedAssets, "currentInvestedAssets");
  assertFiniteNumber(input.monthlyContribution, "monthlyContribution");
  assertFiniteNumber(input.expectedReturn, "expectedReturn");
  assertFiniteNumber(input.inflationRate, "inflationRate");
  assertFiniteNumber(input.withdrawalRate, "withdrawalRate");

  if (input.retirementAge <= input.currentAge) {
    throw new Error("retirementAge must be greater than currentAge");
  }

  if (input.annualSpending <= 0) {
    throw new Error("annualSpending must be greater than 0");
  }

  if (input.withdrawalRate <= 0) {
    throw new Error("withdrawalRate must be greater than 0");
  }

  if (input.currentInvestedAssets < 0) {
    throw new Error("currentInvestedAssets cannot be negative");
  }

  if (input.monthlyContribution < 0) {
    throw new Error("monthlyContribution cannot be negative");
  }
}

export function calculateCoastFire(
  input: CoastFireInput,
): CoastFireResult {
  validateInput(input);

  const yearsToRetirement = input.retirementAge - input.currentAge;
  const realReturn = input.expectedReturn - input.inflationRate;
  const fireNumber = input.annualSpending / input.withdrawalRate;
  const coastFireNumberToday =
    fireNumber / Math.pow(1 + realReturn, yearsToRetirement);

  const monthlyReturn = realReturn / 12;
  const months = yearsToRetirement * 12;
  const growthFactor = Math.pow(1 + monthlyReturn, months);

  const futureValueCurrentAssets =
    input.currentInvestedAssets * growthFactor;

  const futureValueContributions =
    monthlyReturn === 0
      ? input.monthlyContribution * months
      : input.monthlyContribution * ((growthFactor - 1) / monthlyReturn);

  const projectedPortfolioAtRetirement =
    futureValueCurrentAssets + futureValueContributions;

  const hasReachedCoastFire =
    input.currentInvestedAssets >= coastFireNumberToday;

  const progressToCoastFire =
    input.currentInvestedAssets / coastFireNumberToday;

  const progressToFullFire = input.currentInvestedAssets / fireNumber;

  return {
    yearsToRetirement,
    realReturn,
    fireNumber,
    coastFireNumberToday,
    projectedPortfolioAtRetirement,
    hasReachedCoastFire,
    progressToCoastFire,
    progressToFullFire,
  };
}
