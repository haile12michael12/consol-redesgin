import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guards the brand palette against accidental contrast regressions.
 * Ratios are computed from the tokens in src/styles.css at test time.
 */
// Vitest runs from the package root.
const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8')

function token(name) {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!match) throw new Error(`Token --color-${name} not found`)
  return match[1]
}

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
  const linear = channels.map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

function blendedWhiteAlpha(alphaHex, base) {
  const alpha = parseInt(alphaHex, 16) / 255
  const hex = [1, 3, 5]
    .map((index) => {
      const baseChannel = parseInt(base.slice(index, index + 2), 16)
      return Math.round(255 * alpha + baseChannel * (1 - alpha))
    })
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
  return `#${hex}`
}

describe('WCAG AA contrast for the CONSOL palette', () => {
  const navy = token('navy')
  const paper = token('paper')
  const canvas = token('canvas')
  const ink = token('ink')
  const muted = token('muted')
  const mutedAccessible = token('muted-accessible')
  const goldDeep = token('gold-deep')

  it('body text meets 4.5:1 on both light backgrounds', () => {
    expect(contrast(ink, paper)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(muted, paper)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(mutedAccessible, canvas)).toBeGreaterThanOrEqual(4.5)
  })

  it('navy headings meet 4.5:1 on both light backgrounds', () => {
    expect(contrast(navy, paper)).toBeGreaterThanOrEqual(7)
    expect(contrast(navy, canvas)).toBeGreaterThanOrEqual(7)
  })

  it('gold link and label text meets 4.5:1 on light backgrounds', () => {
    expect(contrast(goldDeep, paper)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(goldDeep, canvas)).toBeGreaterThanOrEqual(4.5)
  })

  it('text on navy surfaces meets 4.5:1 down to white/55', () => {
    ;['CC', 'B3', 'A6', 'A0', '99', '8C'].forEach((step) => {
      const colour = blendedWhiteAlpha(step, navy)
      expect(contrast(colour, navy)).toBeGreaterThanOrEqual(4.5)
    })
    expect(contrast(token('gold'), navy)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps the brand gold usable for large display text on navy', () => {
    expect(contrast(token('gold'), navy)).toBeGreaterThanOrEqual(3)
  })
})
