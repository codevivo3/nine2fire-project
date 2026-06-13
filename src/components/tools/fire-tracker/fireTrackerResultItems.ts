/**
 * FILE: src/components/tools/fire-tracker/fireTrackerResultItems.ts
 *
 * PURPOSE:
 * - Builds localized FIRE Tracker result cards from the normalized calculator output
 */
import type { CoastFireResult } from '@/lib/fire';
import type { FireTrackerPlanStatus, ResultItem } from './fireTrackerTypes';

type BuildFireTrackerResultItemsParams = {
  result: CoastFireResult;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
  formatNumber: (value: number) => string;
  formatEstimate: (value: number) => string;
  labels: {
    planStatus: string;
    fireNumber: string;
    adjustedFireNumber: string;
    yearsToFire: string;
    estimatedFireAge: string;
    pensionStartAge: string;
    annualPensionIncome: string;
    coastFireNumberToday: string;
    projectedPortfolioAtRetirement: string;
    coastFireToday: string;
    fireByRetirement: string;
    progressToCoastFire: string;
    progressToFullFire: string;
    yearsToRetirement: string;
    realReturn: string;
    yes: string;
    no: string;
    alreadyReached: string;
    notReachedWithinCurrentAssumptions: string;
  };
  getStatusLabel: (status: FireTrackerPlanStatus) => string;
};

export function buildFireTrackerResultItems({
  result,
  formatCurrency,
  formatPercent,
  formatNumber,
  formatEstimate,
  labels,
  getStatusLabel,
}: BuildFireTrackerResultItemsParams): ResultItem[] {
  const yearsToFireValue = result.hasReachedFireToday
    ? labels.alreadyReached
    : result.yearsToFire === null
      ? labels.notReachedWithinCurrentAssumptions
      : formatEstimate(result.yearsToFire);
  const fireAgeValue = result.hasReachedFireToday
    ? labels.alreadyReached
    : result.fireAge === null
      ? labels.notReachedWithinCurrentAssumptions
      : formatEstimate(result.fireAge);

  return [
    {
      key: 'planStatus',
      label: labels.planStatus,
      value: getStatusLabel(result.planStatus),
      tone:
        result.planStatus === 'coastAndFireReached' || result.planStatus === 'fireReached'
          ? 'positive'
          : 'warning',
    },
    {
      key: 'fireNumber',
      label: labels.fireNumber,
      value: formatCurrency(result.grossFireNumber),
    },
    {
      key: 'adjustedFireNumber',
      label: labels.adjustedFireNumber,
      value: formatCurrency(result.adjustedFireNumber),
    },
    {
      key: 'yearsToFire',
      label: labels.yearsToFire,
      value: yearsToFireValue,
    },
    {
      key: 'estimatedFireAge',
      label: labels.estimatedFireAge,
      value: fireAgeValue,
    },
    {
      key: 'pensionStartAge',
      label: labels.pensionStartAge,
      value: formatNumber(result.pensionStartAge),
    },
    {
      key: 'coastFireToday',
      label: labels.coastFireToday,
      value: result.hasReachedCoastFire ? labels.yes : labels.no,
      tone: result.hasReachedCoastFire ? 'positive' : 'warning',
    },
    {
      key: 'fireByRetirement',
      label: labels.fireByRetirement,
      value: result.hasReachedFireByRetirement ? labels.yes : labels.no,
      tone: result.hasReachedFireByRetirement ? 'positive' : 'warning',
    },
    {
      key: 'yearsToRetirement',
      label: labels.yearsToRetirement,
      value: formatNumber(result.yearsToRetirement),
    },
    {
      key: 'coastFireNumberToday',
      label: labels.coastFireNumberToday,
      value: formatCurrency(result.coastFireNumberToday),
    },
    {
      key: 'projectedPortfolioAtRetirement',
      label: labels.projectedPortfolioAtRetirement,
      value: formatCurrency(result.projectedPortfolioAtRetirement),
    },
    {
      key: 'annualPensionIncome',
      label: labels.annualPensionIncome,
      value: formatCurrency(result.annualPensionIncome),
    },
    {
      key: 'progressToCoastFire',
      label: labels.progressToCoastFire,
      value: formatPercent(result.progressToCoastFire),
      progressPercent: Math.max(0, Math.min(result.progressToCoastFire * 100, 100)),
    },
    {
      key: 'progressToFullFire',
      label: labels.progressToFullFire,
      value: formatPercent(result.progressToFullFire),
      progressPercent: Math.max(0, Math.min(result.progressToFullFire * 100, 100)),
    },
    {
      key: 'realReturn',
      label: labels.realReturn,
      value: formatPercent(result.realReturn),
    },
  ];
}
