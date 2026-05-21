import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, AlertTriangle, Zap, Code, 
  Shield, Lightbulb, Target, TrendingUp 
} from "lucide-react";

interface CodeAnalysis {
  overallScore: number;
  correctness: { score: number; feedback: string };
  efficiency: { timeComplexity: string; spaceComplexity: string; score: number; feedback: string };
  codeQuality: { score: number; feedback: string; issues: string[] };
  plagiarismCheck: { score: number; isOriginal: boolean; feedback: string };
  improvements: string[];
  personalizedTips: string[];
}

interface CodeAnalysisResultsProps {
  analysis: CodeAnalysis;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

const getScoreBadge = (score: number) => {
  if (score >= 90) return { label: "Excellent", variant: "default" as const, className: "bg-green-500" };
  if (score >= 80) return { label: "Great", variant: "default" as const, className: "bg-green-400" };
  if (score >= 70) return { label: "Good", variant: "default" as const, className: "bg-yellow-500" };
  if (score >= 60) return { label: "Fair", variant: "default" as const, className: "bg-yellow-400" };
  return { label: "Needs Work", variant: "destructive" as const, className: "" };
};

const CodeAnalysisResults = ({ analysis }: CodeAnalysisResultsProps) => {
  const overallBadge = getScoreBadge(analysis.overallScore);

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <Card className="border-2 border-primary/20 tech-glow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Overall Score</h3>
              <p className="text-sm text-muted-foreground">Comprehensive code analysis</p>
            </div>
            <div className="text-right">
              <span className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}
              </span>
              <span className="text-2xl text-muted-foreground">/100</span>
              <Badge className={`ml-2 ${overallBadge.className}`}>
                {overallBadge.label}
              </Badge>
            </div>
          </div>
          <Progress value={analysis.overallScore} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Correctness */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${getScoreColor(analysis.correctness.score)}`} />
              Correctness
              <Badge variant="outline" className="ml-auto">
                {analysis.correctness.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysis.correctness.score} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">{analysis.correctness.feedback}</p>
          </CardContent>
        </Card>

        {/* Efficiency */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className={`h-4 w-4 ${getScoreColor(analysis.efficiency.score)}`} />
              Efficiency
              <Badge variant="outline" className="ml-auto">
                {analysis.efficiency.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysis.efficiency.score} className="h-2 mb-2" />
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                Time: {analysis.efficiency.timeComplexity}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Space: {analysis.efficiency.spaceComplexity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{analysis.efficiency.feedback}</p>
          </CardContent>
        </Card>

        {/* Code Quality */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Code className={`h-4 w-4 ${getScoreColor(analysis.codeQuality.score)}`} />
              Code Quality
              <Badge variant="outline" className="ml-auto">
                {analysis.codeQuality.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysis.codeQuality.score} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground mb-2">{analysis.codeQuality.feedback}</p>
            {analysis.codeQuality.issues.length > 0 && (
              <div className="space-y-1">
                {analysis.codeQuality.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Originality Check */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className={`h-4 w-4 ${analysis.plagiarismCheck.isOriginal ? 'text-green-500' : 'text-yellow-500'}`} />
              Originality
              <Badge 
                variant={analysis.plagiarismCheck.isOriginal ? "default" : "secondary"} 
                className={`ml-auto ${analysis.plagiarismCheck.isOriginal ? 'bg-green-500' : ''}`}
              >
                {analysis.plagiarismCheck.isOriginal ? 'Original' : 'Review'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysis.plagiarismCheck.score} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">{analysis.plagiarismCheck.feedback}</p>
          </CardContent>
        </Card>
      </div>

      {/* Improvements */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Suggested Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.improvements.map((improvement, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Personalized Tips */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-accent-foreground" />
            Personalized Tips for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.personalizedTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-accent-foreground font-bold">{idx + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeAnalysisResults;
