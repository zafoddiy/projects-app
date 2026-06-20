'use strict';

var React = require('react')
var Field = require('./src')

require('./index.styl')

var VALUE = 'xxx'

var App = React.createClass({

    onChange: function(value,props, e){
        VALUE = value
        console.log(value, e);
        this.setState({})
    },



    render: function() {

        var style = {
            width: '50%'
        }

        function validate(value, props, x){
            return x.isEmpty(value)
        }

        function focus(v, e){
            console.log('focused', v, e);
        }

        // <Field placeholder="x" style={style} label='First Name' value={VALUE} onChange={this.onChange}/>

        var ct = <span>xxx</span>

        return (
            <div className="App" style={{padding: 10}}>
                <Field name="AAA" dixsabled={true} placeholder="test" clearTool={ct} validate={validate} style={style} defaultValue={VALUE} onChange={this.onChange}/>
            </div>
        )
    }
})

React.render(<App />, document.getElementById('content'))