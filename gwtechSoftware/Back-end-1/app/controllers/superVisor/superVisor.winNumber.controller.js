const db = require("../../models");
const WinningNumber = db.winningNumber;
// Read
exports.readWinningNumber = async (req, res) => {
  try {
    const { lotteryCategoryName, fromDate, toDate } = req.body;

    //console req.body
    console.log("Request Body:", req.body);


    // Log the dates to see if they are received correctly
    console.log("From Date:", fromDate, "To Date:", toDate);

    let winningNumber = null;

    // Ensure that the fromDate and toDate received from the frontend are correctly formatted as Date objects before passing them into the MongoDB query.
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    //console the from date and to date
    console.log("From Date (converted):", startDate);
    console.log("To Date (converted):", endDate);


    if (lotteryCategoryName == "") {
      winningNumber = await WinningNumber.find({
        date: { $gte: fromDate, $lte: toDate },
      }).sort({ date: 1 });
    } else {
      winningNumber = await WinningNumber.find({
        lotteryCategoryName: lotteryCategoryName,
        date: { $gte: fromDate, $lte: toDate },
      }).sort({ date: 1 });
    }

    // Log the fetched winning numbers to see the result
    console.log("Winning Numbers:", winningNumber);

    if (winningNumber.length == 0) {
      return res.send({ success: false, message: "Winning number not found" });
    }

    const winNumber = [];
    winningNumber.map((item) => {
      let numbers = {};
      item.numbers.map((value) => {
        if (value.gameCategory === "BLT" && value.position === 2) {
          numbers.second = value.number;
        }
        if (value.gameCategory === "BLT" && value.position === 3) {
          numbers.third = value.number;
        }
        if (value.gameCategory === "L3C") {
          numbers.l3c = value.number;
        }
      });

      winNumber.push({
        date: item.date,
        lotteryName: item.lotteryCategoryName,
        numbers: numbers,
      });
    });

    res.send({ success: true, data: winNumber });
  } catch (err) {
    console.log(err.message);
    res.send({ success: false, message: "Server error" });
  }
};
