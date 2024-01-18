
const express = require("express");
const app = express();
const port = 3008;

app.use(express.static(__dirname + "/public")); //__dirname (2 underscores) : path, where we are right now(C:\Users\Ishita\Documents\js practice\Dashboard JS)
// expess.static: We told express that for every static file we've to use this public folder that we've created
app.set("view engine", "ejs"); // view engine is ejs
app.use(express.urlencoded({ extended: true }));



let mData = "";
let mChart = "";
let coinName = "bitcoin";

async function resData(coinName) {
  var marketData = await new Promise((resolve, reject) => {
    fetch("https://api.coingecko.com/api/v3/coins/" + coinName)
      .then((res) => res.json())
      .then((data) => {
        mData = data; // data is in json format unlike request where we have to cpnvert using JSON.parse(mData)
        resolve(mData);
      })
      .catch((error) => {
        console.error("Error fetching market data:", error);
        reject(error);
      });
  });

  var marketChart = null;

  if (marketData) {
    marketChart = await new Promise((resolve, reject) => {
      fetch(
        "https://api.coingecko.com/api/v3/coins/" +
          coinName +
          "/market_chart?vs_currency=usd&days=30"
      )
        .then((res) => res.json())
        .then((data) => {
          mChart = data; // data is in json format unlike request where we have to cpnvert using JSON.parse(mData)
        //   console.log(mChart);
          resolve(mData);
        })
        .catch((error) => {
            console.error("Error fetching market data:", error);
            reject(error);
          });
    });
  }
}

app.get("/", async (req, res) => {
  await resData(coinName);
  res.render("index", { mData, mChart }); // the thing that we want to send from server to browser will be inside {}
});

app.post("/", async (req, res) => {
  coinName = req.body.selectCoin;
  await resData(coinName);
  res.render("index", { mData, mChart });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
