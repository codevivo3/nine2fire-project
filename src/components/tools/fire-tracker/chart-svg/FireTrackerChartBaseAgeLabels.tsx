type FireTrackerChartBaseAgeLabelsProps = {
  startLabel: string;
  endLabel: string;
  hideStartLabel: boolean;
  hideEndLabel: boolean;
  leftPadding: number;
  valueLabelX: number;
  labelCenterY: number;
};

function splitAgeLabel(label: string) {
  const match = label.match(/^(.*?)(\s*\d+)$/);

  if (!match) {
    return { text: label, value: null as string | null };
  }

  return {
    text: match[1],
    value: match[2],
  };
}

export function FireTrackerChartBaseAgeLabels({
  startLabel,
  endLabel,
  hideStartLabel,
  hideEndLabel,
  leftPadding,
  valueLabelX,
  labelCenterY,
}: FireTrackerChartBaseAgeLabelsProps) {
  const start = splitAgeLabel(startLabel);
  const end = splitAgeLabel(endLabel);

  return (
    <>
      {hideStartLabel ? null : (
        <text
          x={leftPadding}
          y={labelCenterY}
          dominantBaseline='middle'
          className='fill-foreground/95 text-[17px] font-bold'
        >
          <tspan>{start.text}</tspan>
          {start.value ? <tspan className='numeric-value'>{start.value}</tspan> : null}
        </text>
      )}
      {hideEndLabel ? null : (
        <text
          x={valueLabelX}
          y={labelCenterY}
          textAnchor='end'
          dominantBaseline='middle'
          className='fill-foreground/95 text-[17px] font-bold'
        >
          <tspan>{end.text}</tspan>
          {end.value ? <tspan className='numeric-value'>{end.value}</tspan> : null}
        </text>
      )}
    </>
  );
}
