import createError from 'http-errors';
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import vash from 'vash/lib/helpers/layout.js'
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";

const __dirname = path.resolve();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine("html", vash.__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.resolve(__dirname + '/public')));
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use('/', indexRouter);
app.use('/generate', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app
