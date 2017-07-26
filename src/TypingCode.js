import React, { Component } from 'react'

import Cursor from './Cursor'
import getRandomGithubFile from './getRandomGithubFile'
import './TypingCode.css'

export default class TypingCode extends Component {
  constructor (props) {
    super(props)
    this.fetchCode = this.fetchCode.bind(this)
    this.doneTyping = this.doneTyping.bind(this)
    this.startTyping = this.startTyping.bind(this)
    this.state = {
      path: 'Untitled-1',
      remaining: '',
      repository: '',
      typed: '',
      url: null
    }
  }

  componentDidMount () {
    this.fetchCode()
  }

  doneTyping () {
    window.setTimeout(this.fetchCode, 3000)
  }

  fetchCode () {
    getRandomGithubFile()
      .then(file => {
        this.setState({
          path: file.path,
          remaining: file.content,
          repository: file.repository,
          typed: '',
          url: file.url
        })
      })
      .then(this.startTyping)
  }

  isDoneTyping () {
    return this.state.remaining.length === 0
  }

  render () {
    return (
      <div className='TypingCode'>
        <h1>
          <a
            className='TypingCode-path'
            href={this.state.url}
            target='_blank'
          >
            <code>
              {this.state.path}
            </code>
          </a>
        </h1>
        <pre
          className='TypingCode-content'
          ref={element => {
            this.container = element
          }}
        >
          <code>
            {this.state.typed}<Cursor />
          </code>
        </pre>
      </div>
    )
  }

  startTyping () {
    let last = null
    const step = now => {
      if (!last) last = now
      const seconds = (now - last) / 1000
      last = now
      if (Math.random() < 10 * seconds) {
        this.type()
      }
      if (this.isDoneTyping()) {
        this.doneTyping()
      } else {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }

  type () {
    const next = this.state.remaining[0]
    this.setState({
      remaining: this.state.remaining.substring(1),
      typed: this.state.typed + next
    })
    if (this.state.typed.endsWith('\n')) {
      this.container.scrollTop = this.container.scrollHeight
    }
  }
}
