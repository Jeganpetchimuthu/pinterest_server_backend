const express = require("express");
const multer = require("multer");
const Images = require("../models/createImage");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// router.post("/creatImage", upload.single("file"), (req, res) => {
//   Images.create({ image: req.file.filename })
//     .then((result) => res.json(result))
//     .catch((error) => console.log(error));
// });

router.post("/createImage", upload.single("file"), (req, res) => {
  Images.create({ image: req.file.filename });
  const saveImage = new Images({
    image: {
      data: fs.readFileSync("upload/" + req.file.filename),
      contentType: "image/png",
    },
  });
  saveImage
    .save()
    .then((res) => {
      console.log("image save");
    })
    .catch((error) => {
      console.log(error);
    });
  res.send("image is saved");
});

router.get("/createImage", async (req, res) => {
  const allData = await Images.find();
  res.status(200).json(allData);
});

module.exports = router;
