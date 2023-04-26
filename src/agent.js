// Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { BasicChatAPI } from './chatapi.js'
import { dedent, isValidJSON, sleep } from './utils.js'

export class Agent {
  constructor(config) {
    this.config = config
    this.api = new BasicChatAPI(config.apiKey, config.model)
    this.context = []
    this.tasks = new Map()
    this.usage = {
      prompt: 0,
      completion: 0,
      total: 0
    }
  }

  setGoal(goal) {
    this.goal = goal
  }

  addTask(task, callback) {
    this.tasks.set(task, callback)
  }

  async start() {
    if (!this.goal) throw new Error('Goal not set')
    if (this.tasks.size === 0) throw new Error('No tasks added')

    const initialPrompt = this.generateInitialPrompt()
    const message = this.api.createSystemMessage(initialPrompt)
    this.continue(message)
  }

  async continue(message) {
    this.context.push(message)
    console.log('generating completion with context', this.context)
    const response = await this.api.generateCompletion(this.context)
    if (this.config.delay) {
      console.log(`Delaying for ${this.config.delay}ms`)
      await sleep(this.config.delay)
    }
    await this.parseResponse(response)
  }

  generateInitialPrompt() {
    return dedent`
      You are an autonomous agent. You have an overarching goal and can perform a finite number of tasks.
      Deviation from your goal or tasks will result in termination.\n
      Your goal is: ${this.goal}.\n
      You can perform the following tasks:
      ${[...this.tasks.keys()].map((task) => `* ${task}`).join('\n')}\n
      You should respond in JSON with the following format:
      {"task": "task name","response": "response to task"}\n
      Please respond with your first task.
    `
  }

  async parseResponse(response) {
    console.log('parseResponse', response)

    const { content, tokens } = response

    // Record token usage
    this.usage.prompt += tokens.prompt_tokens
    this.usage.completion += tokens.completion_tokens
    this.usage.total += tokens.total_tokens

    // Push response to context
    this.context.push(this.api.createAssistantMessage(content))

    // Ensure response is valid JSON
    if (!isValidJSON(content)) {
      return this.onInvalidResponse('Invalid JSON: Could not parse response')
    }

    // Ensure response is in the correct format
    const responseObj = JSON.parse(content)
    if (!responseObj.task || !responseObj.response) {
      return this.onInvalidResponse('Invalid JSON: Missing task or response property')
    }

    // Ensure task is valid
    if (!this.tasks.has(responseObj.task)) {
      return this.onInvalidResponse(`Invalid task: ${responseObj.task}`)
    }

    // Run task
    const task = this.tasks.get(responseObj.task)
    await task(responseObj.response, (nextPrompt) => {
      const message = this.api.createUserMessage(nextPrompt || 'Please continue')
      this.continue(message)
    })
  }

  async onInvalidResponse(error) {
    const prompt = `System Error: invalid response. Message: ${error}. Please try again.`
    const message = this.api.createUserMessage(prompt)
    await this.continue(message)
  }
}
