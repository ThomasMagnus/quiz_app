import React, {Component} from "react";

class Main extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <main className="main">
                <div className="container">
                    {this.props.children}
                </div>
            </main>
        )
    }
}


export default Main
