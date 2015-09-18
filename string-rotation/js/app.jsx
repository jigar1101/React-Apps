/**
 *   Renders the Input components - Two Input boxes to accept strings
 **/
var InputComponent = React.createClass({
    render: function() {
        return (
            <div className="input-component">
                <div>
                    <div className="common-text left-side-text">Enter First String: </div>
                    <div className="common-text">
                        <input onKeyUp = {this._keyUpHandler.bind(this,'string1')} ></input> 
                    </div>
                </div>
                <br/>
                <div>
                    <div className="common-text left-side-text">Enter Second String: </div>
                    <div className="common-text">
                        <input onKeyUp = {this._keyUpHandler.bind(this,'string2')} ></input> 
                    </div>
                </div>
            </div>
        );
    },

    /**
     *   Handler for key up event on the input boxes
     **/
    _keyUpHandler: function(stringType, event) {
        this.props.sendChange(stringType, event.target.value);
    }
});


/**
 *   Renders the main app component
 **/
var AppComponent = React.createClass({

    render: function() {
        return (
            <div className="app-container">
                <InputComponent sendChange = { this._updateValues } /> 
                <hr/>
                <div className="output-component">
                    <div className="common-text left-side-text">Is Rotated : </div>
                    <div className="common-text">{ this._checkIfRotated() }</div>
                </div>
            </div>
        );
    },

    /**
     *   Updates the state values of the string based on the type of string
     **/
    _updateValues: function(stringType, value) {
        var change = {};
        change[stringType] = value;
        this.setState(change);
    },

    /**
     *   Sets the initial state of the strings
     **/
    getInitialState: function() {
        return {
            string1: '',
            string2: ''
        };
    },

    /**
     *   Logic to check if the string is rotated or not
     **/
    _checkIfRotated: function() {
        var str1 = this.state.string1,
            str2 = this.state.string2;
        return (str1.length > 1 && //Check if empty or single letter string cases where rotation is not present
                str2.length > 1 &&
                str1.length === str2.length && // Check if both strings have equal length to process further 
                str1.indexOf(str2) !== 0 && //Check if both the strings are not the same as rotation is not possible
                (str1.concat(str1)).indexOf(str2) > -1) //If second string is present in the newly concatenated string then it is rotated 
            ? 'Yes' : 'No';
    }
});

React.render(<AppComponent />,
    document.getElementById('container')
);
