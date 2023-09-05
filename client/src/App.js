import { Routes, Route } from "react-router-dom";

import Search from "./components/Search";
import Display from "./components/Display";
import SavedItems from "./components/SavedItems";

function App() {
    return (
        <>
            <Search />
            <Routes>
                <Route exact path="/" element={<Display />} />
                <Route path="/saved-items" element={<SavedItems />} />
            </Routes>
        </>
    );
}

export default App;
