import React,{PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import Container from '../Container';
import PropTypes from 'prop-types';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AuthContext from "flexbiz-core/components/auth/Context";
class SetupPage extends PureComponent{
  constructor(props){
    super(props);
    this.idJourney = this.props.match.params.idJourney;
    this.state={
        View:null
    }
  }
  async componentDidMount( ) {
    const {default:View} = await import("./Setup");
    this.setState({
        View:View
    })
  }
  render(){
    return (
      <Container requireLogin {...this.props}  showDrawerIfIsDesktop={false}>
        <div elevation={0} style={{padding:10,display:"flex",alignItems:"center"}}>
            <Breadcrumbs style={{flexGrow:1}} >
              <a color="inherit"  href="javascript:void(0)" onClick={()=>this.props.history.goBack()} style={{textDecoration:"none",color:'#888888'}}>
                {this.context.apis.getLabel("Quay lại")}
              </a>
              <Typography color="textPrimary">
                <span id="view-title-container"></span>
              </Typography>
            </Breadcrumbs>
            <div id="view-actions-container">
            </div>
        </div>
        <Paper style={{margin:10,overflow:"hidden"}}>
            {!!this.state.View && <this.state.View {...this.props} idJourney = {this.idJourney}/>}
        </Paper>
      </Container>
    )
  }
}
SetupPage.contextType = AuthContext;
SetupPage.propTypes={
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
  mediaQueryMatches: PropTypes.bool,
}
export default  withRouter(withMediaQuery('(max-width:480px)')(SetupPage));