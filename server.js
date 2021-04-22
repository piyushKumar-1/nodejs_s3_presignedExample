var express=require('express');
const bodyParser = require('body-parser');

var app=express();


app.set('views', __dirname);

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json())


require('dotenv').config();

var AWS = require('aws-sdk');

var bucketName = 'BUCKET_NAME';
var credentials = {
    accessKeyId: 'ACCESS_KEY',
    secretAccessKey : 'SECRET_KEY'
};



AWS.config.update({credentials: credentials, region: 'us-east-2'});

var s3 = new AWS.S3();


app.get('/',function(req,res){
	res.render('index.html');
});

app.get("/allfiles", function(req, res){
  var params = {
  Bucket: bucketName,
  // MaxKeys: 2
 };

 s3.listObjects(params, function(err, data) {
   if (err) res.send("Error") // an error occurred
   else     res.json(data.Contents);           // successful response
 });
});

app.get('/upload',function(req,res){
	res.send('<a href="/download"> World!</a>');
});

app.post('/upload', function(req, res){
  let filename = req.body.filename;
  var presignedUPLOADURL = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: filename, //filename
      Expires: 1000 //time to expire in seconds
  });
  res.send(presignedUPLOADURL);
})

app.post('/download', function(req, res){
  let filename = req.body.filename;
  var presignedDownloadURL = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: filename, //filename
      Expires: 1000 //time to expire in seconds
  });
  res.send(presignedDownloadURL);
})

var server=app.listen(3000,function() {
  console.log("server live at localhost:3000");
});
