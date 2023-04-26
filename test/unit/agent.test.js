// Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by the GPL-3.0
// license that can be found in the LICENSE file.

import { expect } from 'chai'
import { Agent } from '../../src/agent.js'

describe('Agent', () => {
  describe('addTask()', () => {
    it('should add a task to the agent', () => {
      const agent = new Agent({})
      agent.addTask('test', () => {})
      expect(agent.tasks.size).to.equal(1)
    })
  })

  describe('setGoal()', () => {
    it('should set the goal of the agent', () => {
      const agent = new Agent({})
      agent.setGoal('test')
      expect(agent.goal).to.equal('test')
    })
  })
})
