interface CompletionScoreProps {
  score: number;
  showLabel?: boolean;
}

const CompletionScore = ({ score, showLabel = true }: CompletionScoreProps) => {
  const getColor = () => {
    if (score >= 90) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Completion</span>
          <span className="font-medium">{score}%</span>
        </div>
      )}
      <div className="completion-bar">
        <div
          className={`completion-fill ${getColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default CompletionScore;
