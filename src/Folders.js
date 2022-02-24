import "./Folder.scss";
import React from "react";

export default class Folders extends React.Component {
    constructor(props) {
        super(props);
        this.folderArray = [];
        fetch('localhost').then(res => {
            console.log(res);
        });
    }
    render() {
        return (
            <div className="Folders">
                <p id="FolderLabel">Mappák helye</p>
            </div>
        );
    }
}