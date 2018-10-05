import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const styles = {
    buttonProgress: {
        position: 'absolute',
    },
};

class ProgressButton extends Component {
    state = {
        loading: false,
        success: false,
    };

    handleButtonClick = this.handleButtonClick.bind(this);
    handleButtonClick() {
        if (!this.state.loading) {
            this.setState(
                {
                    success: false,
                    loading: true,
                },
                () => {
                    this.props.onClick().then( 
                        d => this.setState({success: true, loading: false})
                    ).catch(e => {
                        console.log(e);
                        this.setState({ success: true, loading: false });
                    });
                },
            );
        }
    };

    render() {
        const loading = this.state.loading;
        const classes = this.props.classes;

        return (
            <div className={classes.wrapper}>
                <Button
                    variant={this.props.variant}
                    color={this.props.color}
                    className={this.props.className}
                    disabled={this.props.disabled || loading}
                    onClick={this.handleButtonClick}
                >
                    {this.props.buttonText}
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
        );
    }
}

export default withStyles(styles)(ProgressButton);