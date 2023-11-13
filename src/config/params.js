import { Command } from "commander";

const program = new Command();

program
	.option("-d, --debug", "Debug variable", false)
	.option("-m, --mode <mode>", "Environment", "development");

program.parse();

export default program.opts();
