//import react functional components, useselector for redux and link from react router
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//import the search card to pass the info into from the search api call
import SearchCard from "./card/SearchCard";

//import bootstrap components
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

//react component
function Display() {
    //state variable that holds the data pulled from the iTunes search api
    const [displayData, setDisplayData] = useState([]);

    //redux state values
    const loadingState = useSelector((state) => state.loading.value);
    const searchError = useSelector((state) => state.searchError.value);

    //api call to fetch the search data inside a useeffect so the display re-renders every time a new search is made as the search
    //component is in it's own file
    useEffect(() => {
        //as there is nothing the pass into the api call, and there will always be data returned (even if just an empty array) I
        //rely on the catch statement to log any server issue errors to the console
        async function fetchData() {
            try {
                const apiFetch = await fetch("/getData", {
                    method: "GET"
                });
                const response = await apiFetch.json();
                if(apiFetch.status === 200) {
                    setDisplayData(response);
                }
            } catch (error) {
                console.log(error);
            }
        }
        //call the async function
        fetchData();
    }, [displayData]);

    //function to limit the number of characters displayed, enables the styling to stay consistant on all devices across all cards
    function limitChars(text) {
        if (text.length > 30) {
            return text.slice(0, 27) + "...";
        } else {
            return text;
        }
    }

    //function to display the search data cards, or a loading spinner based on global loading variable.
    function displayCards() {
        if (loadingState) {
            return (
                <Col className="text-center">
                    <Spinner animation="border" variant="info" />
                </Col>
            );
        } else {
            //as the iTunes api response differs based on the search type, there are a few if blocks and ternary operators
            //to determine what information to pass as props. I do it this way so there is just one card file, and so it saves
            //coding different card files for different search types
            return displayData.map((item, index) => {
                let wrapper = item.wrapperType;
                let price;

                if (wrapper === "track" || !wrapper) {
                    wrapper = item.kind
                }

                if (wrapper === "audiobook" || wrapper === "collection") {
                    price = item.collectionPrice
                } else if (wrapper === "ebook") {
                    price = item.price;
                } else {
                    price = item.trackPrice;
                }

                return (<SearchCard key={index}
                    cardType={wrapper}
                    artistName={limitChars(item.artistName)}
                    trackName={wrapper === "song" || wrapper === "podcast" || wrapper === "ebook" ? limitChars(item.trackName) : ""}
                    collectionName={wrapper === "audiobook" || wrapper === "collection" ? limitChars(item.collectionName) : ""}
                    image={item.artworkUrl100}
                    currency={item.currency}
                    price={price} />);
            });
        }
    }

    return (
        <section id="displaySection">
            <Container>
                <Row>
                    <Col xs="6">
                        <h1>Search Results:</h1>
                    </Col>
                    <Col xs="6" className="text-end">
                        <Link to="/saved-items" style={{ display: "inline-block" }}><h1>Saved Items</h1></Link>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        Song: <i className="bi bi-square square-song"></i>, Album: <i className="bi bi-square square-album"></i>,
                        Podcast: <i className="bi bi-square square-podcast"></i>, Audio Book: <i className="bi bi-square square-audioBook"></i>,
                        eBook: <i className="bi bi-square square-ebook"></i>
                    </Col>
                </Row>
                {/* if the global searchError state is true then display an error message, if false then call the function to display
                either the loading wheel or the search results */}
                <Row className="justify-content-center">
                    {searchError ? (
                        <Col lg="6">
                            <Alert variant="danger">
                                There seems to have been an error, please try searching again!
                            </Alert>
                        </Col>
                    ) : displayCards()}
                </Row>
            </Container>
        </section>
    );
}

export default Display;
