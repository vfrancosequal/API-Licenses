import express from "express";
const router = express.Router()

import{listLicenses, createLicenses, infoLicenses, statusLicenses} from "../controllers/licensesController.js";

router.get("/", listLicenses);
router.post("/", createLicenses);
router.get("/info", infoLicenses);
router.post("/status", statusLicenses);

export default router;