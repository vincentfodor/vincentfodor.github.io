export const ProgressBar = ({
  value,
  min,
  max,
  low,
  high,
  optimum,
  leftLabel,
  rightLabel,
  ...props
}) => {
  return (
    <div>
      <meter
        value={value}
        min={min}
        max={max}
        low={low}
        high={high}
        optimum={optimum}
        className="w-full"
      />
      <div className="grid grid-cols-[1fr_auto]">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};
