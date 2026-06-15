import type { CoastFireResult } from '@/lib/fire';
import { buildFireTrackerResultItems } from '../fireTrackerResultItems';
import type { FireTrackerPlanStatus } from '../fireTrackerTypes';

type FireTrackerTranslationFn = (
  key: string,
  values?: Record<string, string | number>,
) => string;

type BuildFireTrackerResultViewModelParams = {
  result: CoastFireResult;
  t: FireTrackerTranslationFn;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
  formatNumber: (value: number) => string;
  formatEstimate: (value: number) => string;
};

export function buildFireTrackerResultViewModel({
  result,
  t,
  formatCurrency,
  formatPercent,
  formatNumber,
  formatEstimate,
}: BuildFireTrackerResultViewModelParams) {
  return {
    resultItems: buildFireTrackerResultItems({
      result,
      formatCurrency,
      formatPercent,
      formatNumber,
      formatEstimate,
      labels: {
        planStatus: t('beta.results.planStatus'),
        fireNumber: t('beta.results.fireNumber'),
        adjustedFireNumber: t('beta.results.adjustedFireNumber'),
        yearsToFire: t('beta.results.yearsToFire'),
        estimatedFireAge: t('beta.results.estimatedFireAge'),
        pensionStartAge: t('beta.results.pensionStartAge'),
        annualPensionIncome: t('beta.results.annualPensionIncome'),
        coastFireNumberToday: t('beta.results.coastFireNumberToday'),
        projectedPortfolioAtRetirement: t('beta.results.projectedPortfolioAtRetirement'),
        coastFireToday: t('beta.results.coastFireToday'),
        fireByRetirement: t('beta.results.fireByRetirement'),
        progressToCoastFire: t('beta.results.progressToCoastFire'),
        progressToFullFire: t('beta.results.progressToFullFire'),
        yearsToRetirement: t('beta.results.yearsToRetirement'),
        realReturn: t('beta.results.realReturn'),
        yes: t('beta.results.yes'),
        no: t('beta.results.no'),
        alreadyReached: t('beta.results.alreadyReached'),
        notReachedWithinCurrentAssumptions: t(
          'beta.results.notReachedWithinCurrentAssumptions',
        ),
      },
      getStatusLabel: (status) =>
        t(`beta.results.statuses.${status as FireTrackerPlanStatus}`),
    }),
    summaryText: t(`beta.results.summaries.${result.planStatus as FireTrackerPlanStatus}`),
  };
}
