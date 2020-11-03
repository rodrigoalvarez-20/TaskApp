const express = require("express");
const bodyParser = require("body-parser");
const mongoose =  require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./server/routes/users");
const taskRoutes = require("./server/routes/tasks");

dotenv.config();

const app = express();

//Conexion a Mongo
mongoose.connect("mongodb+srv://ralvarez20:"+ process.env.MONGO_PWD + "@examen.yho1d.mongodb.net/"+ process.env.MONGO_DB + "?retryWrites=true&w=majority");

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

//Rutas
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Pagina principal de la API"
    });
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");

	if (req.method === "OPTIONS"){
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "*");
		return res.status(200).json({});
	}
	next();
});

module.exports = app;