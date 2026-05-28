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

export type CoastFireProjectionPoint = {
  age: number;
  portfolioWithContributions: number;
  portfolioWithoutContributions: number;
  fireNumber: number;
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
  projection: CoastFireProjectionPoint[];
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

function projectPortfolio(
  currentInvestedAssets: number,
  monthlyContribution: number,
  monthlyReturn: number,
  months: number,
) {
  const growthFactor = Math.pow(1 + monthlyReturn, months);
  const futureValueCurrentAssets = currentInvestedAssets * growthFactor;
  const futureValueContributions =
    monthlyReturn === 0
      ? monthlyContribution * months
      : monthlyContribution * ((growthFactor - 1) / monthlyReturn);

  return futureValueCurrentAssets + futureValueContributions;
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
  const projectedPortfolioAtRetirement = projectPortfolio(
    input.currentInvestedAssets,
    input.monthlyContribution,
    monthlyReturn,
    months,
  );

  const hasReachedCoastFire =
    input.currentInvestedAssets >= coastFireNumberToday;

  const progressToCoastFire =
    input.currentInvestedAssets / coastFireNumberToday;

  const progressToFullFire = input.currentInvestedAssets / fireNumber;
  const projection: CoastFireProjectionPoint[] = Array.from(
    { length: yearsToRetirement + 1 },
    (_, yearOffset) => {
      const pointMonths = yearOffset * 12;

      return {
        age: input.currentAge + yearOffset,
        portfolioWithContributions: projectPortfolio(
          input.currentInvestedAssets,
          input.monthlyContribution,
          monthlyReturn,
          pointMonths,
        ),
        portfolioWithoutContributions: projectPortfolio(
          input.currentInvestedAssets,
          0,
          monthlyReturn,
          pointMonths,
        ),
        fireNumber,
      };
    },
  );

  return {
    yearsToRetirement,
    realReturn,
    fireNumber,
    coastFireNumberToday,
    projectedPortfolioAtRetirement,
    hasReachedCoastFire,
    progressToCoastFire,
    progressToFullFire,
    projection,
  };
}
