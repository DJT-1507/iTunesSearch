//import react functions and link from react router
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//import the saved card file so we can pass info as props into it
import SavedCard from "./card/SavedCard";

//import bootstrap components
import { Container, Row, Col, Alert } from "react-bootstrap";

function SavedItems() {
    //state variable to hold the saved data in
    const [savedData, setSavedData] = useState([]);

    useEffect(() => {
        //as there is nothing the pass into the api call, and there will always be data returned (even if just an empty array) I
        //rely on the catch statement to log any server issue errors to the console
        async function getSavedItems() {
            try {
                const apiFetch = await fetch("/getSavedData", { method: "GET" });
                const response = await apiFetch.json();
                if (apiFetch.status === 200) {
                    setSavedData(response);
                }
            } catch (error) { console.log(error); }
        }
        //call the async function
        getSavedItems();
    }, [savedData]);

    //function to display a message if the savedData variable is empty, or to map through the data and pass data into the 
    //savedCard file as props. As the data has already been saved how I want it, there is no need for if statement
    //or ternary operators to decide what info to display
    function displayData() {
        if (savedData.length === 0) {
            return (
                <Col lg="6">
                    <Alert variant="info" className="text-center">You do not have any saved items.</Alert>
                </Col>
            );
        } else {
            return savedData.map(item => {
                return (<SavedCard key={item.itemId}
                    id={item.itemId}
                    cardType={item.itemType}
                    title={item.itemTitle}
                    artistName={item.itemArtist}
                    image={item.itemImage}
                    price={item.itemPrice} />);
            });
        }
    }

    //code to display all data, self explanatory
    return (
        <section id="displaySection">
            <Container>
                <Row>
                    <Col xs="6">
                        <h1>Saved Items:</h1>
                    </Col>
                    <Col xs="6" className="text-end">
                        <Link to="/" style={{ display: "inline-block" }}><h1>Search Results</h1></Link>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        Song: <i className="bi bi-square square-song"></i>, Album: <i className="bi bi-square square-album"></i>,
                        Podcast: <i className="bi bi-square square-podcast"></i>, Audio Book: <i className="bi bi-square square-audioBook"></i>,
                        eBook: <i className="bi bi-square square-ebook"></i>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    {displayData()}
                </Row>
            </Container>
        </section>
    );
}

export default SavedItems;
