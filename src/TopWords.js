import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardActions';
import CardActions from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';

// table stuff
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import { TablePagination, Typography, Paper } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

class TopWords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page : 0,
            payload : 'none',
        }

        this.getTopicPayload = this.getTopicPayload.bind(this);
        this.makeTable = this.makeTable.bind(this);

    }

    componentDidMount() {
        this.getTopicPayload(this.state.page);
    }
    
    getTopicPayload(topic) {
        topic = topic % this.props.numberOfTopics;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "https://eebo-api.herokuapp.com/topic?topic=".concat(String(topic)); // site that doesn’t send Access-Control-*
        fetch(proxyurl + url) // 
            .then(response => response.text())
            .then(contents => this.setState({payload : JSON.parse(contents)}))
            .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    }

    makeTable(payload) {
        return( 
            <Paper style={{overflowX: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {Object.keys(payload).map( (key) => {
                                return (<TableCell> {key} </TableCell>);
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(15).keys()].map( (index) => {
                            return (
                                <TableRow key={index}>
                                    {Object.keys(payload).map( (key) => {
                                        return (<TableCell>
                                            {payload[key][index]}
                                        </TableCell>)
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        )
    }

    handlePageChange(page, direction) {
        page = (page + this.props.numberOfTopics) % this.props.numberOfTopics;
        if (direction === -1) {
            this.setState({page: (page - 1 + this.props.numberOfTopics) % this.props.numberOfTopics})
            this.getTopicPayload( (page - 1 + this.props.numberOfTopics) % this.props.numberOfTopics);
        } else {
            this.setState({page: (page + 1 + this.props.numberOfTopics) % this.props.numberOfTopics})
            this.getTopicPayload( (page + 1 + this.props.numberOfTopics) % this.props.numberOfTopics);
        }
        console.log(this.state.page);
    }

    render() {
        var payloadTable = this.makeTable(this.state.payload);
        return (
            <div>
                <Card >
                    <CardHeader title={"Topic View"} />
                    <CardActions>
                        <div style={{'flex-direction':'row','display': 'inline-flex'}}>
                            <IconButton>
                                <KeyboardArrowLeft 
                                    onClick={() => {this.handlePageChange(this.state.page, -1)}}
                                    disabled={(this.state.page === 0)}
                                />
                            </IconButton>
                            <Typography>{"Topic ".concat(String(this.state.page))}</Typography>
                            <IconButton>
                                <KeyboardArrowRight 
                                    onClick={() => {this.handlePageChange(this.state.page, 1)}}
                                    disabled={(this.state.page === 18)}
                                />
                            </IconButton>
                        </div>
                    </CardActions>
                    <CardContent>
                        {payloadTable}
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default TopWords;