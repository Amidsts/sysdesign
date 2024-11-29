/**
 * Assume that there is an exchange rate API that returns the exchange rate between two currencies.
 * The API is called with the following URL: https://api.exchangeratesapi.io/latest?base=NGN&target=KES
 * The API returns the following JSON response:
 * {
 *  "base": "NGN",
 *  "target": "KES",
 *  "rate": 0.25,
 *  "date": "2020-01-01",
 * }
 */

// Complete the function below to fetch the exchange rate between two currencies
// The function should return a promise that resolves to the exchange rate
// The function should take two arguments: baseCurrency and targetCurrency
// The function should handle errors that occur during the fetch operation
async function fetchExchangeRate(baseCurrency, targetCurrency) {
  try {
    const { data } = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${baseCurrency}&target=${targetCurrency}`
    );

    const { base, target, rate, date } = data;
    return { base, target, rate, date };
  } catch (error) {
    throw Error(error);
  }
}

//should call the fetchExchangeRate function

async function storeExchangeRate(payload) {
  try {
      const { baseCurrency, targetCurrency } = payload;
      
      let latestExchangeRate = await exchangeRateModel.findOne(
        { baseCurrency, targetCurrency },
        null,
        { sort: { createdAt: -1 } }
      );
      
      const currentDate = new date();
      if (currentDate > latestExchangeRate.expiresAt) {
          
            const { base, target, rate, date } = await fetchExchangeRate(
              baseCurrency,
              targetCurrency
            );

          latestExchangeRate = await new exchangeRateModel({
              baseCurrency: base,
              targetCurrency: target,
              exchangeRate: rate,
              expiresAt: new Date(currentDate + "1hr"),
              createdAt: currentDate
          }).save()
      }

    return latestExchangeRate;
  } catch (error) {
    throw Error(error);
  }
}
