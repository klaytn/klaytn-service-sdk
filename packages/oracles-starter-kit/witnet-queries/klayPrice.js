import * as Witnet from "witnet-requests";

const cryptoCompare = new Witnet.Source(
  "https://min-api.cryptocompare.com/data/price?fsym=KLAY&tsyms=USD"
)
  .parseJSONMap()
  .getFloat("USD")
  .multiply(10 ** 6)
  .round();

const coinbase = new Witnet.Source(
  "https://api.coinbase.com/v2/exchange-rates?currency=KLAY"
)
  .parseJSONMap()
  .getMap("data")
  .getMap("rates")
  .getFloat("USD")
  .multiply(10 ** 6)
  .round();

const aggregator = Witnet.Aggregator.deviationAndMean(1.5)

const tally = Witnet.Tally.deviationAndMean(2.5)

const query = new Witnet.Query()
  .addSource(cryptoCompare)
  .addSource(coinbase)
  .setAggregator(aggregator) // Set the aggregator function
  .setTally(tally) // Set the tally function
  .setQuorum(10, 51) // Set witness count and minimum consensus percentage
  .setFees(5 * 10 ** 9, 10 ** 9) // Witnessing nodes will be rewarded 5 $WIT each
  .setCollateral(50 * 10 ** 9) // Require each witness node to stake 50 $WIT

// Do not forget to export the query object
export { query as default }