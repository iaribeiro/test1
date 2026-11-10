import { useState, useEffect, useRef } from 'react'
import './App.css'

const QUESTIONS = [
  {
    title: 'Tipo de posição cirúrgica',
    options: [
      { value: 1, label: 'Dorsal' },
      { value: 2, label: 'Lateral' },
      { value: 3, label: 'Trendelenburg' },
      { value: 4, label: 'Ventral' },
      { value: 5, label: 'Litotomia' },
    ],
  },
  {
    title: 'Tempo de cirurgia',
    options: [
      { value: 1, label: '<1h' },
      { value: 2, label: '1-2h' },
      { value: 3, label: '2-4h' },
      { value: 4, label: '4-6h' },
      { value: 5, label: '>6h' },
    ],
  },
  {
    title: 'Tipo de anestesia',
    options: [
      { value: 1, label: 'Local' },
      { value: 2, label: 'Sedação' },
      { value: 3, label: 'Regional' },
      { value: 4, label: 'Geral' },
      { value: 5, label: 'Geral + Regional' },
    ],
  },
  {
    title: 'Superfícies de apoio',
    options: [
      { value: 1, label: 'Colchão de viscoelástico + coxins de viscoelástico' },
      { value: 2, label: 'Colchão de mesa cirúrgica de espuma (convencional) + almofadas de viscoelástico' },
      { value: 3, label: 'Colchão de mesa cirúrgica de espuma (convencional) + almofadas de espuma' },
      { value: 4, label: 'Colchão de mesa cirúrgica de espuma (convencional) + almofadas feitas com campos de algodão' },
      { value: 5, label: 'Sem superfície de suporte ou utilização de suportes rígidos sem acolchoamento ou perneiras estreitas' },
    ],
  },
  {
    title: 'Posição dos membros',
    options: [
      { value: 1, label: 'Posição anatómica' },
      { value: 2, label: 'Abertura dos membros superiores <90°' },
      { value: 3, label: 'Elevação dos joelhos <90° e abertura dos membros inferiores <90° ou pescoço sem alinhamento mento-esternal' },
      { value: 4, label: 'Elevação dos joelhos >90° ou abertura dos membros inferiores >90°' },
      { value: 5, label: 'Elevação dos joelhos >90° e abertura dos membros inferiores >90° ou abertura dos membros superiores >90°' },
    ],
  },
  {
    title: 'Comorbilidades',
    options: [
      { value: 1, label: 'Sem comorbilidades' },
      { value: 2, label: 'Doença vascular' },
      { value: 3, label: 'Diabetes mellitus' },
      { value: 4, label: 'Desnutrição ou obesidade' },
      { value: 5, label: 'Lesão por pressão prévia, neuropatia diagnosticada ou trombose venosa profunda' },
    ],
  },
  {
    title: 'Idade do doente',
    options: [
      { value: 1, label: '18 a 39 anos' },
      { value: 2, label: '40 a 59 anos' },
      { value: 3, label: '60 a 69 anos' },
      { value: 4, label: '70 a 79 anos' },
      { value: 5, label: 'Mais de 80 anos' },
    ],
  },
]

// Intervenções aplicáveis a todos os doentes (baixo e alto risco)
const COMMON_INTERVENTIONS = [
  'Reavaliar a pele do doente antes do procedimento cirúrgico.',
  'Verificar o alinhamento corporal fisiológico do doente.',
  'Aplicar dispositivos profiláticos nas regiões de proeminências ósseas.',
  'Evitar o contacto da pele com superfícies rígidas.',
  'Limitar a abdução do braço a ≤ 90°, fixando-o em supinação (palma da mão anterior).',
  'Evitar a flexão prolongada do cotovelo > 90°.',
  'Manter a cabeça e o pescoço em posição neutra; evitar a rotação lateral e a hiperextensão prolongada (> 4h).',
  'Limitar a extensão/flexão da articulação coxo-femoral (proteção dos nervos ciático e femoral).',
  'Garantir a fixação dos membros para reduzir o risco de queda.',
  'Proteger e lubrificar os olhos; encerrar as pálpebras com dispositivo adesivo (anestesia geral).',
  'Não posicionar o doente sobre dispositivos implantados superficialmente.',
  'Fixar os dispositivos médicos para reduzir a pressão e a tensão sobre a pele.',
  'Reavaliar os pontos de pressão periodicamente, sobretudo em cirurgias > 2h.',
  'Nas transferências, reduzir a fricção e o cisalhamento com movimento lateral assistido por dispositivo adequado.',
]

