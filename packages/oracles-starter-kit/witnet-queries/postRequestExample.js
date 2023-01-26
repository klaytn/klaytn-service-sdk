const Witnet = require('witnet-requests')

const testPostSource = new Witnet.HttpPostSource(
  'https://httpbin.org/post',
  'This is the request body',
  {
    'Header-Name': 'Header-Value'
  }
).parseJSONMap()
  .getMap('headers')
  .getString('Header-Name')

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
