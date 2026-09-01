const rgb = (hex) => {
  const value = hex.replace('#', '')
  return [0, 2, 4].map(index => parseInt(value.slice(index, index + 2), 16) / 255)
}

const luminance = (hex) => {
  const [r, g, b] = rgb(hex).map(channel =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const ratio = (foreground, background) => {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

const checks = [
  ['Claro · texto principal', '#0f172a', '#f8fafc', 4.5],
  ['Claro · texto secundário', '#475569', '#ffffff', 4.5],
  ['Claro · botão primário', '#ffffff', '#005c00', 4.5],
  ['Claro · hover primário', '#ffffff', '#003300', 4.5],
  ['Claro · botão destrutivo', '#ffffff', '#b80000', 4.5],
  ['Claro · texto de erro', '#990000', '#ffffff', 4.5],
  ['Claro · bordo de controlo', '#64748b', '#ffffff', 3],
  ['Claro · foco', '#007000', '#ffffff', 3],

  ['Escuro · texto principal / página', '#f8fafc', '#090e14', 4.5],
  ['Escuro · texto principal / card', '#f8fafc', '#121b25', 4.5],
  ['Escuro · texto secundário / card', '#b8c4d1', '#121b25', 4.5],
  ['Escuro · texto secundário / elevado', '#b8c4d1', '#1a2633', 4.5],
  ['Escuro · botão primário', '#ffffff', '#005c00', 4.5],
  ['Escuro · hover primário', '#ffffff', '#004c00', 4.5],
  ['Escuro · botão destrutivo', '#ffffff', '#b80000', 4.5],
  ['Escuro · acento/link verde', '#9be39b', '#121b25', 4.5],
  ['Escuro · acento/link verde / soft', '#9be39b', '#102b14', 4.5],
  ['Escuro · texto de erro', '#ffaaaa', '#121b25', 4.5],
  ['Escuro · erro / soft', '#ffaaaa', '#321111', 4.5],
  ['Escuro · bordo de controlo / card', '#71839a', '#121b25', 3],
  ['Escuro · bordo de controlo / elevado', '#71839a', '#1a2633', 3],
  ['Escuro · foco / card', '#4fb64f', '#121b25', 3],
  ['Escuro · foco / página', '#4fb64f', '#090e14', 3],
  ['Escuro · cabeçalho tabela', '#ffffff', '#102a16', 4.5],
]

let failed = false
console.log('Contraste do Design System AM Moreira\n')

for (const [label, foreground, background, minimum] of checks) {
  const value = ratio(foreground, background)
  const ok = value >= minimum
  console.log(`${ok ? '✓' : '✗'} ${label}: ${value.toFixed(2)}:1 (mín. ${minimum}:1)`)
  if (!ok) failed = true
}

if (failed) {
  console.error('\nExistem combinações abaixo dos limites definidos.')
  process.exit(1)
}

console.log('\nTodos os pares críticos passam os limites definidos.')
