const jwt = require("jsonwebtoken");
// const  = require("../Models/consumerModel");
const Organization = require("../Models/organization");
// var cookieParser = require("cookie-parser");
// app.use(cookieParser());

const organizationAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const organization = jwt.verify(token, process.env.SECRETKEY2);

    const rootOrganization = await User.findOne({
      _id: organization.organzationId,
    });

    console.log(rootOrganization);

    if (!rootOrganization) {
      res.send("Organization not found");
    }

    req.rootOrganization = rootOrganization;
    req.organizationid = organization.organizationId;
    req.organizationemail = rootOrganization.email;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Unauthorized Organization");
  }
};

module.exports = organizationAuth;
