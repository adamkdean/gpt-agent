# gpt-agent

Simple task management library, leveraging GPT capabilities while abstracting away natural language complexities

## Getting Started

Install the module with: `npm install gpt-agent`

### Basic Usage

```javascript
import { Agent } from 'gpt-agent'

// We'll store the paragraphs here
const paragraphs = []

// Create new agent instance, passing in your OpenAI API key
const agent = new Agent({
  apiKey: process.env.OPENAI_API_KEY
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
```

Output:

```
Paragraph 1 of 3 received.
Paragraph 2 of 3 received.
Paragraph 3 of 3 received.
Finished!
1. The history of the internet dates back to the 1960s when the U.S. Department of Defense initiated a research project called the ARPANET. It was developed as a communication system that would be resistant to a nuclear attack, and consisted of a collection of computers communicating with one another using a protocol called NCP.
2. Over the next few decades, the ARPANET grew in popularity, and in the 1980s, a new protocol called TCP/IP was developed which allowed multiple networks to be interconnected. This paved the way for the birth of the internet as we know it today. In 1983, the ARPANET switched over to using TCP/IP, and the term 'internet' was first used shortly thereafter.
3. Throughout the 1990s, the internet exploded in popularity, and many companies began offering internet services to the general public. This led to the development of the World Wide Web, which was introduced in 1991 by computer scientist Sir Tim Berners-Lee. The World Wide Web allowed for easy access to information via hyperlinks and made the internet much more user-friendly. Today, the internet is an essential tool for communication, commerce, and entertainment, and it continues to evolve and expand every day.
```

### Configuration

The `Agent` constructor takes an optional configuration object with the following properties:

* `apiKey` - Your OpenAI API key. If not provided, an error will be thrown.
* `model` - The GPT-3 model to use. Defaults to `gpt-3.5-turbo`.
* `delay` - The delay between requests to the OpenAI API, in milliseconds. Defaults to `0`.
* `debug` - Whether to log debug information to the console. Defaults to `false`.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
