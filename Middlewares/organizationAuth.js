const jwt = require("jsonwebtoken");
// const  = require("../Models/consumerModel");
const Organization = require("../Models/organizationModel.js");
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());

const organizationAuth = async (req, res, next) => {
  console.log("Entered in auth");
  try {
    const token = req.cookies.access_token_org;
    console.log(req.cookies);
    jwt.verify(token, process.env.SECRETKEY1, (err, user) => {
      if (err) res.status(403).json("token is not valid");
      console.log(user);
    });
    // const token = req.cookies.jwtoken;
    const organization = jwt.verify(token, process.env.SECRETKEY1);

    const rootOrganization = await Organization.findOne({
      _id: organization.organizationId,
    });

    console.log(rootOrganization);

    if (!rootOrganization) {
      res.send("Organization not found");
    }

    console.log(rootOrganization);
    req.rootOrganization = rootOrganization;
    req.organizationid = organization.organizationId;
    req.organizationemail = rootOrganization.email;
    
    console.log("Next");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized Organization");
  }
};

module.exports = organizationAuth;
