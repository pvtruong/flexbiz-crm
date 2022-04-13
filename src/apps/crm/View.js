import React,{PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import ViewBase from "flexbiz-core/components/ViewBase";
import Container from './Container';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import AuthContext from "flexbiz-core/components/auth/Context";
class View extends PureComponent{
  constructor(props){
    super(props);
    const query = queryString.parse(this.props.location.search);
    this.currentTab = query.tab;
    this.code  = this.props.match.params.code
    this._id = this.props.match.params._id
  }
  render(){
    let height = (this.props.mediaQueryMatches?"100%":"calc(100vh - 65px - 45px)");
    return (
      <Container requireLogin {...this.props}  showDrawerIfIsDesktop={false}>
        <div elevation={0} style={{padding:10}}>
            <Breadcrumbs>
              <a color="inherit"  href="javascript:void(0)" onClick={()=>this.props.history.goBack()} style={{textDecoration:"none",color:'#888888'}}>
                {this.context.apis.getLabel("Quay lại")}
              </a>
              <Typography color="textPrimary">
                <span id="view-title-container"></span>
              </Typography>
            </Breadcrumbs>
        </div>
        <ViewBase {...this.props} code={this.code} currentTab = {this.currentTab} _id={this._id}  style={{height:height,paddingLeft:10,paddingRight:10}}/>
      </Container>
    )
  }
}
View.contextType = AuthContext;
View.propTypes={
  match: PropTypes.any,
  history: PropTypes.any,
  location: PropTypes.any,
  mediaQueryMatches: PropTypes.bool,
}
export default  withRouter(withMediaQuery('(max-width:480px)')(View));