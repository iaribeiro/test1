import { useState } from 'react'
import './App.css'

const QUESTIONS = [
  'Ponto 1',
  'Ponto 2',
  'Ponto 3',
  'Ponto 4',
  'Ponto 5',
  'Ponto 6',
  'Ponto 7',
  'Ponto 8',
]

export default function RiskForm() {
  const [answers, setAnswers] = useState(Array(8).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const allAnswered = answers.every((a) => a !== null)

  function handleChange(index, value) {
    const next = answers.slice()
    // allow clearing selection when value is null
    if (value === null) next[index] = null
    else next[index] = Number(value)
    setAnswers(next)
  }

  function reset() {
    setAnswers(Array(8).fill(null))
    setSubmitted(false)
    setError('')
    setResult(null)
  }

  function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!allAnswered) {
      setError('Por favor avalie todos os critérios antes de prosseguir.')
      return
    }

    const total = answers.reduce((s, v) => s + v, 0)
    let risk
    if (total < 30) risk = 'Risco Moderado (menos de 30)'
    else if (total > 30) risk = 'Risco Elevado (mais de 30)'
    else risk = 'Risco Moderado (30)'

    setResult({ total, risk })
    setSubmitted(true)
  }

  return (
    <div className="risk-form">
      <h1 className="risk-title">Avaliação de Risco</h1>
      <p className="risk-desc">Para calcular o risco, avalie os 8 pontos de 1 a 5.</p>

        <form onSubmit={onSubmit}>
            <div className="risk-grid">
                {QUESTIONS.map((q, i) => (
                    <fieldset key={i} className="risk-fieldset">
                        <legend className="risk-legend">{q}</legend>

                        <div className="risk-options">
                            {[1, 2, 3, 4, 5].map((v) => (
                                <label key={v} className="risk-option">
                                    <input
                                        type="radio"
                                        name={`q${i}`}
                                        value={v}
                                        checked={answers[i] === v}
                                        onChange={(e) => handleChange(i, Number(e.target.value))}
                                        onClick={() => answers[i] === v && handleChange(i, null)}
                                    />
                                    <span className="risk-badge">{v}</span>
                                </label>
                            ))}

                            {/* botão para remover seleção (acessível) */}
                            {answers[i] !== null && (
                                <button
                                    type="button"
                                    className="risk-clear"
                                    onClick={() => handleChange(i, null)}
                                    aria-label={`Limpar resposta ${i + 1}`}
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                    </fieldset>
                ))}
            </div>

            {error && <div className="risk-error">{error}</div>}

            <div className="risk-actions">
                {allAnswered ? (
                    <button type="submit" className="risk-submit">
                        Continuar
                    </button>
                ) : (
                    <div className="risk-wait">
                        Avalie todos os critérios para avançar
                    </div>
                )}

                <button type="button" className="risk-reset" onClick={reset}>
                    Limpar
                </button>
            </div>
        </form>

      {submitted && result && (
        <div className="risk-result">
          <h2>Resultado</h2>
          <p><strong>Total:</strong> {result.total}</p>
          <p>
            <strong>Classificação:</strong>{' '}
            <span className="risk-label" style={{ color: result.total > 30 ? 'crimson' : 'seagreen' }}>{result.risk}</span>
          </p>
        </div>
      )}
    </div>
  )
}
