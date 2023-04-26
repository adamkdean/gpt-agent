// Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

export function dedent(strings, ...values) {
  let result = strings[0]
  for (let i = 0; i < values.length; i++) {
    result += values[i] + strings[i + 1]
  }

  // Find the minimum amount of leading spaces for each line (excluding empty lines)
  const minSpaces = result
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .reduce((min, line) => Math.min(min, line.match(/^\s*/)[0].length), Infinity)

  // Remove minSpaces leading spaces from each line and trim each line
  return result
    .split('\n')
    .map((line) => line.slice(minSpaces).trim())
    .join('\n')
    .trim()
}

export function isValidJSON(json) {
  try {
    JSON.parse(json)
  } catch (e) {
    return false
  }
  return true
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
