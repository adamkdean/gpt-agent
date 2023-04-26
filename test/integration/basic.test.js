// Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import dotenv from 'dotenv'
import { Agent } from '../../src/agent.js'

// Load environment variables
dotenv.config()

// We'll store the paragraphs here
const paragraphs = []

// Create new agent instance, set the goal, and
// add tasks to write some content and finish
const agent = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-3.5-turbo',
  delay: 2500,
  debug: true
})

// Set a basic goal
agent.setGoal('Write 3 paragraphs about the history of the internet')

// Add tasks to write a paragraph and finish
agent.addTask('write_paragraph', (response, next) => {
  console.log('write_paragraph', response)
  paragraphs.push(response)
  next()
})
agent.addTask('finish', () => {
  console.log('Finished:')
  console.log('---------')
  console.log(paragraphs)
})

// Start the agent
agent.start()
