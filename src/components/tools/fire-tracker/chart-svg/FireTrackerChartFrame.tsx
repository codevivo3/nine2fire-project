type FireTrackerChartFrameProps = {
  plotEndX: number;
  chartBaselineY: number;
  initialCapitalY: number;
  fireTargetY: number;
  fireTargetLabel: string;
  fireTargetValue: number;
  formatCurrency: (value: number) => string;
  leftPadding: number;
};

export function FireTrackerChartFrame({
  plotEndX,
  chartBaselineY,
  initialCapitalY,
  fireTargetY,
  fireTargetLabel,
  fireTargetValue,
  formatCurrency,
  leftPadding,
}: FireTrackerChartFrameProps) {
  return (
    <>
      <line
        x1={leftPadding}
        y1={initialCapitalY}
        x2={plotEndX}
        y2={initialCapitalY}
        className='stroke-border-token/90'
        strokeWidth='1'
        strokeDasharray='3 7'
      />
      <line
        x1={leftPadding}
        y1={chartBaselineY}
        x2={plotEndX}
        y2={chartBaselineY}
        className='stroke-border-token/80'
        strokeWidth='1'
      />
      <line
        x1={leftPadding}
        y1={fireTargetY}
        x2={plotEndX}
        y2={fireTargetY}
        className='stroke-chart-target'
        strokeWidth='2'
        strokeDasharray='5 5'
      />
      <text
        x={leftPadding + 8}
        y={fireTargetY - 10}
        className='fill-chart-target text-[18px] font-extrabold'
        paintOrder='stroke'
        stroke='rgba(0,0,0,0.50)'
        strokeWidth='0.5'
      >
        <tspan>{`${fireTargetLabel}: `}</tspan>
        <tspan className='numeric-value'>{formatCurrency(fireTargetValue)}</tspan>
      </text>
    </>
  );
}
