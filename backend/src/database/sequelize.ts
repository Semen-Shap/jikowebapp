import { Sequelize } from "sequelize";

export const sequelize: Sequelize = new Sequelize({
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: '../database.sqlite',
});
