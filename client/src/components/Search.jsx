//import what I need from react, react router and redux as well as the actions for controlling global state
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setLoaded } from "../store/actions/loading";
import { setError, removeError } from "../store/actions/searchError";

//import bootstrap components
import { Container, Row, Col, FloatingLabel, Form, Button } from "react-bootstrap";

function Search() {
    //state variables for input fields
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("ZA");
    const [selectedLimit, setSelectedLimit] = useState(4);
    const [entityType, setEntityType] = useState("song");

    //state variable for holding the results of the search api call
    const [searchResults, setSearchResults] = useState([]);

    //create instance of dispatch and get the state values for loading and search error
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.loading.value);
    const searchError = useSelector((state) => state.searchError.value);

    //function to clear all inputs/selects to default/empty
    function clearSearch() {
        setSearchTerm("");
        setSelectedCountry("ZA");
        setSelectedLimit(4);
        setEntityType("song");
    }

    //I was having issues with the error message still displaying when there was no need to so I moved it into it's own useEffect
    //and added the cleanup function
    useEffect(() => {
        //in this use effect, I add a timeout to the loading state for 7 seconds, and if that passes then I will update the
        //searchError to true. When this is true, it prevents react from throwing an error and also enables me to have a 
        //nice UI even in the event of a searchError (this could be something such as the iTunes API not responding quick enough
        //or just an error in the iTunes search API)
        let loadingTimeout;

        if (loading === true) {
            loadingTimeout = setTimeout(() => {
                dispatch(setError());
            }, 7000);
        } else {
            clearTimeout(loadingTimeout);
            dispatch(removeError());
        }

        //cleanup function to remedy the issue of error message showing when not needed
        return () => clearTimeout(loadingTimeout);
        //add dispatch to the dependancy array for both useEffects to satisfy eslint warning
    }, [loading, dispatch]);

    //as this useEffect runs when the searchResults variable is populated with data, I don't need a whole host of
    //checks and can rely on the try catch block catching any server errors etc and logging them to the console.
    //when I do get a successful response from the server, I clear the inputs, and change the global state variables
    //to false to stop the loading spinner and to preven the error message showing
    useEffect(() => {
        async function saveSearchResults() {
            try {
                const apiFetch = await fetch("/searchData", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ results: searchResults })
                });
                const response = apiFetch.json();
                if(apiFetch.status === 201) {
                    dispatch(setLoaded());
                    dispatch(removeError());
                    clearSearch();
                }
            } catch(error) { console.log(error) }
        }

        if (searchResults.length > 0) {
            saveSearchResults();
        }
    }, [searchResults, dispatch]);

    //this is the function that handles the iTunes api call, if the searchError global state is true, then we reset the error to false
    //and set the loading global state to true, then we run the api call. The useEffect that has the time out gets started when
    //the loading state is set to true and if a response isn't recieved within 10 seconds then the error state is changed
    async function handleSearchSubmit() {
        if (searchError) {
            dispatch(removeError());
        }
        dispatch(setLoading());

        try {
            const encodedSearch = encodeURI(searchTerm).replace(/%20/g, '+');

            const req = await fetch(`https://itunes.apple.com/search?term=${encodedSearch}&entity=${entityType}&country=${selectedCountry}&limit=${selectedLimit}`, {
                method: "GET"
            });
            const res = await req.json();
            setSearchResults(res.results);
        } catch (error) {
            console.log(error);
        }
    }

    //this is the code that makes up the search section. It is all bootstrap components with some onChange functionality. I
    //have also made it so that when the search button is clicked, it will take you to the Display page to show the results
    //rather than stay on the page the user was on at the time of the search
    return (
        <section id="searchSection">
            <Container>
                <Row>
                    <Col>
                        <h1>Search iTunes:</h1>
                    </Col>
                </Row>
                <Row className="align-items-center">
                    <Col lg="5" className="mb-2 mb-lg-0">
                        <FloatingLabel controlId="searchTerm" label="Search Term">
                            <Form.Control type="text"
                                aria-label="Search Term"
                                placeholder="Search Term"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.currentTarget.value)} />
                        </FloatingLabel>
                    </Col>
                    <Col lg="2" className="mb-2 mb-lg-0">
                        <FloatingLabel controlId="entityType" label="Search Type">
                            <Form.Select aria-label="Search Type"
                                value={entityType}
                                onChange={(e) => setEntityType(e.currentTarget.value)}>
                                <option value="song">Music - Songs</option>
                                <option value="album">Music - Album</option>
                                <option value="podcast">Podcast</option>
                                <option value="audiobook">Audio book</option>
                                <option value="ebook">eBook</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col lg="2" className="mb-2 mb-lg-0">
                        <FloatingLabel controlId="selectCountry" label="Select Country">
                            <Form.Select aria-label="Select Country"
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.currentTarget.value)}>
                                <option value="ZA">South Africa</option>
                                <option value="GB">United Kingdom</option>
                                <option value="US">USA</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col lg="2" className="mb-2 mb-lg-0">
                        <FloatingLabel controlId="setLimit" label="Limit">
                            <Form.Select aria-label="Limit"
                                value={selectedLimit}
                                onChange={(e) => setSelectedLimit(e.currentTarget.value)}>
                                <option value="4">4</option>
                                <option value="8">8</option>
                                <option value="12">12</option>
                                <option value="16">16</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col lg="1" className="d-grid">
                        <Link to="/">
                            <Button variant="outline-success"
                                size="lg"
                                style={{ width: "100%" }}
                                disabled={!searchTerm}
                                onClick={handleSearchSubmit}><i className="bi bi-search"></i></Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default Search;
