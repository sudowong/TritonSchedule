// WORKFLOW
// Check current row element 
// - If is a header, scrape the class title and put it in the model
// - If it is a class section scrape the contents and push it to the 
// model array 

import puppeteer from "puppeteer";
import type { Course } from "../models/Course.js";
import type { Section } from "../models/Section.js";
import type { Term } from "../models/Term.js";

export async function 

