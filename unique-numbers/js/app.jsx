/**
 *   Renders the Input components - A input box to accept the numbers 
 **/
var InputComponent = React.createClass({

    render: function() {
        return (
            <div className="input-component">
                <div className="common-text">Enter Numbers:</div> 
                <div className="common-text">
                    <input onKeyUp = {this._keyUpHandler} ></input>
                </div>
                <div className="incorrect-input">Incorrect Input</div>
            </div>
        );
    },

    /**
     *   Handler for key up event on the input box
     **/
    _keyUpHandler: function(event) {
        this.props.sendChange(event.target.value);
    }
});

/**
 *   Renders the Output components - Displays the Unique, New and Duplicate values after processing
 **/
var OutputComponent = React.createClass({

    render: function() {
        return (
            <div className="output-component">
                <div className="original-values">
                    <div className="common-text">Unique Values:</div> 
                    <div className="common-text">{ _.unique(this.props.originalValues.concat(this.props.userValues)).sort().join() }</div>
                </div>
                <div className="new-values">
                    <div className="common-text">New Values: </div> 
                    <div className="common-text">{ this.props.newValues.join() }</div> 
                </div>
                <div className="duplicate-values">
                    <div className="common-text">Duplicate Values:</div> 
                    <div className="common-text">{ _.unique(this.props.duplicateValues).join() }</div> 
                </div>
            </div>
        );
    }
});

/**
 *   Main App Component
 **/
var AppComponent = React.createClass({

    render: function() {
        return (
            <div className="app-container">
                <InputComponent sendChange={ this._updateValues } /> 
                <hr/>
                <OutputComponent 
                    originalValues = { this.state.originalValues }
                    duplicateValues = { this.state.duplicateValues }
                    newValues = { this.state.newValues }
                    userValues = { this.state.userValues } />
            </div>
        );
    },

    /**
     *   Change handler which handles the new input value
     **/
    _updateValues: function(newValue) {
        if (this._isValidInput(newValue)) {
            this._processValue(newValue);
            this.forceUpdate();
        }
    },

    /**
     *   Checks for a valid input using the regex
     **/
    _isValidInput: function(value) {
        //Check for single values, multiple values 
        //separated by comma and ranges eg:- 10, 10-20 
        var regex = /^(\d+(-\d+)*)+(,\d+(-\d+)*)*$/,
            isValid = regex.test(value);
        document.getElementsByClassName('incorrect-input')[0].style.display = isValid ? "none" : "inline-block";
        return isValid;
    },

    /**
     *  Checks if the new value contains any input with range
     *  And fills the final array based on which the state values are calculated
     **/
    _processValue: function(value) {
        var arrValue = value.split(','),
            splitArr = null,
            rangeArr = null,
            from,
            to;

        for (var i = 0; i < arrValue.length; i++) {
            //Check if it is a range and if present then remove the input value from the array
            //And add the range including both ends to the main array

            if (arrValue[i].indexOf('-') > -1) {
                splitArr = arrValue[i].split('-');
                arrValue.splice(i, 1);
                from = parseInt(splitArr[0]);
                to = parseInt(splitArr[1]) + 1;

                if (to - 1 > from) {
                    rangeArr = _.range(from, to);
                    _.map(rangeArr, function(num) {
                        arrValue.splice(i, 0, num.toString());
                    });
                    i += rangeArr.length - 1;
                }
            }
        }

        this._setValues(arrValue);
    },

    /**
     *  Sets the unique , duplicate and newly added values in the state
     **/
    _setValues: function(arrValue) {
        var arrOriginal = this.state.originalValues,
            //Finds the duplicates if any in the input itself and adds it to the repeated list
            repeatedValues = _.intersection(arrOriginal, arrValue).concat(this._getDuplicate(arrValue)),
            newlyAddedValues = _.difference(arrValue, repeatedValues);

        //Sets all the state values after processing
        this.setState({
            duplicateValues: repeatedValues,
            userValues: _.unique(arrValue),
            newValues: newlyAddedValues
        });

    },

    /**
     *  Method which returns an array of duplicate values from an input array
     **/
    _getDuplicate: function(arrValue) {
        //Finds the duplicate values in an array
        var sortedArr = arrValue.sort(),
            arrLength = sortedArr.length,
            results = [];

        for (var i = 0; i < arrLength - 1; i++) {
            if (sortedArr[i] === sortedArr[i + 1]) {
                results.push(sortedArr[i]);
            }
        }
        return results;
    },

    /**
     *   Sets the initial state of all the arrays used in the state
     **/
    getInitialState: function() {
        return {
            originalValues: ['7000', '7001', '7002', '7003', '7004', '7005'], //Initial List of Values
            newValues: [],
            duplicateValues: [],
            userValues: []
        };
    }
});

React.render(<AppComponent />,
    document.getElementById('container')
);
