// Orchestrator
///////////////////////////////////////////////
const NextBlock = require('@caviar/next-block')
const RoeBlock = require('@caviar/roe-block')

const {Binder} = require('caviar')

const {middleware2Koa} = NextBlock

const NEXT_ROE_BINDER = 'NextRoeBinder'

// Thinking:
// Should Orchestrator and Block extend the same interface?

module.exports = class NextRoeBinder extends Binder {
  constructor (options) {
    super(options)

    this.blocks = {
      next: {
        from: NextBlock,
        // Use default configMap
        // configMap: {
        //   next: 'next'
        //   nextWebpack: 'nextWebpack'
        // },
        phaseMap: {
          build: 'build'
        }
      },
      server: {
        from: RoeBlock,
        // configMap: {
        //   key: 'server'
        // }
      }
    }
  }

  async orchestrate ({
    next,
    server
  }) {
    next.hooks.created.tap(NEXT_ROE_BINDER, nextApp => {
      // next.hooks.created called first
      server.hooks.created.tap(NEXT_ROE_BINDER, roe => {
        roe.next = nextApp
      })
    })

    server.hooks.loaded.tap(NEXT_ROE_BINDER, app => {
      // TODO:
      // middleware and dev middleware
      app.use(middleware2Koa(next.devMiddleware()))
    })
  }
}
