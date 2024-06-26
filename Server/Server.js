const path = require('path');
const multer = require('multer');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));


const username = encodeURIComponent("NijeshRaghava");
const password = encodeURIComponent("Nijesh@2422");

let uri = `mongodb+srv://${username}:${password}@itservices.rol1ljq.mongodb.net/?retryWrites=true&w=majority&appName=ITServices`
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const pageSchema = new mongoose.Schema({
  title: String,
  index: Number,
  status : Boolean,
  mainpage: Boolean,
  subidS: [Number],
  parentid : Number},
  { timestamps: true });

const Page = mongoose.model('Page', pageSchema);

const imageSchema = new mongoose.Schema({
  imagepath: String,
  index: Number},
  { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

const saveSchema = new mongoose.Schema({
  pageid: Number,
  items: mongoose.Schema.Types.Mixed},
  {timestamps: true});

const Save = mongoose.model('Save',saveSchema);

const publishSchema = new mongoose.Schema({
  pageid: Number,
  items: mongoose.Schema.Types.Mixed},
  {timestamps: true});

const Publish = mongoose.model('Publish',publishSchema);

async function getNextImageIndex() {
  try {
    const files = await fs.promises.readdir('images/');
    return files.length + 1;
  } catch (error) {
    console.error('Error getting next image index:', error);
    throw error;
  }
}


app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // public folder images
    cb(null, 'images/'); 
  },
  filename: function (req, file, cb) {
    // Get the file extension
    const ext = path.extname(file.originalname).toLowerCase();

    // Get the count of existing files in the destination directory
    fs.readdir('images/', (err, files) => {
      if (err) {
        return cb(err);
      }
      
      // Calculate the next available index
      const nextIndex = files.length + 1;

      // Construct the filename using the index
      const filename = `image_${nextIndex}${ext}`;

      // Pass the filename to multer
      cb(null, filename);
    });
  }
});



const upload = multer({ storage: storage });

