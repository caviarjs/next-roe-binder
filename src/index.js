// Orchestrator
///////////////////////////////////////////////
const NextBlock = require('@caviar/next-block')
const RoeBlock = require('@caviar/roe-block')

const {Binder} = require('caviar')

const {middleware2Koa} = NextBlock

// Thinking:
// Should Orchestrator and Block extend the same interface?

module.exports = class NextKoaBinder extends Binder {
  constructor (options) {
    super(options)

    this.blocks = {
      next: {
        from: NextBlock,
        // Use default configMap
        // ```js
        // configMap: {
        //   next: 'next'
        //   nextWebpack: 'nextWebpack'
        // }
        // ```
      },
      server: {
        from: RoeBlock,
        // configMap: {
        //   key: 'server'
        // }
      }
    }
  }

  async _orchestrate ({
    next,
    server
  }, {
    dev
  }) {
    server.hooks.routerLoaded.tap('NextKoaBinder', app => {
      // TODO:
      // middleware and dev middleware
      app.use(middleware2Koa(next.devMiddleware()))
    })
  }
}
