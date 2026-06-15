import type { ChartMarkerLine, FireTrackerChartMarkers } from '../fireTrackerChartTypes';
import {
  CHART_PADDING_LEFT,
  CHART_PADDING_RIGHT,
  CHART_PADDING_TOP,
  CHART_WIDTH,
} from './fireTrackerChartConstants';

type BuildFireTrackerChartMarkerLinesParams = {
  markers: FireTrackerChartMarkers;
  xForAge: (age: number) => number;
};

export function buildFireTrackerChartMarkerLines({
  markers,
  xForAge,
}: BuildFireTrackerChartMarkerLinesParams): ChartMarkerLine[] {
  const rightEdgeMarkerThreshold = CHART_WIDTH - CHART_PADDING_RIGHT - 40;
  const retirementMarkerX = xForAge(markers.retirementAge.age);
  const pensionMarkerX = xForAge(markers.pensionStartAge.age);
  const fireMarkerX = markers.fireAge ? xForAge(markers.fireAge.age) : null;
  const markerLabelBaseY = CHART_PADDING_TOP + 22;
  const markerLabelStackedY = CHART_PADDING_TOP + 40;
  const markerLineGap = 10;
  const shouldStackTimelineMarkers = Math.abs(retirementMarkerX - pensionMarkerX) < 80;

  return [
    {
      key: 'retirement',
      age: markers.retirementAge.age,
      label: markers.retirementAge.label,
      x: retirementMarkerX,
      y: markerLabelBaseY,
      lineStartY: markerLabelBaseY + markerLineGap,
      textAnchor: 'middle',
      lineClassName: 'stroke-foreground/64',
      labelClassName: 'fill-foreground/64 text-[13px] font-semibold',
    },
    {
      key: 'pension',
      age: markers.pensionStartAge.age,
      label: markers.pensionStartAge.label,
      x: pensionMarkerX,
      y: shouldStackTimelineMarkers ? markerLabelStackedY : markerLabelBaseY,
      lineStartY:
        (shouldStackTimelineMarkers ? markerLabelStackedY : markerLabelBaseY) + markerLineGap,
      textAnchor: 'middle',
      lineClassName: 'stroke-foreground/42',
      labelClassName: 'fill-foreground/42 text-[13px] font-semibold',
    },
    ...(markers.fireAge
      ? [{
          key: 'fire',
          age: markers.fireAge.age,
          label: markers.fireAge.label,
          x: fireMarkerX ?? CHART_PADDING_LEFT,
          y: CHART_PADDING_TOP + 22,
          textAnchor:
            (fireMarkerX ?? 0) >= rightEdgeMarkerThreshold ? 'end' as const : 'start' as const,
          lineClassName: 'stroke-chart-target/65',
          lineStrokeWidth: 1.5,
          labelClassName: 'fill-chart-target text-[16px] font-bold',
          showLabelBadge: true,
        }]
      : []),
  ];
}
