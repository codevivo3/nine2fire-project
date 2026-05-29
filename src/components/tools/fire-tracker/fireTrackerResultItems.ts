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
  labels: {
    planStatus: string;
    fireNumber: string;
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
  };
  getStatusLabel: (status: FireTrackerPlanStatus) => string;
};

export function buildFireTrackerResultItems({
  result,
  formatCurrency,
  formatPercent,
  formatNumber,
  labels,
  getStatusLabel,
}: BuildFireTrackerResultItemsParams): ResultItem[] {
  return [
    {
      label: labels.planStatus,
      value: getStatusLabel(result.planStatus),
    },
    {
      label: labels.fireNumber,
      value: formatCurrency(result.fireNumber),
    },
    {
      label: labels.coastFireNumberToday,
      value: formatCurrency(result.coastFireNumberToday),
    },
    {
      label: labels.projectedPortfolioAtRetirement,
      value: formatCurrency(result.projectedPortfolioAtRetirement),
    },
    {
      label: labels.coastFireToday,
      value: result.hasReachedCoastFire ? labels.yes : labels.no,
    },
    {
      label: labels.fireByRetirement,
      value: result.hasReachedFireByRetirement ? labels.yes : labels.no,
    },
    {
      label: labels.progressToCoastFire,
      value: formatPercent(result.progressToCoastFire),
    },
    {
      label: labels.progressToFullFire,
      value: formatPercent(result.progressToFullFire),
    },
    {
      label: labels.yearsToRetirement,
      value: formatNumber(result.yearsToRetirement),
    },
    {
      label: labels.realReturn,
      value: formatPercent(result.realReturn),
    },
  ];
}
