import "./app.js";
import { branches } from "./data-config.js";

document.querySelector("#branchList").innerHTML = branches
  .map((branch) => {
    const status = branch.active ? "Active" : "Inactive";
    const className = branch.active ? "green" : "gray";
    return `<div class="list-item"><strong>${branch.name}</strong><span class="pill ${className}">${status}</span></div>`;
  })
  .join("");
