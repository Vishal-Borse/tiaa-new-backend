const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const Authenticate = require("./Middlewares/authUser");
const saltRounds = 10;
const Consumer = require("./Models/consumerModel");
const Organization = require("./Models/organizationModel");
const userSlot = require("./Models/usersSlotsModel");
const consumerAuth = require("./Middlewares/consumeAuth");
const organisationAuth = require("./Middlewares/organisationAuth");
const Port = process.env.PORT || 8081;
const app = express();
app.use(cookieParser());
mongoose.set("strictQuery", true);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
dotenv.config();

mongoose.connect(process.env.URL);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/consumer/signup", async (req, res) => {
  const {
    consumerFirstName,
    consumerLastName,
    consumerEmail,
    consumerPassword,
    consumerPhone,
    consumerAadharNo,
    consumerState,
    consumerCity,
    consumerAge,
  } = req.body;
  console.log(req.body);
  try {
    if (
      !consumerFirstName ||
      !consumerLastName ||
      !consumerEmail ||
      !consumerPassword ||
      !consumerPhone ||
      !consumerAadharNo ||
      !consumerState ||
      !consumerCity ||
      !consumerAge
    ) {
      return res.status(422).json({
        message: "Fill all fields",
      });
    }
    const existingConsumer = await Consumer.findOne({
      email: consumerEmail,
    });
    if (existingConsumer) {
      return res.status(400).json({
        message: "Consumer already Exist!",
      });
    }

    const hashedPassword = await bcrypt.hash(consumerPassword, saltRounds);

    const consumer = new Consumer({
      firstName: consumerFirstName,
      lastName: consumerLastName,
      email: consumerEmail,
      password: hashedPassword,
      phone: consumerPhone,
      aadharNo: consumerAadharNo,
      state: consumerState,
      city: consumerCity,
      age: consumerAge,
    });

    await Consumer.create(consumer);
    res.status(201).json({
      message: "Consumer created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.post("/consumer/signin", async (req, res) => {
  const { consumerEmail, consumerPassword } = req.body;

  console.log(req.body);

  let token;
  try {
    if (!consumerEmail || !consumerPassword) {
      return res.status(422).json({
        message: "Fill all fields",
      });
    }
    const existingConsumer = await Consumer.findOne({ email: consumerEmail });

    if (!existingConsumer) {
      return res.status(404).json({
        message: "consumer not found",
      });
    }

    const matchPassword = await bcrypt.compare(
      consumerPassword,
      existingConsumer.password
    );

    if (!matchPassword) {
      return res.status(400).json({
        message: "Invalid Credinals",
      });
    }

    token = jwt.sign(
      { consumerId: existingConsumer._id },
      process.env.SECRETKEY1
    );

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,

      sameSite: process.env["NODE_ENV"] === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
      secure: process.env["NODE_ENV"] === "production", // must be true if sameSite='none',
    });

    res.status(201).json({
      message: "Consumer Logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.post("/organization/signup", async (req, res) => {
  const {
    organizationName,
    organizationEmail,
    organizationPassword,
    licenseId,
    organizationState,
  } = req.body;
  console.log(req.body);
  try {
    if (
      !organizationName ||
      !organizationEmail ||
      !organizationPassword ||
      !licenseId ||
      !organizationState
    ) {
      return res.status(422).json({
        message: "Fill all fields",
      });
    }
    const existingOrganization = await Organization.findOne({
      email: organizationEmail,
    });
    if (existingOrganization) {
      return res.status(400).json({
        message: "Organization already Exist!",
      });
    }

    const hashedPassword = await bcrypt.hash(organizationPassword, saltRounds);

    const organization = new Organization({
      name: organizationName,
      licenseId: licenseId,
      email: organizationEmail,
      password: hashedPassword,
    });

    await Organization.create(organization);
    res.status(201).json({
      message: "Organization created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.post("/organization/signin", async (req, res) => {
  const { organizationEmail, organizationPassword } = req.body;

  console.log(req.body);

  let token;
  try {
    if (!organizationEmail || !organizationPassword) {
      return res.status(422).json({
        message: "Fill all fields",
      });
    }
    const existingOrganization = await Organization.findOne({
      email: organizationEmail,
    });

    if (!existingOrganization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    const matchPassword = await bcrypt.compare(
      organizationPassword,
      existingOrganization.password
    );

    if (!matchPassword) {
      return res.status(400).json({
        message: "Invalid Credinals",
      });
    }

    token = jwt.sign(
      { organizationId: existingOrganization._id },
      process.env.SECRETKEY2
    );

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,

      sameSite: process.env["NODE_ENV"] === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
      secure: process.env["NODE_ENV"] === "production", // must be true if sameSite='none',
    });

    res.status(201).json({
      message: "Organization Logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.post("/consumer/bookSlot", async (req, res) => {
  try {
    const { consumerEmail, organizationId, startTime, endTime } = req.body;

    const slot = userSlot.findOne({ _id: consumerid });
    if (slot.rationReceived == true) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }
    var currentTime = new Date();
    const newSlot = new userSlot({
      consumerEmail: consumerAuth,
      organizationId: organizationId,
      startTime: startTime,
      endsTime: endTime,
      bookingDate: currentTime,
      rationReceived: false,
    });
    await userSlot.create(newSlot);
    res.status(201).json({
      message: "Slots created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.listen(Port, () => {
  console.log(`listening on ${Port}`);
});
