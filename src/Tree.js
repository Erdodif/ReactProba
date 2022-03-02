import "./Tree.scss";
import React from "react";

export default class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "http://pages.localhost/list.php",
            files: [],
            folders: [],
        };
    }

    componentDidMount() {
        this.setItems();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.url !== this.state.url) {
            this.setItems();
        }
    }

    setItems() {
        fetch(this.state.url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            const fileArray = [], folderArray = [];
            for (const folder of data.folders) {
                folderArray.push({ label: folder });
            }
            for (const file of data.files) {
                fileArray.push({ label: file });
            }
            this.setState({ files: fileArray, folders: folderArray });
        })
            .catch(error => {
                console.error(error);
                this.onUrlReversed();
            });
    }

    onUrlChanged(link) {
        let url = this.state.url;
        if (!url.includes('?')) {
            url = url + "?path=";
        }
        else {
            url = url + "/";
        }
        this.setState({ url: url + link });
    }

    getUrlBasePath(url) {
        let splitted = url.split("?path=");
        return splitted[0];
    }

    getUrlExtension(url) {
        let splitted = url.split("?path=");
        if (splitted[1] === undefined || splitted[1] === null || splitted[1] === '') {
            return '';
        }
        return splitted[1];
    }

    getUrlReserved(url) {
        let subFolders = url.split('/');
        let urlExtension = "";
        for (let i = 0; i < subFolders.length - 1; i++) {
            urlExtension += subFolders[i]
            if (i < subFolders.length - 2) {
                urlExtension += "/";
            }
        }
        return urlExtension;
    }

    onUrlReversed() {
        let baseUrl = this.getUrlBasePath(this.state.url);
        let urlAfter = this.getUrlExtension(this.state.url);
        console.log(baseUrl);
        console.log(urlAfter);
        if (urlAfter !== '') {
            let urlExtension = this.getUrlReserved(urlAfter);
            this.setState({ url: baseUrl + "?path=" + urlExtension });
        }
        else {
            this.setState({ url: baseUrl });
        }
    }

    openFile(fileName) {
        console.log(this.state.url);
        fetch(this.getUrlBasePath(this.state.url) + "?getpos=true", {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            headers: {
                'Accept': 'application/json'
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            let fullUrl = `http://pages.localhost/${this.getUrlExtension(this.state.url)}/${fileName}`;
            console.log(fullUrl);
            window.open(fullUrl, "_self");
        })
    }

    render() {
        return (
            <div className="Tree">
                <div className="navigate">
                    <p onClick={() => { this.onUrlReversed() }}>
                        Vissza
                    </p>
                </div>
                <div className="Folders">

                    {this.state.folders.map((elem) => <Folder label={elem.label} setUrl={() => { this.onUrlChanged(elem.label) }} />)}
                </div>
                <div className="Files">

                    {this.state.files.map(elem => <File label={elem.label} followUrl={() => { this.openFile(elem.label) }} />)}
                </div>
            </div>
        );
    }
}

class Folder extends React.Component {

    render() {
        const { label, setUrl } = this.props;
        return (
            <div className="Folder" onClick={setUrl}>
                <p>{label}</p>
            </div>
        );
    }
}

class File extends React.Component {
    render() {
        const { label, followUrl } = this.props;
        return (
            <div className="File" onClick={followUrl}>
                <p>{label}</p>
            </div>
        );
    }
}