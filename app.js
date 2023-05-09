const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
// const Authenticate = require("./Middlewares/authUser");
const saltRounds = 10;
const Consumer = require("./Models/consumerModel");
const Organization = require("./Models/organizationModel");
const userSlot = require("./Models/usersSlotsModel");
const Events = require("./Models/eventsModel");
const Wishlist = require("./Models/wishListModel");
const consumerAuth = require("./Middlewares/consumeAuth");
const organisationAuth = require("./Middlewares/organizationAuth");

const Port = process.env.PORT || 8081;
const app = express();
app.use(cookieParser());
app.use(morgan("combined"));
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
    console.log(existingConsumer._id);
    token = jwt.sign(
      { consumerId: existingConsumer._id },
      process.env.SECRETKEY1
    );
    console.log(token);

    // res.cookie("jwtoken", token, {
    //   expires: new Date(Date.now() + 25892000000),
    //   httpOnly: true,

    //   sameSite: process.env["NODE_ENV"] === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
    //   secure: process.env["NODE_ENV"] === "production", // must be true if sameSite='none',
    // });

    res.status(201).json({
      message: "Consumer Logged in successfully",
      jwttoken: token,
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
    orgLicenseId,
    organizationState,
    organizationCity
  } = req.body;
  console.log(req.body);
  try {
    if (
      !organizationName ||
      !organizationEmail ||
      !organizationPassword ||
      !orgLicenseId ||
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
      liscenseId: orgLicenseId,
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

    console.log(existingOrganization);
    let token = jwt.sign(
      { organizationId: existingOrganization._id },
      process.env.SECRETKEY1
    );
    console.log(token);

    // res.cookie("jwtoken", token, {
    //   expires: new Date(Date.now() + 25892000000),
    //   httpOnly: true,

    //   sameSite: process.env["NODE_ENV"] === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
    //   secure: process.env["NODE_ENV"] === "production", // must be true if sameSite='none',
    // });

    res.status(201).json({
      message: "Organization Logged in successfully",
      jwttoken: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.post("/consumer/bookSlot", consumerAuth, async (req, res) => {
  try {
    const currentDate = new Date();
    const { eventId, startTime, endTime } = req.body;

    const eventData = await Events.findOne({ _id: eventId });
    console.log(eventData.rationDetails);

    eventData.rationDetails.forEach((detail) => {
      if (detail.quantity < detail.allocatedPerUser) {
        console.log("Event is out of Stock");
        //add user to wishlist

        return res.status(400).json({
          message: "Event is out of Stock",
        });
      }
    });
    if (
      eventData.rationDetails[0].quantity <= eventData.percent30Data[0].quantity
    ) {
      eventData.rationDetails.forEach((detail) => {
        detail.allocatedPerUser = Math.floor(detail.allocatedPerUser * 0.9);
      });
    }
    if (
      eventData.rationDetails[0].quantity <= eventData.percent50Data[0].quantity
    ) {
      eventData.rationDetails.forEach((detail) => {
        detail.allocatedPerUser = Math.floor(detail.allocatedPerUser * 0.8);
      });
    }
    if (
      eventData.rationDetails[0].quantity <= eventData.percent70Data[0].quantity
    ) {
      eventData.rationDetails.forEach((detail) => {
        detail.allocatedPerUser = Math.floor(detail.allocatedPerUser * 0.9);
      });
    }

    console.log(eventData.rationDetails);

    const result = await Consumer.findOne({ _id: req.rootConsumer._id });
    if (result.registeredEvents.includes(eventId)) {
      console.log("You Cannot Book slot now for this event");
      return res.status(400).json({
        message: "You Cannot Book slot now for this event",
      });
    }
    const rationDetailsConsumer = [];
    eventData.rationDetails.forEach((detail) => {
      const data = {
        Item: detail.item,
        Quantity: detail.allocatedPerUser,
      };
      detail.quantity = detail.quantity - detail.allocatedPerUser;
      rationDetailsConsumer.push(data);
    });

    console.log(rationDetailsConsumer);

    const RationDetails = eventData.rationDetails;

    const newSlot = new userSlot({
      consumerEmail: req.rootConsumer.email,
      eventId: eventId,
      startTime: startTime,
      endsTime: endTime,
      bookingDate: currentDate,
      rationDetails: rationDetailsConsumer,
    });

    // const lastDate = result.lastSlotDate;
    // const diffTime = Math.abs(lastDate - currentDate);
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(currentDate);
    // console.log(lastDate);
    // console.log(diffDays);

    // if (diffDays < 30) {
    //   return res.status(400).json({
    //     message: "You Cannot Book slot now",
    //   });
    // }

    const response = await Events.findByIdAndUpdate(
      { _id: eventId },
      { rationDetails: RationDetails }
    );

    const eventDetails = Events.findOne({ _id: eventId });
    const data = await userSlot.create(newSlot);
    console.log(data);
    await Consumer.updateOne(
      {
        _id: req.rootConsumer._id,
      },
      { $push: { registeredEvents: eventId } }
    );
    // const newArray = result.registeredEvents.push(eventId);
    // await Consumer.findByIdAndUpdate(
    //   { _id: req.rootConsumer._id },
    //   { registeredEvents: newArray }
    // );
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

app.get("/consumer/getEvents", consumerAuth, async (req, res) => {
  try {
    const events = await Events.find();
    console.log(events);
    res.send(events);
  } catch (error) {}
});

app.get("/consumer/getDetails", consumerAuth, async (req, res) => {
  try {
    const consumerDetails = await Consumer.find({ _id: req.consumerid });
    console.log(consumerDetails);
    res.send(consumerDetails);
  } catch (error) {}
});
app.get("/organization/getDetails", organisationAuth, async (req, res) => {
  try {
    const organizationDetails = await Organization.find({
      _id: req.rootOrganization._id,
    });
    console.log(organizationDetails);
    res.send(organizationDetails);
  } catch (error) {}
});
app.post("/consumer/eventDetails", consumerAuth, async (req, res) => {
  try {
    const { eventId } = req.body;

    const result = await Events.findOne({ _id: eventId });

    res.send(result);
  } catch (error) {}
});

app.get("/organization/allEvents", organisationAuth, async (req, res) => {
  console.log("hii");
  try {
    console.log(req.rootOrganization);
    const allEvents = await Events.find({
      organizationEmail: req.rootOrganization.email,
    });
    res.send(allEvents);
    console.log(allEvents);
  } catch (error) {}
});

app.post("/organization/addEvent", organisationAuth, async (req, res) => {
  console.log("Event API");
  try {
    const {
      eventName,
      eventState,
      eventDate,
      eventCity,
      rationDetails,
      scheduleDetails,
    } = req.body;

    const percent_30 = [];
    const percent_50 = [];
    const percent_70 = [];
    // const reservedData = [];

    // rationDetails.forEach((detail) => {
    //   const data = {
    //     item: Math.floor(detail.item * 0.5),
    //     quantity: Math.floor(detail.quantity * 0.5),
    //   };
    //   detail.quantity = detail.quantity - data.quantity;
    //   reservedData.push(data);
    // });

    console.log("Reserved Data");
    console.log(rationDetails);

    rationDetails.forEach((detail) => {
      const data_30 = {
        item: detail.item,
        quantity: detail.quantity - Math.floor(detail.quantity * 0.3),
      };
      const data_50 = {
        item: detail.item,
        quantity: detail.quantity - Math.floor(detail.quantity * 0.5),
      };
      const data_70 = {
        item: detail.item,
        quantity: detail.quantity - Math.floor(detail.quantity * 0.7),
      };

      percent_30.push(data_30);
      percent_50.push(data_50);
      percent_70.push(data_70);
    });

    console.log(percent_30, percent_50, percent_70);

    const event = new Events({
      eventName: eventName,
      eventState: eventState,
      eventDate: new Date(eventDate),
      eventCity: eventCity,
      rationDetails: rationDetails,
      rationSchedule: scheduleDetails,
      organizationEmail: req.rootOrganization.email,
      percent30Data: percent_30,
      percent50Data: percent_50,
      percent70Data: percent_70,
      reservedData: reservedData,
    });

    const result = await Events.create(event);
    console.log(result);

    const usersEmail = await Consumer.find();
    // for (var j = 0; j < myArray.length; j++) {
    //   console.log(myArray[j]);
    // }

    res.status(201).json({
      message: "Event Added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
});
app.listen(Port, () => {
  console.log(`listening on ${Port}`);
});
