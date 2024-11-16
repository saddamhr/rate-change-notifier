import fetchExchangeRate from './../src/services/fetchRate'

test("fetchExchangeRate should return an object with rate data", async () => {
  const data = await fetchExchangeRate();
  expect(data).toHaveProperty("rate");
});
