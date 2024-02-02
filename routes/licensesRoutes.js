import express from "express";
const router = express.Router()

import{listLicenses, createLicenses} from "../controllers/licensesController.js";

router.get("/", listLicenses);
router.post("/", createLicenses);

export default router;