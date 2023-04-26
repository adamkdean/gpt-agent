// Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import dotenv from 'dotenv'
import { Agent } from '../../src/agent.js'

// Load environment variables
dotenv.config()

// We'll store the paragraphs here
const paragraphs = []

// Create new agent instance with explicit config
const agent = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-3.5-turbo',
  // delay: 2500,
  debug: true
})

// Set a goal for the agent
agent.setGoal('Write 3 paragraphs about the history of the internet')

// Add a task to the agent to write a paragraph
agent.addTask('write_paragraph', (response, next) => {
  console.log(`Paragraph ${paragraphs.length + 1} of 3 received.`)
  paragraphs.push(response)
  next()
})

// Add a task to the agent to finish (important!)
agent.addTask('finish', () => {
  console.log('Finished!')
  console.log(paragraphs.map((p, i) => `${i + 1}. ${p}`).join('\n'))
})

// Start the agent
agent.start()
