const chai = require('chai')
const path = require('path')
const chaiAsPromised = require('chai-as-promised')
const Pact = require('@pact-foundation/pact').Pact
const { somethingLike: like, term } = require('@pact-foundation/pact').Matchers
const expect = chai.expect
const API_PORT = process.env.API_PORT || 9123
const { fetchProviderData } = require('../client')
chai.use(chaiAsPromised)

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN'

const provider = new Pact({
  consumer: 'Updates Consumer',
  provider: 'Updates Provider',
  port: API_PORT,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: LOG_LEVEL,
  spec: 2,
})

const EXPECTED_RESPONSE = {
    count: like(5),
    userId: like('53474fgrbvc564w4554'),
    error: null,
    updates: [
      {id: like(1), text: like('Update one'), canShareDirect: like(true)},
    ]
  }

describe('Pact with Updates Provider', () => {
  describe('given data count > 0', () => {
    describe('when a call to the Provider is made', () => {
      before(() => {
        return provider.setup().then(() => {
          return provider.addInteraction({
            uponReceiving: 'a request for JSON data',
            withRequest: {
              method: 'GET',
              path: '/updates',
            },
            willRespondWith: {
              status: 200,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
              body: EXPECTED_RESPONSE,
            },
          })
        })
      })

      it('can process the JSON payload from the provider', () => {
        const response = fetchProviderData()

        return expect(response).to.eventually.have.property('count')
      })

      it('should validate the interactions and create a contract', () => {
        return provider.verify()
      })
    })

    // Write pact files to file
    after(() => {
      return provider.finalize()
    })
  })
})