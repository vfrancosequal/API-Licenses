import express from "express";
const router = express.Router()

import {listLicenses, createLicenses, infoLicenses, statusLicenses, updateLicenses, validateLicense, associateLicense} from "../controllers/licensesController.js";

router.get("/", listLicenses);
router.post("/", createLicenses);
router.post("/update", updateLicenses);
router.get("/info", infoLicenses);
router.post("/status", statusLicenses);
router.get("/validate", validateLicense);
router.post("/associate", associateLicense);

export default router;