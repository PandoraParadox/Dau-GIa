import { Outlet } from "react-router-dom";
import Header from "./../default/Header";
import Footer from "./../default/Footer";
import { useState } from "react";

function LayoutDefault() {
    const [filter, setFilter] = useState({ category: "", type: null, sort: "" });
    const [search, setSearch] = useState("");
    return (
        <>
            <Header setFilter={setFilter} setSearch={setSearch} />
            <Outlet context={{ filter, search }} />
            <Footer />
        </>
    );
}

export default LayoutDefault;
