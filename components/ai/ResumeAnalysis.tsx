/* eslint-disable react/no-unescaped-entities */
// components/ai/ResumeAnalysis.tsx
'use client'

import { useState } from 'react'
import { 
  Brain, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Award,
  Lightbulb,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalysisResult {
  score: number
  strengths: string[]
  improvements: string[]
  atsCompatibility: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  sections: {
    summary: { score: number; feedback: string }
    experience: { score: number; feedback: string }
    education: { score: number; feedback: string }
    skills: { score: number; feedback: string }
  }
  keywords: {
    present: string[]
    missing: string[]
  }
}

interface ResumeAnalysisProps {
  resumeId: string
  currentScore?: number | null
  onAnalysisComplete?: (analysis: AnalysisResult) => void
}

export function ResumeAnalysis({ 
  resumeId, 
  currentScore,
  onAnalysisComplete 
}: ResumeAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume')
      }

      setAnalysis(data.analysis)
      onAnalysisComplete?.(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#10b981]'
    if (score >= 60) return 'text-[#f59e0b]'
    return 'text-[#ef4444]'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-[#10b981]/10'
    if (score >= 60) return 'bg-[#f59e0b]/10'
    return 'bg-[#ef4444]/10'
  }

  return (
    <div className="space-y-6">
      {/* Analysis Trigger */}
      {!analysis && (
        <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-linear-to-br from-[#50a3f8] to-[#2fabb8]">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                AI Resume Analysis
              </h3>
              <p className="text-[#9ca3af] mb-4">
                Get detailed insights on your resume's strengths, areas for improvement, 
                and ATS compatibility score.
              </p>
              {currentScore && (
                <div className="mb-4 p-3 rounded-lg bg-[#2a2b2b]">
                  <p className="text-sm text-[#9ca3af] mb-1">Current Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(currentScore)}`}>
                    {currentScore}%
                  </p>
                </div>
              )}
              <Button
                onClick={analyzeResume}
                disabled={isAnalyzing}
                className="bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
              {error && (
                <p className="mt-3 text-sm text-red-400">{error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-linear-to-br from-[#242525] to-[#1a1b1b]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Overall Score</h3>
              <Button
                onClick={analyzeResume}
                variant="outline"
                size="sm"
                className="border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b]"
              >
                Re-analyze
              </Button>
            </div>
            <div className="flex items-center gap-6">
              <div className={`relative w-32 h-32 rounded-full ${getScoreBg(analysis.score)} flex items-center justify-center`}>
                <div className="text-center">
                  <p className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}
                  </p>
                  <p className="text-sm text-[#9ca3af]">/ 100</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#9ca3af]">ATS Compatibility</span>
                    <span className="text-sm font-semibold text-white">
                      {analysis.atsCompatibility.score}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#2a2b2b] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        analysis.atsCompatibility.score >= 80
                          ? 'bg-linear-to-r from-[#10b981] to-[#059669]'
                          : 'bg-linear-to-r from-[#f59e0b] to-[#d97706]'
                      }`}
                      style={{ width: `${analysis.atsCompatibility.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analysis.sections).map(([section, data]) => (
              <div
                key={section}
                className="p-4 rounded-xl border border-[#2a2b2b] bg-[#242525]"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white capitalize">{section}</h4>
                  <span className={`text-lg font-bold ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </span>
                </div>
                <p className="text-sm text-[#9ca3af]">{data.feedback}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#10b981]/10">
                <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                  <span className="text-[#e5e7eb]">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#f59e0b]/10">
                <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                  <span className="text-[#e5e7eb]">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ATS Issues */}
          {analysis.atsCompatibility.issues.length > 0 && (
            <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#ef4444]/10">
                  <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
                </div>
                <h3 className="text-lg font-semibold text-white">ATS Issues</h3>
              </div>
              <ul className="space-y-2 mb-4">
                {analysis.atsCompatibility.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
                    <span className="text-[#e5e7eb]">{issue}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-[#2a2b2b]">
                <h4 className="text-sm font-medium text-white mb-3">Suggestions:</h4>
                <ul className="space-y-2">
                  {analysis.atsCompatibility.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-[#2fabb8] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#9ca3af]">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#10b981]/10">
                  <Award className="w-5 h-5 text-[#10b981]" />
                </div>
                <h3 className="text-lg font-semibold text-white">Keywords Found</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.present.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#f59e0b]/10">
                  <Target className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <h3 className="text-lg font-semibold text-white">Suggested Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.missing.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}