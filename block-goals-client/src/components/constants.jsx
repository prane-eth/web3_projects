
// export const urlBase = 'https://cdn.jsdelivr.net/gh/vh-praneeth/web3_projects@main/commons_app';
// export const commonsFolder = "../../../commons/src";
export const projectName = 'Block Goals';
import Commons from "../../../commons/src";

// have only 1 function so it can be changed later in 1 place
// micro-frontend or web components can be used in future
export const getCommons = () => Commons; //require(commonsFolder);
