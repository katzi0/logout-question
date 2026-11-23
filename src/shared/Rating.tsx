export function Rating({ value, count }: { value: number; count: number }) {
  const stars = [0, 1, 2, 3, 4].map((i) => Math.max(0, Math.min(1, value - i)));
  return (
    <span className="rating">
      <span className="stars" aria-label={`${value} out of 5 stars`}>
        {stars.map((fill, i) => (
          <span key={i} className="star" style={{ '--fill': fill } as React.CSSProperties} />
        ))}
      </span>
      <span className="rating-count">{count.toLocaleString('en-US')}</span>
    </span>
  );
}
