require("dotenv").config();

const session = require("express-session");
const express = require("express");
const compression = require("compression");
const MongoStore = require("connect-mongo");

const { run } = require("./vm");
const dbConfig = require("./db/config/db.config");

const app = express();
app.set("trust poxy", 1);
const PORT = process.env.PORT || 3030;

const vmRouter = express.Router();

const sessionConfig = {
	resave: false,
	saveUninitialized: false,
	secret: process.env.SESSION_SECRET,
	name: process.env.SESSION_NAME,
	store: MongoStore.create({
		mongoUrl: dbConfig.url,
		ttl: 86400, // in seconds
		autoRemove: "native",
		autoRemoveInterval: 25,
		crypto: {
			secret: process.env.MONGO_CRYPTO_SECRET,
			algorithm: "aes-256-gcm",
			hashing: "sha256",
		},
	}),
};

vmRouter.use(session(sessionConfig));
vmRouter.use(express.json());
vmRouter.use(compression());

vmRouter.use((req, res, next) => {
	res.header({
		"Access-Control-Allow-Credentials": true,
		"Access-Control-Request-Method": "POST",
		"Access-Control-Allow-Headers":
			"Origin, X-Requested-With, Content-Type, Accept, Authorization",
		"Access-Control-Allow-Origin": `${process.env.CLIENT}`,
	});
	next();
});

vmRouter.post("/", run);

app.use("/api", vmRouter);

app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
