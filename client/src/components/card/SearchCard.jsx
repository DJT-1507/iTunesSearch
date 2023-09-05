//import react useState functionality
import { useState } from "react";
//import bs components
import { Col, OverlayTrigger, Tooltip, ToastContainer, Toast } from "react-bootstrap";

//function for displaying the searched item cards - takes in info as props
function DisplayCard(props) {
    //state variable to display the save button
    const [showSaveBtn, setShowSaveBtn] = useState("none");

    //state variables and toggle functions for showing the toasts that say an item has been saved or the item is already saved
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);
    const toggleShowSuccess = () => setShowSuccessToast(!showSuccessToast);
    const toggleShowWarning = () => setShowWarningToast(!showWarningToast);

    //declare variables for outputting price and the title of the item
    let price = "";
    let title = "";

    //async function for saving an item
    async function handleSaveItem() {
        const itemData = {
            itemType: props.cardType,
            itemImage: props.image,
            itemTitle: title,
            itemArtist: props.artistName,
            itemPrice: price
        }
        try {
            const apiFetch = await fetch("/saveItem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itemData)
            })
            const response = await apiFetch.json();
            //if the api res status is 201 show a success toast, if it is 200 show an already saved toast, any other error log to the
            //console as it is out of the scope of the api call. There will always be data passed into the api call as it is passed
            //from the props of the current item in the body of the api call
            if (apiFetch.status === 201) {
                toggleShowSuccess();
            } else if (apiFetch.status === 200) {
                toggleShowWarning();
            }
        } catch (error) { console.log(error) }
    }

    //show the currency symbol for the available search countries with the price, no formatting need on price as it is pulled from
    //the search api call already formatted
    if (props.currency === "GBP") {
        price = "£";
    } else if (props.currency === "USD") {
        price = "US$";
    } else {
        price = "R";
    }
    price += props.price;

    //display the title of the item, the search api call has different keys for different search type
    if (props.cardType === "audiobook" || props.cardType === "collection") {
        title = props.collectionName;
    } else {
        title = props.trackName;
    }

    //code for displaying the item, same basis as described in SavedCard.jsx just with the toasts added. the toasts are displayed
    //based on the api response code
    return (
        <>
            <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 5 }}>
                <Toast bg="success" show={showSuccessToast} delay={3000} onClose={toggleShowSuccess} autohide>
                    <Toast.Body className="text-center" style={{ fontWeight: "bold", color: "#FFF" }}>Item Saved!</Toast.Body>
                </Toast>
                <Toast bg="warning" show={showWarningToast} delay={3000} onClose={toggleShowWarning} autohide>
                    <Toast.Body className="text-center" style={{ fontWeight: "bold" }}>Item already saved!</Toast.Body>
                </Toast>
            </ToastContainer>

            <Col lg="3">
                <div className={`itemCard ${props.cardType} p-2 mb-4`} onMouseOver={() => setShowSaveBtn("inline-block")} onMouseOut={() => setShowSaveBtn("none")}>
                    <div className="saveIcon" style={{ display: showSaveBtn }} onClick={handleSaveItem}>
                        <OverlayTrigger overlay={<Tooltip>Save Item</Tooltip>}>
                            <i className="bi bi-save2-fill"></i>
                        </OverlayTrigger>
                    </div>
                    <img src={props.image} alt={title} />
                    <h3>{title}</h3>
                    <p>{props.artistName}</p>
                    <p>{price}</p>
                </div>
            </Col>
        </>
    );
}

export default DisplayCard;
