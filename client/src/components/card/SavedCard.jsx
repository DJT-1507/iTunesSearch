//import react state function
import { useState } from "react";

//import styles from bootstrap
import { Col, OverlayTrigger, Tooltip } from "react-bootstrap";

//react function for "card" to display saved items, info passed in as props
function SavedCard(props) {
    //state variable to show/hide the delete btn
    const [showDeleteBtn, setShowDeleteBtn] = useState("none");

    //async function to handle the item delete from saved items. As the id is passed into the body of the api call based off the 
    //savedData.json data, I just log any errors to the console as the DOM is reloaded as soon as the call is made meaning no
    //output is visible
    async function handleDeleteItem(idToDelete) {
        try {
            const apiFetch = await fetch("/deleteSaved", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: idToDelete })
            });
            const response = await apiFetch.json();
        } catch (error) { console.log(error); }
    }

    //code for displaying the item. card border colour based on the type of item saved. use onMouseOver and onMouseOut to show/hide
    //the delete button with bootstrap tooltip
    return (
        <Col lg="3">
            <div className={`itemCard ${props.cardType} p-2 mb-4`} onMouseOver={() => setShowDeleteBtn("inline-block")} onMouseOut={() => setShowDeleteBtn("none")}>
                <div className="deleteIcon" style={{ display: showDeleteBtn }} onClick={() => handleDeleteItem(props.id)}>
                    <OverlayTrigger overlay={<Tooltip>Delete Item</Tooltip>}>
                        <i className="bi bi-trash-fill"></i>
                    </OverlayTrigger>
                </div>
                <img src={props.image} alt={props.title} />
                <h3>{props.title}</h3>
                <p>{props.artistName}</p>
                <p>{props.price}</p>
            </div>
        </Col>
    );
}

export default SavedCard;
