const Witnet = require('witnet-requests')

const url = 'https://httpbin.org/post'
const body = 'This is the request body'
const headers = { 'Header-Name': 'Header-Value' }
const jsonPath = ['headers', 'Header-Name']

const testPostSource = new Witnet.HttpPostSource(
  url,
  body,
  headers
).parseJSONMap()

jsonPath.forEach((item, index) => {
  if (index === jsonPath.length - 1) {
    testPostSource.getString(item)
  } else {
    testPostSource.getMap(item)
  }
})

const aggregator = Witnet.Aggregator.mode()

const tally = Witnet.Tally.mode()

const query = new Witnet.Query()
  .addSource(testPostSource)
  .setAggregator(aggregator) // Set the aggregator function
  .setTally(tally) // Set the tally function
  .setQuorum(10, 51) // Set witness count and minimum consensus percentage
  .setFees(5 * 10 ** 9, 10 ** 9) // Witnessing nodes will be rewarded 5 $WIT each
  .setCollateral(50 * 10 ** 9) // Require each witness node to stake 50 $WIT

// Do not forget to export the query object
export { query as default }
