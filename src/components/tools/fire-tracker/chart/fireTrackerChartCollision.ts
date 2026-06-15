type ChartCollisionRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function getOverlapArea(a: ChartCollisionRect, b: ChartCollisionRect) {
  const overlapWidth = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const overlapHeight = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

  return overlapWidth * overlapHeight;
}

export function doChartRectsOverlap(a: ChartCollisionRect, b: ChartCollisionRect) {
  return getOverlapArea(a, b) > 0;
}

export function getChartRectFromCenter(
  centerX: number,
  centerY: number,
  width: number,
  height: number,
) {
  return {
    left: centerX - width / 2,
    top: centerY - height / 2,
    right: centerX + width / 2,
    bottom: centerY + height / 2,
  };
}

export function expandChartRect(
  rect: ChartCollisionRect,
  {
    x = 0,
    y = 0,
  }: {
    x?: number;
    y?: number;
  } = {},
) {
  return {
    left: rect.left - x,
    top: rect.top - y,
    right: rect.right + x,
    bottom: rect.bottom + y,
  };
}

export function estimateChartTextRect(
  text: string,
  x: number,
  y: number,
  {
    textAnchor = 'start',
    fontSize = 17,
    lineHeight = 26,
    horizontalPadding = 2,
  }: {
    textAnchor?: 'start' | 'middle' | 'end';
    fontSize?: number;
    lineHeight?: number;
    horizontalPadding?: number;
  } = {},
) {
  const estimatedWidth = Math.max(text.length * fontSize * 0.62, fontSize * 2.4);
  const left =
    textAnchor === 'middle'
      ? x - estimatedWidth / 2
      : textAnchor === 'end'
        ? x - estimatedWidth
        : x;

  return {
    left: left - horizontalPadding,
    top: y - lineHeight,
    right: left + estimatedWidth + horizontalPadding,
    bottom: y + 4,
  };
}

export type { ChartCollisionRect };
