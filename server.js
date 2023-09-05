//require express, path and file system
const express = require("express");
const fs = require("fs");
const path = require("path");
//create an instance of express server and define the port
const app = express();
const PORT = process.env.PORT || 8080;

//require body parser so data can be pass in body of api calls
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//class for adding a new saved item
class NewSaveItem {
    constructor(itemId, itemType, itemImage, itemTitle, itemArtist, itemPrice) {
        this.itemId = itemId;
        this.itemType = itemType;
        this.itemImage = itemImage;
        this.itemTitle = itemTitle;
        this.itemArtist = itemArtist;
        this.itemPrice = itemPrice;
    }
}

//function to either retrieve the searchResults data, or create a new file and initalise with empty array
function getSearchData() {
    try {
        const searchData = fs.readFileSync("searchResults.json");
        return JSON.parse(searchData);
    } catch (error) {
        fs.writeFileSync("searchResults.json", "[]");
        return [];
    }
}

//function to either retreive the savedData data, or create a new file and initialise with empty array
function getSavedData() {
    try {
        const savedData = fs.readFileSync("savedData.json");
        return JSON.parse(savedData);
    } catch (error) {
        fs.writeFileSync("savedData.json", "[]");
        return [];
    }
}

//when a new search is submitted, we call this function to clear the searchResults file so that the new data can be stored in there
function clearSearchResults() {
    fs.writeFileSync("searchResults.json", "");
    return;
}

//GET the data stored in the searchResults.json file no verification needed as something will alway be returned even if just
//empty array
app.get("/getData", (req, res) => {
    const data = getSearchData();
    res.status(200).json(data);
});

//GET the data stored in savedData.json file. same as above
app.get("/getSavedData", (req, res) => {
    const savedData = getSavedData();
    res.status(200).json(savedData);
});

//POST new search data to searchResults.json. No checks needed as data is passed in the body of the request and this will only be ran
//if the iTunes API call returns data
app.post("/searchData", (req, res) => {
    //clear json file as above
    clearSearchResults();
    //get data and save file
    const data = req.body.results;
    fs.writeFileSync("searchResults.json", JSON.stringify(data));
    //repond code 201 to say req received and action taken
    res.status(201).json("Success");
});

//POST new data to the savedData.json file
app.post("/saveItem", (req, res) => {
    //get the file, and the data passed in the body of the API call, store in variables
    const savedData = getSavedData();
    const [type, image, title, artist, price] = [req.body.itemType, req.body.itemImage, req.body.itemTitle, req.body.itemArtist, req.body.itemPrice];

    //array.some function to see if the item has already been saved. this will return truthy if any of the conditions are met
    const alreadySaved = savedData.some((item) =>
        item.itemType === type && item.itemTitle === title && item.itemArtist === artist);

    //if array.some is truth give response of 200 to say req received, but no action taken
    if (alreadySaved) {
        res.status(200).json("Already saved");
    } else {
        //if array.some is false then give the new item a unique id. this gets the id of the last saved item (if there is one) and then
        //adds 1 to it. If there is no saved item then it will be given an id 1. This prevents multiple entries having the same id
        const getLastId = savedData.length > 0 ? savedData[savedData.length - 1].itemId : 0
        const id = getLastId + 1;
        //push the new saved item details to the array and then save the array
        savedData.push(new NewSaveItem(id, type, image, title, artist, price));
        fs.writeFileSync("savedData.json", JSON.stringify(savedData));
        //repond with status 201 to say req received, action taken
        res.status(201).json("Success");
    }
});

//DELETE an item from the savedData.json
app.delete("/deleteSaved", (req, res) => {
    //get the json file and the id to delete, store in variables
    const savedData = getSavedData();
    const idToDelete = req.body.id;

    //not really needed as there will always be data passed into the api call, but if no id respond status 200 req received, no action
    if (!idToDelete) {
        res.status(200).json("No ID specified");
    } else {
        //get the index of the item in the array based of the unique itemId
        const indexOfItem = savedData.findIndex((item) => item.itemId === idToDelete);
        //again not really needed as the user has no direct access to the ID and the data is always passed in the body of all the
        //api calls but respond status 200
        if (indexOfItem === -1) {
            res.status(200).json("Couldn't find item");
        } else {
            //respond status 201, req received action taked. splice the item from the array and the saved the new array to the file
            res.status(201).json("Success");
            savedData.splice(indexOfItem, 1);
            fs.writeFileSync("savedData.json", JSON.stringify(savedData));
        }
    }
});

//point to the public files
app.use(express.static(path.join(__dirname + "/public")));

//app listen on port specified
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});