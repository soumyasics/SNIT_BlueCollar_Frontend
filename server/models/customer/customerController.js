const custschema=require("./customerSchema")
const multer=require ("multer")
const jwt = require("jsonwebtoken");
const secret="secret_key"



const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, "./upload");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage }).single("image");

  const registercust = (req, res) => {
    const customers = new custschema({
      name: req.body.name,
      housename:req.body.housename,
      city:req.body.city,
      phone: req.body.phone,
      pincode:req.body.pincode,
      email: req.body.email,
      password: req.body.password,
      image: req.file,
    });
    customers
      .save()
      .then((data) => {
        res.json({
          status: 200,
          msg: "Inserted Successfully",
          data: data,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          let errMsg = "Data not Inserted";
          if (err.keyPattern.hasOwnProperty("phone")) {
            errMsg = "Contact already in Use";
          } else if (err.keyPattern.hasOwnProperty("email")) {
            errMsg = "Email Id already in Use";
          } 
          return res.status(409).json({
            status: 409,
            msg: errMsg,
            Error: err,
          });
        }
        res.status(500).json({
          status: 500,
          msg: "Data not Inserted",
          Error: err,
        });
      });
  };
  //customer registration completed

  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
  
    console.log("t1",token);
    console.log("secret",secret);
    if (!token) {
      return res.json({status:401,msg: 'Unauthorized' });
    }
    jwt.verify(token, secret, (err, decodedToken) => {
      console.log(decodedToken);
      if (err) {
        return res.json({status:401, messagge: 'Unauthorized' ,err:err});
      }
  
      req.user = decodedToken.userId;
      next();
      return res.json({ status:200,msg: 'ok' ,user:decodedToken.userId});
    });
    console.log(req.user);
  };
  //token decode api

  const custLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await custschema.findOne({ email: email });
  
      if (user) {
       if (user.password === password) {
          const token = jwt.sign(
            { email: user.email, password: user.password },
            "secret_key",
            { expiresIn: 86400 }
          );
          return res.json({
            status:200,
            msg:"Login Successfully", token, id: user._id 
          })
        }
        else {
            return res.json({status:401, message: "Password error" });
        }
      } else {
        return res.json({status:404, message: "User does not exist" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  //customer login completed

const custforgetpswd=((req,res)=>{
    custschema.findOneAndUpdate(
        { email: req.body.email },
        { password: req.body.password }
      )
      .exec()
      .then((data) => {
        if (data != null)
          res.json({
            status: 200,
            msg: "Updated successfully",
          });
        else
          res.json({
            status: 500,
            msg: "User Not Found",
          });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: 500,
          msg: "Data not Updated",
          Error: err,
        });
      });
  
})
//customer forgetpswd completed

const updatecustprofile=(req,res)=>{
    custschema.findByIdAndUpdate({_id:req.params.id},{
      name: req.body.name,
      housename:req.body.housename,
      city:req.body.city,
      phone: req.body.phone,
      pincode:req.body.pincode,
      email: req.body.email,
      password: req.body.password,
      image: req.file,
      })
    .exec()
    .then((response)=>{
      res.json({
        status:200,
        msg:"updated successfully",
        data:response
      })
    })
    .catch((err)=>{
      res.json({
        status:500,
        msg:"error",err
      })
      console.log(err);
    })
  
  }
  //customer update profile completed
  const viewallcust=((req,res)=>{
    custschema.find()
    .exec()
    .then((data)=>{
        if(data!==null){
            res.json({
                status:200,
                data:data,
                msg:"Data successfully get"
            })
        }
    })
    .catch((err)=>{
        console.log(err);
        res.json({
            status: 500,
            msg: err
        })
    })
  })
  //view all cust completed

  const viewcustbyid = (req, res) => {
    custschema
      .findById({ _id: req.params.id })
      .exec()
      .then((data) => {
        if (!data) {
          return res.status(404).json({ error: "Shop not found" });
        }
        res.json({
          status: 200,
          data: data,
        });
      })
      .catch((err) => {
        console.error("Error finding shop by ID:", err);
        res.status(500).json({ error: "Internal server error" });
      });
  };
  //view cust by id completed

  const deletecustById =async (req, res) => {
    await custschema.findByIdAndDelete({ _id: req.params.id }).exec()
        .then((result) => {
            res.json({
                status: 200,
                data: result,
                msg: 'data deleted'
            })
        })
        .catch(err => {
            res.json({
                status: 500,
                msg: 'Error in API',
                err: err
            })
        })
  
      }
  
  
  module.exports={
            registercust,upload,
            custLogin,verifyToken,
            custforgetpswd,
            updatecustprofile,upload,
            viewallcust,
            viewcustbyid,
            deletecustById
  }