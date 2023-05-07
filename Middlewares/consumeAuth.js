const jwt = require("jsonwebtoken");
const Consumer = require("../Models/consumerModel");
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());

const consumerAuth = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    console.log(req.cookies);
    jwt.verify(token, process.env.SECRETKEY1, (err, user) => {
      if (err) res.status(403).json("token is not valid");
      console.log(user);
    });
    const consumer = jwt.verify(token, process.env.SECRETKEY1);
    console.log(consumer);

    const rootConsumer = await Consumer.findOne({ _id: consumer.consumerId });
    console.log("hii");
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
