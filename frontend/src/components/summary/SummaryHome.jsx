import React from 'react';
import Top10 from "./Top10";
import {tabContent} from "../../styles/ContainerStyles";

const SummaryHome = () => {
    return (
        <div style={tabContent}>
            <Top10/>
        </div>
    );
};

export default SummaryHome;