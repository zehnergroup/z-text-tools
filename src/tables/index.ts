import { Feature } from "../types";
import Table from "cli-table3";
import chalk from "chalk";
import { isFunction } from "util";

export const tableChars = {
  top: "═",
  "top-mid": "╤",
  "top-left": "╔",
  "top-right": "╗",
  bottom: "═",
  "bottom-mid": "╧",
  "bottom-left": "╚",
  "bottom-right": "╝",
  left: "║",
  "left-mid": "╟",
  mid: "─",
  "mid-mid": "┼",
  right: "║",
  "right-mid": "╢",
  middle: "│",
};

export const arrayWithColor = (arr: string[], color: string): string[] => {
  const fn = (chalk as any)[color];
  return isFunction(fn) ? arr.map((elem: string) => fn(elem)) : arr;
};

export const displayFeatures = (features: Feature[]) => {
  const headArray: string[] = ["Ticket Identifier", "Branch Name", "PR Title"];
  let table = new Table({
    head: arrayWithColor(headArray, "cyanBright"),
    chars: tableChars,
  });

  features.forEach((feature: Feature) => {
    const row = [
      feature.ticket.projectIdentifier,
      feature.branch.name || "",
      feature.pr.title,
    ];

    table.push(row);
  });

  console.log(table.toString());
};
