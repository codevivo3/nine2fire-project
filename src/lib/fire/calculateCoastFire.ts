export type CoastFireInput = {
  currentAge: number;
  retirementAge: number;
  pensionStartAge: number;
  annualSpending: number;
  annualPensionIncome: number;
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
  pensionActive: boolean;
};

export type CoastFirePlanStatus =
  | "coastAndFireReached"
  | "fireReached"
  | "coastReachedOnly"
  | "notOnTrack";

export const MAX_PROJECTION_AGE = 100;

export type CoastFireResult = {
  currentAge: number;
  retirementAge: number;
  pensionStartAge: number;
  annualPensionIncome: number;
  currentInvestedAssets: number;
  monthlyContribution: number;
  yearsToRetirement: number;
  realReturn: number;
  grossFireNumber: number;
  adjustedFireNumber: number;
  portfolioRequiredIncome: number;
  fireNumber: number;
  yearsToFire: number | null;
  fireAge: number | null;
  projectionEndAge: number;
  coastFireNumberToday: number;
  projectedPortfolioAtRetirement: number;
  hasReachedCoastFire: boolean;
  hasReachedFireToday: boolean;
  hasReachedFireByRetirement: boolean;
  planStatus: CoastFirePlanStatus;
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
  assertFiniteNumber(input.pensionStartAge, "pensionStartAge");
  assertFiniteNumber(input.annualSpending, "annualSpending");
  assertFiniteNumber(input.annualPensionIncome, "annualPensionIncome");
  assertFiniteNumber(input.currentInvestedAssets, "currentInvestedAssets");
  assertFiniteNumber(input.monthlyContribution, "monthlyContribution");
  assertFiniteNumber(input.expectedReturn, "expectedReturn");
  assertFiniteNumber(input.inflationRate, "inflationRate");
  assertFiniteNumber(input.withdrawalRate, "withdrawalRate");

  if (input.retirementAge < input.currentAge) {
    throw new Error("retirementAge must be greater than or equal to currentAge");
  }

  if (input.pensionStartAge < input.currentAge) {
    throw new Error("pensionStartAge must be greater than or equal to currentAge");
  }

  if (input.currentAge > MAX_PROJECTION_AGE) {
    throw new Error(`currentAge must be less than or equal to ${MAX_PROJECTION_AGE}`);
  }

  if (input.retirementAge > MAX_PROJECTION_AGE) {
    throw new Error(`retirementAge must be less than or equal to ${MAX_PROJECTION_AGE}`);
  }

  if (input.pensionStartAge > MAX_PROJECTION_AGE) {
    throw new Error(`pensionStartAge must be less than or equal to ${MAX_PROJECTION_AGE}`);
  }

  if (input.annualSpending <= 0) {
    throw new Error("annualSpending must be greater than 0");
  }

  if (input.annualPensionIncome < 0) {
    throw new Error("annualPensionIncome cannot be negative");
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

function findMonthsToTarget({
  currentInvestedAssets,
  monthlyContribution,
  monthlyReturn,
  fireNumber,
  maxMonths,
}: {
  currentInvestedAssets: number;
  monthlyContribution: number;
  monthlyReturn: number;
  fireNumber: number;
  maxMonths: number;
}) {
  if (currentInvestedAssets >= fireNumber) {
    return 0;
  }

  for (let months = 1; months <= maxMonths; months += 1) {
    const projectedPortfolio = projectPortfolio(
      currentInvestedAssets,
      monthlyContribution,
      monthlyReturn,
      months,
    );

    if (projectedPortfolio >= fireNumber) {
      return months;
    }
  }

  return null;
}

export function calculateCoastFire(
  input: CoastFireInput,
): CoastFireResult {
  validateInput(input);

  const yearsToRetirement = input.retirementAge - input.currentAge;
  const realReturn = input.expectedReturn - input.inflationRate;
  const grossFireNumber = input.annualSpending / input.withdrawalRate;
  const portfolioRequiredIncome = Math.max(
    input.annualSpending - input.annualPensionIncome,
    0,
  );
  const adjustedFireNumber = portfolioRequiredIncome / input.withdrawalRate;
  const fireNumber = adjustedFireNumber;
  const coastFireNumberToday =
    fireNumber / Math.pow(1 + realReturn, yearsToRetirement);

  const monthlyReturn = realReturn / 12;
  const retirementMonths = yearsToRetirement * 12;
  const yearsToMaxProjectionAge = MAX_PROJECTION_AGE - input.currentAge;
  const maxProjectionMonths = yearsToMaxProjectionAge * 12;
  const projectedPortfolioAtRetirement = projectPortfolio(
    input.currentInvestedAssets,
    input.monthlyContribution,
    monthlyReturn,
    retirementMonths,
  );

  const hasReachedCoastFire =
    input.currentInvestedAssets >= coastFireNumberToday;
  const hasReachedFireToday = input.currentInvestedAssets >= fireNumber;
  const hasReachedFireByRetirement =
    projectedPortfolioAtRetirement >= fireNumber;
  const monthsToFire = findMonthsToTarget({
    currentInvestedAssets: input.currentInvestedAssets,
    monthlyContribution: input.monthlyContribution,
    monthlyReturn,
    fireNumber,
    maxMonths: maxProjectionMonths,
  });
  const yearsToFire =
    monthsToFire === null ? null : monthsToFire / 12;
  const fireAge =
    yearsToFire === null ? null : input.currentAge + yearsToFire;
  const projectionEndAge = Math.min(
    MAX_PROJECTION_AGE,
    Math.max(input.retirementAge, Math.ceil(fireAge ?? input.retirementAge)),
  );
  const planStatus: CoastFirePlanStatus =
    hasReachedCoastFire && hasReachedFireByRetirement
      ? "coastAndFireReached"
      : !hasReachedCoastFire && hasReachedFireByRetirement
        ? "fireReached"
        : hasReachedCoastFire && !hasReachedFireByRetirement
          ? "coastReachedOnly"
          : "notOnTrack";

  const progressToCoastFire =
    coastFireNumberToday === 0
      ? 1
      : input.currentInvestedAssets / coastFireNumberToday;

  const progressToFullFire =
    fireNumber === 0 ? 1 : input.currentInvestedAssets / fireNumber;
  const projection: CoastFireProjectionPoint[] = Array.from(
    { length: projectionEndAge - input.currentAge + 1 },
    (_, yearOffset) => {
      const pointMonths = yearOffset * 12;
      const age = input.currentAge + yearOffset;

      return {
        age,
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
        pensionActive:
          input.annualPensionIncome > 0 && age >= input.pensionStartAge,
      };
    },
  );

  return {
    currentAge: input.currentAge,
    retirementAge: input.retirementAge,
    pensionStartAge: input.pensionStartAge,
    annualPensionIncome: input.annualPensionIncome,
    currentInvestedAssets: input.currentInvestedAssets,
    monthlyContribution: input.monthlyContribution,
    yearsToRetirement,
    realReturn,
    grossFireNumber,
    adjustedFireNumber,
    portfolioRequiredIncome,
    fireNumber,
    yearsToFire,
    fireAge,
    projectionEndAge,
    coastFireNumberToday,
    projectedPortfolioAtRetirement,
    hasReachedCoastFire,
    hasReachedFireToday,
    hasReachedFireByRetirement,
    planStatus,
    progressToCoastFire,
    progressToFullFire,
    projection,
  };
}