app.post('/api/upload-image', upload.single('image_name_in_form'), async (req, res) => {
  try {
    console.log(req.body);
    const imagePath = req.file.path;
    const newImageIndex = await getNextImageIndex();
    const newImage = new Image({ imagepath: imagePath, index: newImageIndex-1 });
    await newImage.save();
    res.status(200).json({ imagepath: newImage.imagepath});
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.get('/api/display-publish/:index', async (req,res) => {
  try{
    const index  = req.params.index;
    const pageIndex = parseInt(index, 10); // Convert to integer if necessary
    console.log(index);
    const page = await Publish.findOne({pageid: index},{items: 1,_id : 0});
    if (!page) {
      return res.status(404).json({ error: 'No page content found for the given index' });
    }
    console.log(page);
    res.status(200).json(page);
  } catch (error) {
    console.error('Error fetching Page:', error);
    res.status(500).json({ error: 'Failed to fetch Page' });
  }
})

app.get('/api/display-save/:index', async (req,res) => {
  try{
    const index  = req.params.index;
    const pageIndex = parseInt(index, 10); // Convert to integer if necessary
    console.log(index);
    const page = await Save.findOne({pageid: index},{items: 1,_id : 0});
    if (!page) {
      return res.status(404).json({ error: 'No page content found for the given index' });
    }
    console.log(page);
    res.status(200).json(page);
  } catch (error) {
    console.error('Error fetching Page:', error);
    res.status(500).json({ error: 'Failed to fetch Page' });
  }
})

app.post('/api/publish',async (req,res) => {
  console.log(req.body.index.index);
  try{
    const found = await Publish.findOne({pageid: req.body.index.index});
    if(found)
    {
      console.log("Hi");
      await found.updateOne({items: req.body.newItems})
        .then(updatedInstance => {
          console.log('Data updated successfully: ',updatedInstance);
        })
        .catch(err => {
          console.log('Failed Updating Data: ',err);
        })
      const savefound = await Save.findOne({pageid: req.body.index.index});
      if(savefound)
      {
        console.log("Hi");
        await savefound.updateOne({items: req.body.newItems})
          .then(updatedInstance => {
            console.log('Data updated successfully: ',updatedInstance);
          })
          .catch(err => {
            console.log('Failed Updating Data: ',err);
          })
        res.send(200);
      }
      else
      {
        console.log(req.body);
        const NewSave = new Save({
          pageid: req.body.index.index,
          items: req.body.newItems
        });
        await NewSave.save()
          .then(savedInstance => {
            console.log('Data saved successfully: ',savedInstance);
          })
          .catch(err =>{
            console.log('Error saving the Data: ',err);
          })
        res.send(200);
      }
    }
    else
    {
      console.log(req.body);
      const NewPublish = new Publish({
        pageid: req.body.index.index,
        items: req.body.newItems
      });
      await NewPublish.save()
        .then(savedInstance => {
          console.log('Data published successfully: ',savedInstance);
        })
        .catch(err =>{
          console.log('Error publishing the Data: ',err);
        })
      const savefound = await Save.findOne({pageid: req.body.index.index});
      if(savefound)
      {
        console.log("Hi");
        await savefound.updateOne({items: req.body.newItems})
          .then(updatedInstance => {
            console.log('Data updated successfully: ',updatedInstance);
          })
          .catch(err => {
            console.log('Failed Updating Data: ',err);
          })
        res.send(200);
      }
      else
      {
        console.log(req.body);
        const NewSave = new Save({
          pageid: req.body.index.index,
          items: req.body.newItems
        });
        await NewSave.save()
          .then(savedInstance => {
            console.log('Data saved successfully: ',savedInstance);
          })
          .catch(err =>{
            console.log('Error saving the Data: ',err);
          })
        res.end(200);
      }
    }
  } catch (error){
    console.log('Error publishing the Data: ',error);
    res.send(500);
  }
})

app.post('/api/save-edit',async (req,res) => {
  console.log(req.body.index.index);
  try{
    const found = await Save.findOne({pageid: req.body.index.index});
    if(found)
    {
      console.log("Hi");
      await found.updateOne({items: req.body.newItems})
        .then(updatedInstance => {
          console.log('Data updated successfully: ',updatedInstance);
        })
        .catch(err => {
          console.log('Failed Updating Data: ',err);
        })
      res.send(200);
    }
    else
    {
      console.log(req.body);
      const NewSave = new Save({
        pageid: req.body.index.index,
        items: req.body.newItems
      });
      await NewSave.save()
        .then(savedInstance => {
          console.log('Data saved successfully: ',savedInstance);
        })
        .catch(err =>{
          console.log('Error saving the Data: ',err);
        })
      res.sendStatus(200);
    }
  } catch (error){
    console.log('Error saving the Data: ',error);
    res.sendStatus(500);
  }
})

app.get('/api/main-pages',async (req,res) => {
  try {
    const MainPages = Page.find({mainpage: true},{_id : 0 , title : 1,status : 1,index : 1,subidS : 1})
      .then((result)=>{
        res.status(200).json(result)
      })
      .catch((err)=>{
        console.log(err);
        res.status(404);
        res.end();
      });
  } catch(error) {
    console.log(error);
    res.status(404);
    res.end();
  }
});

app.get('/api/pages/:index', async (req, res) => {
  try {
    const index  = req.params.index; // Access the index parameter from the route
    const pageIndex = parseInt(index, 10); // Convert to integer if necessary
    // Assuming `index` is stored as a number; adjust the query accordingly
    const page = await Page.findOne({ index: pageIndex });
    if (!page) {
      return res.status(404).json({ error: 'No page content found for the given index' });
    }
    const subpages = await Page.find({index : {$in: page.subidS}},{_id : 0 ,title : 1,status : 1,index : 1,subidS : 1});
    // Respond with the found page
    console.log(subpages);
    res.status(200).json(subpages);
  } catch (error) {
    console.error('Error fetching Page:', error);
    res.status(500).json({ error: 'Failed to fetch Page' });
  }
});

app.post('/api/add-new',async (req,res)=>{
  if (req.body.index == 0)
  {
    const found = await Page.findOne({title : req.body.title});
    if(!found)
    {
      const RecentOne = await Page.findOne().sort({createdAt: -1});
      const newPage = new Page({
        title: req.body.title,
        index: RecentOne.index + 1,
        status: true,
        mainpage: req.body.mainpage,
        subidS: []
      });
      newPage.save()
      .then(()=>{
        console.log("Added page to the database");
      })
      .catch((err)=>{
        console.log(err);
      })
      res.status(200).json({ newindex: newPage.index, newtitle: newPage.title });
    } else {
      res.status(200).json({newindex : -1});
    }
  }
  else
  {
    console.log(req.body.title);
      const parentPage = await Page.findOne({index : req.body.index});
      console.log(parentPage);
      if (parentPage)
      {
        const children = await Page.find({ index: {$in: parentPage.subidS}, title: req.body.title});
        if(children.length == 0){
          console.log(children);
          const RecentOne = await Page.findOne().sort({createdAt: -1});
          const newPage = new Page({
          title: req.body.title,
          index:  RecentOne.index + 1,
          status: true,
          mainpage: req.body.mainpage,
          parentid: req.body.index,
          subidS: []
          });
          newPage.save()
              .then(async()=>{
              console.log("Added page to the database");
              console.log(newPage.index);
              await parentPage.updateOne({$push: {subidS: newPage.index}});
              })
              .catch((err)=>{
              console.log(err);
              })
          res.status(200).json({newindex: newPage.index});
      }
      else{
        res.status(200).json({newindex: -1});
      }
    }
      else{
          console.log("Parent Page Not Found");
          res.status(404).json({error:"Invalid Request"});
      }
  }
});

app.post('/api/delete',async (req,res)=>{
  try{
    const found = await Page.findOne({index : req.body.index});
    if (!found) {
      return res.status(404).json({ error: 'Page not found' });
    }
    console.log(found.subidS);
    for (const subid of found.subidS) {
      await Page.findOneAndDelete({index : subid});
      await Save.findOneAndDelete({pageid : subid});
      await Publish.findOneAndDelete({pageid: subid});
    }
    const value = await Page.findOneAndDelete({index : req.body.index});
    await Save.findOneAndDelete({pageid :req.body.index});
    await Publish.findOneAndDelete({pageid: req.body.index});
    if (found.parentid) {
      const parentPage = await Page.findOne({ index: found.parentid });
      if (parentPage) {
        parentPage.subidS = parentPage.subidS.filter(id => id !== req.body.index);
        await parentPage.save();
      }
    }
    console.log(value);
    res.status(200).json({success: "Page Deleted Successfully"});
  }catch (error){
    console.error('Error deleting Page:', error);
    res.status(500).json({ error: 'Failed to Delete Page' });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



