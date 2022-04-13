import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import withMediaQuery from "flexbiz-core/components/withMediaQuery";
import StrategickpiView from "flexbiz-core/components/strategic/StrategickpiView";
import Container from '../Container';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import AuthContext from "flexbiz-core/components/auth/Context";
class StrategickpiViewPage extends Component{
  constructor(props){
    super(props);
    const query = queryString.parse(this.props.location.search);
    this.currentTab = query.tab;
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
        <StrategickpiView {...this.props} currentTab={this.currentTab} _id={this.props.match.params} style={{height:height,paddingLeft:10,paddingRight:10}}/>
      </Container>
    )
  }
}
StrategickpiViewPage.contextType = AuthContext;
StrategickpiViewPage.propTypes={
    match: PropTypes.any,
    history: PropTypes.any,
    location: PropTypes.any,
    mediaQueryMatches: PropTypes.bool,
  }
export default  withRouter(withMediaQuery('(max-width:480px)')(StrategickpiViewPage));