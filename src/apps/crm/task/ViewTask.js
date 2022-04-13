import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import ViewTask from "flexbiz-core/components/task/ViewTask";
import Container from '../Container';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import AuthContext from "flexbiz-core/components/auth/Context";
class ViewTaskPage extends Component{
  constructor(props){
    super(props);
    const query = queryString.parse(this.props.location.search);
    this.currentTab = query.tab;
  }
  render(){
    let height = (this.props.mediaQueryMatches?undefined:"calc(100vh - 65px - 45px)");
    return (
      <Container requireLogin {...this.props}  showDrawerIfIsDesktop={false}>
        <div elevation={0} style={{padding:10}}>
            <Breadcrumbs>
              <a href="javascript:void(0)" onClick={()=>this.props.history.goBack()} style={{textDecoration:"none",color:'#888888'}}>
                {this.context.apis.getLabel("Quay lại")}
              </a>
              <Typography color="textPrimary">
                <span id="view-title-container"></span>
              </Typography>
            </Breadcrumbs>
        </div>
        <ViewTask {...this.props} currentTab={this.currentTab}  _id={this.props.match.params._id} style={{height:height,paddingLeft:10,paddingRight:10}}/>
      </Container>
    )
  }
}
ViewTaskPage.contextType = AuthContext;
ViewTaskPage.propTypes={
    match: PropTypes.any,
    history: PropTypes.any,
    location: PropTypes.any,
    mediaQueryMatches: PropTypes.bool,
  }
export default  withRouter(withMediaQuery('(max-width:480px)')(ViewTaskPage));