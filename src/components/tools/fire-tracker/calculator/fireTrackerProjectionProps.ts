import type { CoastFireResult } from '@/lib/fire';
import type { FireTrackerProjectionChartProps } from '../fireTrackerChartTypes';

type FireTrackerTranslationFn = (
  key: string,
  values?: Record<string, string | number>,
) => string;

type BuildFireTrackerProjectionPropsParams = {
  result: CoastFireResult;
  t: FireTrackerTranslationFn;
  formatCurrency: (value: number) => string;
};

export function buildFireTrackerProjectionProps({
  result,
  t,
  formatCurrency,
}: BuildFireTrackerProjectionPropsParams): FireTrackerProjectionChartProps {
  return {
    title: t('beta.chart.title'),
    startLabel: `${t('beta.chart.age')} ${result.projection[0]?.age ?? ''}`,
    endLabel: `${t('beta.chart.age')} ${
      result.projection[result.projection.length - 1]?.age ?? ''
    }`,
    legend: {
      totalPortfolio: t('beta.chart.legend.totalPortfolio'),
      capitalInvested: t('beta.chart.legend.capitalInvested'),
      currentCapitalGrowth: t('beta.chart.legend.currentCapitalGrowth'),
      fireTarget: t('beta.chart.legend.fireTarget'),
    },
    help: {
      title: t('beta.chart.help.title'),
      items: [
        t('beta.chart.help.items.totalPortfolio'),
        t('beta.chart.help.items.capitalInvested'),
        t('beta.chart.help.items.currentCapitalGrowth'),
        t('beta.chart.help.items.fireTarget'),
        t('beta.chart.help.items.reachesFire'),
      ],
    },
    markers: {
      retirementAge: {
        age: result.retirementAge,
        label: t('beta.chart.markers.retirementAge'),
      },
      pensionStartAge: {
        age: result.pensionStartAge,
        label: t('beta.chart.markers.pensionStartAge'),
      },
      fireAge:
        result.fireAge === null
          ? null
          : {
              age: result.fireAge,
              label: t('beta.chart.markers.fireAge'),
            },
    },
    tooltipLabels: {
      age: t('beta.chart.tooltip.age'),
      portfolio: t('beta.chart.tooltip.portfolio'),
      withoutContributions: t('beta.chart.tooltip.withoutContributions'),
      fireTarget: t('beta.chart.tooltip.fireTarget'),
      gap: t('beta.chart.tooltip.gap'),
      pensionActive: t('beta.chart.tooltip.pensionActive'),
      yes: t('beta.results.yes'),
      no: t('beta.results.no'),
    },
    formatCurrency,
    initialCapital: result.currentInvestedAssets,
    monthlyContribution: result.monthlyContribution,
    points: result.projection,
  };
}
