import type { Section } from "./Section.js";

export type Class = {
  Name: string;
  Term: string;
  Teacher: string;
  Lecture: Section | null;
  Discussions: Section[];
  Midterms: Section[];
  Final: Section | null;
};
