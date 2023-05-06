const jwt = require("jsonwebtoken");
const Consumer = require("../Models/consumerModel");
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());

const consumerAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const consumer = jwt.verify(token, process.env.SECRETKEY1);

    const rootConsumer = await User.findOne({ _id: consumer.consumerId });

    console.log(rootConsumer);

    if (!rootConsumer) {
      res.send("User not found");
    }

    req.rootConsumer = rootConsumer;
    req.consumerid = consumer.consumerId;
    req.consumeremail = rootConsumer.email;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized Consumer");
  }
};

module.exports = consumerAuth;