// Intervenções adicionais exclusivas de alto risco
// freeText: exige a descrição das intervenções adicionais realizadas
const HIGH_RISK_INTERVENTIONS = [
  { label: 'Comunicar o risco elevado a toda a equipa multidisciplinar.' },
  { label: 'Recurso a pensos profiláticos.' },
  { label: 'Outras.', freeText: true },
]

export default function RiskForm() {
  const [answers, setAnswers] = useState(Array(7).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [checkedItems, setCheckedItems] = useState({})
  const [otherText, setOtherText] = useState('')
  const resultRef = useRef(null)

  const allAnswered = answers.every((a) => a !== null)

  // Auto-scroll para o resultado quando é apresentado
  useEffect(() => {
    if (submitted && result && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [submitted, result])

  function handleChange(index, value) {
    const next = answers.slice()
    if (value === null) next[index] = null
    else next[index] = Number(value)
    setAnswers(next)
  }

  function reset() {
    setAnswers(Array(7).fill(null))
    setSubmitted(false)
    setError('')
    setResult(null)
    setCheckedItems({})
    setOtherText('')
  }

  function toggleItem(key) {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!allAnswered) {
      setError('Por favor responda todos os 7 critérios antes de submeter.')
      return
    }

    const total = answers.reduce((s, v) => s + v, 0)
    let risk
    if (total >= 7 && total <= 19) risk = 'Baixo risco'
    else if (total >= 20 && total <= 35) risk = 'Alto risco'
    else risk = 'Risco não classificado'

    setResult({ total, risk })
    setCheckedItems({})
    setOtherText('')
    setSubmitted(true)
  }

  const isHighRisk = result?.risk === 'Alto risco'
  const checklist = result
    ? [
        ...COMMON_INTERVENTIONS.map((label, i) => ({ key: `c${i}`, label, high: false })),
        ...(isHighRisk
          ? HIGH_RISK_INTERVENTIONS.map((item, i) => ({
              key: `h${i}`,
              label: item.label,
              freeText: !!item.freeText,
              high: true,
            }))
          : []),
      ]
    : []
  // "Outras" só conta como concluída depois de descritas as intervenções realizadas
  const isItemDone = (item) =>
    !!checkedItems[item.key] && (!item.freeText || otherText.trim() !== '')
  const doneCount = checklist.filter(isItemDone).length
  const allDone = checklist.length > 0 && doneCount === checklist.length

  return (
    <div className="risk-form">
      <header className="app-header">
        <img
          className="hcv-logo"
          src="/public/hcv-logotipo-horizontal-236x111.png"
          onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='https://hospitalcruzvermelha.pt/wp-content/uploads/2026/04/hcv-logotipo-horizontal-236x111.png'}}
          alt="Hospital Cruz Vermelha"
        />
      </header>
      <h1 className="risk-title">Avaliação de Risco de Lesão por Pressão em Sala Operatória</h1>
      <p className="risk-desc">Responda aos 7 critérios para avaliar o risco. Pontuação: 7-19 = Baixo risco; 20-35 = Alto risco.</p>

      <form onSubmit={onSubmit}>
        <div className="risk-grid">
          {QUESTIONS.map((q, i) => (
            <fieldset key={i} className="risk-fieldset">
              <legend className="risk-legend">{i + 1}. {q.title}</legend>

              <div className="risk-options-buttons">
                {q.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`risk-option-button ${answers[i] === opt.value ? 'selected' : ''}`}
                    onClick={() => answers[i] === opt.value ? handleChange(i, null) : handleChange(i, opt.value)}
                  >
                    <span className="risk-points">{opt.value}</span>
                    <span className="risk-description">{opt.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        {error && <div className="risk-error">{error}</div>}

        <div className="risk-actions">
          {allAnswered ? (
            <button type="submit" className="risk-submit">Submeter</button>
          ) : (
            <div className="risk-wait">Responda a todos os 7 critérios para continuar</div>
          )}

          <button type="button" className="risk-reset" onClick={reset}>Limpar</button>
        </div>
      </form>

       {submitted && result && (
         <div ref={resultRef} className={`risk-result risk-result-${result.risk === 'Alto risco' ? 'high' : 'low'}`}>
           <div className="risk-result-icon">
             {result.risk === 'Alto risco' ? '⚠️' : '✓'}
           </div>
           <h2>Resultado da Avaliação</h2>
           <div className="risk-result-score">
             <p className="risk-result-label">Pontuação total</p>
             <p className="risk-result-number">{result.total}</p>
             <p className="risk-result-max">de 35 pontos</p>
           </div>
           <div className="risk-result-classification">
             <p className="risk-result-label">Classificação</p>
             <p className={`risk-result-badge ${result.risk === 'Alto risco' ? 'high-risk' : 'low-risk'}`}>
               {result.risk}
             </p>
           </div>

           {checklist.length > 0 && (
             <div className={`risk-interventions ${isHighRisk ? 'high' : 'low'}`}>
               <h3>Checklist de Intervenções</h3>
               <p className="risk-checklist-hint">
                 Marque cada intervenção à medida que a realiza na sala operatória.
               </p>

               <div className="risk-checklist-progress">
                 <div className="risk-checklist-bar">
                   <div
                     className="risk-checklist-bar-fill"
                     style={{ width: `${(doneCount / checklist.length) * 100}%` }}
                   />
                 </div>
                 <span className="risk-checklist-count">
                   {doneCount} de {checklist.length} concluídas
                 </span>
               </div>

               <ul className="risk-checklist">
                 {checklist.map((item) => (
                   <li key={item.key}>
                     <button
                       type="button"
                       className={`risk-checklist-item ${isItemDone(item) ? 'checked' : ''} ${item.high ? 'high-only' : ''}`}
                       aria-pressed={!!checkedItems[item.key]}
                       onClick={() => toggleItem(item.key)}
                     >
                       <span className="risk-checklist-box" aria-hidden="true">
                         {isItemDone(item) ? '✓' : ''}
                       </span>
                       <span className="risk-checklist-label">
                         {item.high && <span className="risk-checklist-tag">Alto risco</span>}
                         {item.label}
                       </span>
                     </button>

                     {item.freeText && checkedItems[item.key] && (
                       <div className="risk-checklist-other">
                         <label htmlFor="outras-intervencoes">
                           Indique as intervenções adicionais realizadas
                         </label>
                         <textarea
                           id="outras-intervencoes"
                           className="risk-checklist-textarea"
                           rows={3}
                           value={otherText}
                           placeholder="Descreva aqui as intervenções adicionais…"
                           onChange={(e) => setOtherText(e.target.value)}
                         />
                         {otherText.trim() === '' && (
                           <p className="risk-checklist-other-warning">
                             Descreva as intervenções para concluir este item.
                           </p>
                         )}
                       </div>
                     )}
                   </li>
                 ))}
               </ul>

               {allDone && (
                 <div className="risk-checklist-done">
                   ✓ Todas as intervenções foram realizadas.
                 </div>
               )}
             </div>
           )}
         </div>
       )}
    </div>
  )
}
